import React, { useState, useRef } from 'react';
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

const ReturnModal: React.FC<ReturnModalProps> = ({
  item,
  userId,
  universityId,
  organizationId,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      setSelectedImage(file);
      setError(null);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // 카메라 캡처 버튼 클릭 시 파일 선택 다이얼로그 열기
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('사진을 첨부해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log(item);
      //   return;
      // 1. Presigned URL 발급
      console.log('Presigned URL 발급 중...');
      const { key, url } = await getPresignedUrl(selectedImage.name);

      // 2. 이미지 업로드
      //   console.log('이미지 업로드 중...');
      //   await uploadImage(selectedImage, url);

      // 3. 파일 해시 생성
      //   console.log('파일 해시 생성 중...');
      //   const imageHash = await generateFileHash(selectedImage);

      console.log('반납 신청 데이터 준비...');
      // 4. 반납 신청 데이터 준비

      const returnRequestData: ReturnRequestData = {
        universityId: item.universityId,
        organizationId: item.organizationId,
        userId: userId, // [todo]: authStore
        rentalId: item.rentalId,
        imageKey: key, // presigned URL 응답에서 받은 key 사용
        // imageMime: selectedImage.type,
        // imageHash,
        // imageTakenAt: new Date().toISOString(),
      };

      // 5. 반납 신청 제출
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
          {imagePreview ? (
            <>
              <Box
                w="200px"
                h="200px"
                border="1px solid"
                borderColor="gray.300"
                rounded="md"
                overflow="hidden"
                mb={4}
              >
                <img
                  src={imagePreview}
                  alt="선택된 이미지"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <Button size="sm" variant="outline" onClick={handleCameraCapture}>
                다른 사진 선택
              </Button>
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
          capture="environment" // 모바일에서 카메라 우선
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
          disabled={!selectedImage}
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
    const userId = 2; // getCurrentUserId() 등으로 대체
    const universityId = 1; // getCurrentUniversityId() 등으로 대체
    const organizationId = 2; // URL 파라미터나 상태에서 가져와야 함

    openModal({
      body: (
        <ReturnModal
          item={item}
          userId={userId}
          universityId={universityId}
          organizationId={organizationId}
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
