import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Text, VStack, HStack, Input } from '@chakra-ui/react';
import { getRequest, postRequest } from '@/api/requests';

// API 타입 정의
interface ReturnRequestData {
  universityId: number;
  organizationId: number;
  userId: number;
  rentalId: number;
  imageKey: string;
  imageMime: string;
  imageHash: string;
  imageTakenAt: string;
}

interface PresignedUrlRequest {
  imageType: 'ITEM';
  fileName: string;
}

interface PresignedUrlResponse {
  key: string;
  url: string;
}

interface Item {
  id: number;
  name: string;
  rentalId: number;
  // 기타 필요한 속성들
}

interface ReturnModalProps {
  item: Item;
  userId: number;
  universityId: number;
  organizationId: number;
  onClose: () => void;
}

// 이미지 상태 타입 정의
type ImageLike = {
  id: string;
  file: File;
  url: string;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
  s3Key?: string;
  errorMessage?: string;
};

// 파일 해시 생성 함수
const generateFileHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

// 2. S3에 직접 업로드
// const uploadResponse = await fetch(presignedResponse.url, {
//     method: 'PUT',
//     body: image.file,
//     headers: {
//     'Content-Type': image.file.type,
//     },
// });

// Presigned URL 발급 함수
const getPresignedUrl = async (fileName: string): Promise<PresignedUrlResponse> => {
  return await postRequest<PresignedUrlResponse, PresignedUrlRequest>('/images/presign/upload', {
    imageType: 'ITEM',
    fileName,
  });
};

// 이미지 업로드 함수 (presigned URL 사용)
const uploadImage = async (file: File, presignedUrl: string): Promise<void> => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`이미지 업로드 실패: ${response.status}`);
  }
};

// 반납 신청 API 함수
const submitReturnRequest = async (data: ReturnRequestData): Promise<void> => {
  await postRequest<void, ReturnRequestData>('/return-requests', data);
};

const ReturnModal: React.FC<ReturnModalProps> = ({ item, userId, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<ImageLike | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 메모리 누수 방지: URL revoke
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.url);
      }
    };
  }, [selectedImage]);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 제한 (예: 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('파일 크기는 10MB 이하여야 합니다.');
        return;
      }

      setError(null);

      // 새로운 이미지 객체 생성
      const newImage: ImageLike = {
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        uploadStatus: 'pending',
      };

      setSelectedImage(newImage);

      // 즉시 S3 업로드 시작
      try {
        // 1. Presigned URL 발급
        console.log('Presigned URL 요청 데이터:', {
          imageType: 'ITEM',
          fileName: file.name,
        });

        const presignedResponse = await postRequest<PresignedUrlResponse>(
          '/images/presign/upload',
          {
            imageType: 'ITEM',
            fileName: file.name,
          }
        );

        console.log('Presigned URL 응답:', presignedResponse);

        // 2. S3에 직접 업로드 (fetch 사용)
        console.log('S3 업로드 요청 시작:', presignedResponse.url);
        const uploadResponse = await fetch(presignedResponse.url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });
        console.log('S3 업로드 응답:', uploadResponse);

        if (uploadResponse.ok) {
          // 업로드 성공
          console.log('S3 업로드 성공!');
          setSelectedImage((prev) =>
            prev
              ? {
                  ...prev,
                  uploadStatus: 'success',
                  s3Key: presignedResponse.key,
                }
              : null
          );
        } else {
          // 업로드 실패
          console.error('S3 업로드 실패:', uploadResponse.status);
          setSelectedImage((prev) =>
            prev
              ? {
                  ...prev,
                  uploadStatus: 'error',
                  errorMessage: 'S3 업로드에 실패했습니다.',
                }
              : null
          );
          setError('이미지 업로드에 실패했습니다.');
        }
      } catch (error) {
        console.error('S3 업로드 중 오류:', error);
        setSelectedImage((prev) =>
          prev
            ? {
                ...prev,
                uploadStatus: 'error',
                errorMessage: '업로드 중 오류가 발생했습니다.',
              }
            : null
        );
        setError('이미지 업로드 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!selectedImage || selectedImage.uploadStatus !== 'success' || !selectedImage.s3Key) {
      setError('사진을 첨부하고 업로드가 완료되어야 합니다.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('반납 신청 데이터 준비...');

      const returnRequestData: ReturnRequestData = {
        universityId: item.universityId,
        organizationId: item.organizationId,
        userId: userId,
        rentalId: item.rentalId,
        imageKey: selectedImage.s3Key, // S3에 업로드된 이미지 키 사용
        imageMime: selectedImage.file.type,
        imageHash: '', // 필요시 해시 생성
        imageTakenAt: new Date().toISOString(),
      };

      // 반납 신청 제출
      console.log('반납 신청 제출 중...');
      await submitReturnRequest(returnRequestData);

      console.log('반납 신청이 완료되었습니다.');
      onClose();
    } catch (error) {
      console.error('반납 신청 오류:', error);
      setError(error instanceof Error ? error.message : '반납 신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" h="100%" overflow="hidden">
      {/* 상단 헤더 */}
      <Box
        position="sticky"
        top={0}
        bg="white"
        zIndex="docked"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={4}
        py={3}
      >
        <Text fontWeight="semibold" fontSize="lg">
          반납하기
        </Text>
      </Box>

      {/* 메인 컨텐츠 */}
      <VStack align="stretch" gap={4} p={4} flex="1" overflowY="auto">
        <Text fontWeight="semibold">반납 상태</Text>

        {/* 사진 첨부 영역 */}
        <Box
          border="1px solid"
          borderColor="gray.300"
          rounded="lg"
          p={8}
          textAlign="center"
          bg="gray.50"
          minH="300px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          {selectedImage ? (
            <>
              <Box
                w="200px"
                h="200px"
                border="1px solid"
                borderColor="gray.300"
                rounded="md"
                overflow="hidden"
                mb={4}
                position="relative"
              >
                <img
                  src={selectedImage.url}
                  alt="선택된 이미지"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* 업로드 상태 표시 */}
                {selectedImage.uploadStatus === 'uploading' && (
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg="rgba(0,0,0,0.7)"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                  >
                    업로드 중...
                  </Box>
                )}

                {selectedImage.uploadStatus === 'success' && (
                  <Box
                    position="absolute"
                    top={2}
                    right={2}
                    bg="green.500"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    ✓
                  </Box>
                )}

                {selectedImage.uploadStatus === 'error' && (
                  <Box
                    position="absolute"
                    top={2}
                    right={2}
                    bg="red.500"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    ✗
                  </Box>
                )}
              </Box>

              <VStack gap={2}>
                {selectedImage.uploadStatus === 'success' && (
                  <Text color="green.600" fontSize="sm">
                    ✅ 이미지 업로드 완료
                  </Text>
                )}

                {selectedImage.uploadStatus === 'error' && (
                  <Text color="red.600" fontSize="sm">
                    ❌ 업로드 실패: {selectedImage.errorMessage}
                  </Text>
                )}

                <Button size="sm" variant="outline" onClick={handleCameraCapture}>
                  다른 사진 선택
                </Button>
              </VStack>
            </>
          ) : (
            <VStack>
              <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                사진을
              </Text>
              <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                첨부해주세요
              </Text>
              <Text fontSize="md" color="gray.500">
                (1장만)
              </Text>
              <Button colorScheme="blue" size="lg" onClick={handleCameraCapture} mt={4}>
                사진 선택
              </Button>
            </VStack>
          )}
        </Box>

        {/* 숨겨진 파일 입력 */}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          display="none"
        />

        {/* 에러 메시지 */}
        {error && (
          <Box bg="red.50" border="1px solid" borderColor="red.200" rounded="md" p={3}>
            <Text color="red.600" fontSize="sm">
              {error}
            </Text>
          </Box>
        )}
      </VStack>

      {/* 하단 완료 버튼 */}
      <Box
        position="sticky"
        bottom={0}
        bg="white"
        borderTop="1px solid"
        borderColor="gray.200"
        p={4}
      >
        <HStack>
          <Box bg="gray.100" px={3} py={1} rounded="full" fontSize="sm" color="gray.600">
            Section 16
          </Box>
          <Text fontSize="sm" color="gray.600">
            완료
          </Text>
        </HStack>
        <Button
          w="full"
          colorScheme="blue"
          size="lg"
          onClick={handleSubmit}
          disabled={!selectedImage || selectedImage.uploadStatus !== 'success'}
          loading={isSubmitting}
          loadingText="신청 중..."
          mt={2}
        >
          완료
        </Button>
      </Box>
    </Box>
  );
};

// QrReturnPage에서 사용할 수 있도록 수정된 handleOpenModal
const createHandleOpenModal = (openModal: any, closeModal: any) => {
  return (item: Item) => {
    // 실제 값들로 대체해야 함 - 현재 사용자 정보나 URL 파라미터에서 가져와야 함
    const universityId = 1; // getCurrentUniversityId() 등으로 대체
    const organizationId = 2; // URL 파라미터나 상태에서 가져와야 함

    openModal({
      body: (
        <ReturnModal
          item={item}
          //   userId={userId}
          //   universityId={universityId}
          //   organizationId={organizationId}
          onClose={closeModal}
        />
      ),
      fullscreen: true,
    });
  };
};

export { ReturnModal, createHandleOpenModal };

// QrReturnPage.tsx에서 사용하는 방법:
/*
import { ReturnModal, createHandleOpenModal } from './ReturnModal';

// QrReturnPage 컴포넌트 내부에서:
const { openModal, closeModal } = useModalStore();

// handleOpenModal을 createHandleOpenModal로 대체
const handleOpenModal = createHandleOpenModal(openModal, closeModal);

// 기존 버튼 클릭 핸들러는 그대로 사용 가능:
onClick={() => {
  handleOpenModal(el);
}}
*/
