import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Text, VStack, HStack, Input } from '@chakra-ui/react';
import { postRequest } from '@/api/requests';

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

interface PresignedUrlResponse {
  key: string;
  url: string;
}

interface Item {
  id: number;
  name: string;
  rentalId: number;
  universityId: number;
  organizationId: number;
  userId: number;
  unitImageUrl?: string;
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
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('파일 크기는 10MB 이하여야 합니다.');
        return;
      }

      setError(null);

      const newImage: ImageLike = {
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        uploadStatus: 'pending',
      };

      setSelectedImage(newImage);

      try {
        const presignedResponse = await postRequest<PresignedUrlResponse>(
          '/images/presign/upload',
          {
            imageType: 'ITEM',
            fileName: file.name,
          }
        );

        const uploadResponse = await fetch(presignedResponse.url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (uploadResponse.ok) {
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
      const returnRequestData: ReturnRequestData = {
        universityId: item.universityId,
        organizationId: item.organizationId,
        userId: userId,
        rentalId: item.rentalId,
        imageKey: selectedImage.s3Key,
        imageMime: selectedImage.file.type,
        imageHash: '',
        imageTakenAt: new Date().toISOString(),
      };

      await submitReturnRequest(returnRequestData);
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

      <VStack align="stretch" gap={4} p={4} flex="1" overflowY="auto">
        <Text fontWeight="semibold">반납 상태</Text>

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

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          display="none"
        />

        {error && (
          <Box bg="red.50" border="1px solid" borderColor="red.200" rounded="md" p={3}>
            <Text color="red.600" fontSize="sm">
              {error}
            </Text>
          </Box>
        )}
      </VStack>

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

export { ReturnModal };
