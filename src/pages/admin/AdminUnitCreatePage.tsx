// src/pages/admin/AdminUnitCreatePage.tsx
import * as React from 'react';
import { Box, VStack, Textarea, Input } from '@chakra-ui/react';
import { Button } from '@/components/Button';
import TextInput from '@/components/Input/TextInput';
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

  const [assetNo, setAssetNo] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [status, setStatus] = React.useState('AVAILABLE');
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
        const presignedResponse = await postRequest<PresignedUrlResponse>(
          '/images/presign/upload',
          {
            imageType: 'UNIT', // 임시로 'UNIT' 사용
            fileName: image.file.name,
          }
        );

        // 2. S3에 직접 업로드
        const uploadResponse = await fetch(presignedResponse.url, {
          method: 'PUT',
          body: image.file,
          headers: {
            'Content-Type': image.file.type,
          },
        });

        if (uploadResponse.ok) {
          // 업로드 성공
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? { ...img, uploadStatus: 'success', s3Key: presignedResponse.key }
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
    if (!assetNo.trim()) return '자산번호를 입력해주세요.';
    if (!description.trim()) return '설명을 입력해주세요.';
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

    // 여기서 unit 생성 API 호출 예정
    console.log('업로드된 이미지들:', images);
    console.log(
      'S3 Keys:',
      images.map((img) => img.s3Key)
    );

    alert('업로드 완료! API 응답을 확인해보세요.');
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
        {/* 자산번호 */}
        <TextInput
          placeholder="자산번호를 입력해주세요"
          value={assetNo}
          onChange={(e) => setAssetNo(e.target.value)}
        />

        {/* 설명 */}
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="개체에 대한 설명을 입력해주세요"
          minH="120px"
          bg="white"
          borderRadius="xl"
          borderColor="gray.300"
          _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #A4B8FB' }}
        />

        {/* 상태 선택 */}
        <Input
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="상태 (예: AVAILABLE, MAINTENANCE, BROKEN)"
          h="36px"
          bg="white"
          borderRadius="xl"
          borderColor="gray.300"
          _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #A4B8FB' }}
        />

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
