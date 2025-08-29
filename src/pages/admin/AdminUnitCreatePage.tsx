// src/pages/admin/AdminUnitCreatePage.tsx
import * as React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { Button } from '@/components/Button';
import ImagePickerGrid from '@/components/Input/ImagePickerGrid';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { postRequest } from '@/api/requests';

type ImageLike = {
  id: string;
  file: File;
  url: string;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
  s3Key?: string;
  errorMessage?: string;
};

interface PresignedUrlResponse {
  key: string;
  url: string;
}

export default function UnitCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달받은 아이템 정보
  const { createdItemId, createdItemName } = location.state || {};

  const [description] = React.useState('');
  const [status] = React.useState('AVAILABLE');
  const [images, setImages] = React.useState<ImageLike[]>([]);

  // 아이템 ID가 없으면 이전 페이지로 돌아가기
  React.useEffect(() => {
    if (!createdItemId) {
      navigate('/admin/items/create');
      return;
    }
  }, [createdItemId, navigate]);

  // 메모리 누수 방지: URL revoke
  React.useEffect(() => {
    return () => images.forEach((i) => URL.revokeObjectURL(i.url));
  }, [images]);

  // 사진 추가 시 S3 업로드 처리
  const handleAddImages = async (files: File[]) => {
    const newImages: ImageLike[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      uploadStatus: 'pending',
    }));

    setImages((prev) => [...prev, ...newImages]);

    // 각 사진에 대해 Presigned URL 발급 및 S3 업로드
    for (const image of newImages) {
      try {
        // 1. Presigned URL 발급
        console.log('Presigned URL 요청 데이터:', {
          imageType: 'UNIT',
          fileName: image.file.name,
        });

        const presignedResponse = await postRequest<PresignedUrlResponse>(
          '/images/presign/upload',
          {
            imageType: 'UNIT', // 임시로 'UNIT' 사용
            fileName: image.file.name,
          }
        );

        console.log('Presigned URL 응답:', presignedResponse);

        // 2. S3에 직접 업로드 (fetch 사용)
        console.log('S3 업로드 요청 시작:', presignedResponse.url);
        const uploadResponse = await fetch(presignedResponse.url, {
          method: 'PUT',
          body: image.file,
          headers: {
            'Content-Type': image.file.type,
          },
        });
        console.log('S3 업로드 응답:', uploadResponse);

        if (uploadResponse.ok) {
          // 업로드 성공
          console.log('S3 업로드 성공:', presignedResponse.key);

          // API 요청에 필요한 정보들을 저장 (key만 실제 값, 나머지는 null)
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? {
                    ...img,
                    uploadStatus: 'success',
                    s3Key: presignedResponse.key,
                    // 나머지는 null로 설정
                    mime: null,
                    hash: null,
                    takenAt: null,
                  }
                : img
            )
          );
        } else {
          throw new Error('S3 업로드 실패');
        }
      } catch (error) {
        console.error('사진 업로드 실패:', error);

        // 업로드 실패
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  uploadStatus: 'error',
                  errorMessage: '업로드 실패',
                }
              : img
          )
        );
      }
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const validate = () => {
    if (images.length === 0) return '최소 1장의 이미지를 첨부해주세요.';

    // 모든 이미지가 업로드 완료되었는지 확인
    const hasUnfinishedUploads = images.some((img) => img.uploadStatus !== 'success');
    if (hasUnfinishedUploads) return '모든 이미지 업로드가 완료될 때까지 기다려주세요.';

    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    try {
      // API 요청에 맞는 형태로 데이터 구성 (이미지 순서대로 1번, 2번... 자동 부여)
      const unitsData = {
        units: images.map((img, index) => ({
          assetNo: `${index + 1}`, // 예: "A001-1", "A001-2", "A001-3"
          description: description,
          status: status,
          photo: {
            key: img.s3Key!,
            mime: null,
            hash: null,
            takenAt: null,
          },
        })),
      };

      console.log('API 요청 데이터:', unitsData);

      // API 호출
      const response = await postRequest(`/admin/items/${createdItemId}/units`, unitsData);
      console.log('API 응답:', response);

      alert('유닛 생성 완료!');
      navigate('/admin/overview');
    } catch (error) {
      console.error('API 호출 실패:', error);
      alert('유닛 생성에 실패했습니다.');
    }
  };

  return (
    <Box w="full" maxW="520px" mx="auto">
      {/* 상단 헤더 */}
      <PageHeader
        title="개체 등록"
        subtitle={`${createdItemName || '아이템'}에 대한 개체를 등록합니다.`}
      />

      {/* 본문 폼 */}
      <VStack
        as="form"
        align="stretch"
        gap={3}
        px={4}
        py={4}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* 사진 영역 */}
        <ImagePickerGrid
          images={images}
          onAdd={handleAddImages}
          onRemove={handleRemoveImage}
          max={5}
        />

        {/* 제출 */}
        <Button label="제출" onClick={handleSubmit} />
      </VStack>
    </Box>
  );
}
