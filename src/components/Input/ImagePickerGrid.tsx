// src/components/Input/ImagePickerGrid.tsx
import * as React from 'react';
import { Box, SimpleGrid, AspectRatio, Text, IconButton, VStack } from '@chakra-ui/react';
import { BiPlus, BiTrash } from 'react-icons/bi';

type ImageLike = { id: string; file: File; url: string };

interface ImagePickerGridProps {
  images: ImageLike[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  max?: number; // 기본 5장
}

export default function ImagePickerGrid({ images, onAdd, onRemove }: ImagePickerGridProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handlePick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onAdd(files);
    // 동일 파일 다시 선택 가능하게
    e.currentTarget.value = '';
  };

  return (
    <VStack w="full" align="stretch" gap={3}>
      <SimpleGrid columns={3} gap={3}>
        <AspectRatio
          ratio={1}
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.300"
          bg="white"
          onClick={handlePick}
          role="button"
          tabIndex={0}
          _hover={{ bg: 'gray.50' }}
        >
          <Box display="grid" placeItems="center">
            <IconButton aria-label="사진 추가" variant="ghost" size="xl" onClick={handlePick}>
              <BiPlus />
            </IconButton>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleChange}
            />
          </Box>
        </AspectRatio>

        {images.map((img, i) => (
          <AspectRatio key={img.id} ratio={1} position="relative">
            <Box
              overflow="hidden"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="gray.300"
              bg="gray.50"
            >
              {/* 실제 썸네일 */}
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img
                src={img.url}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* 오른쪽 위 삭제 버튼 */}
              <IconButton
                aria-label="사진 삭제"
                size="sm"
                variant="solid"
                position="absolute"
                top="6px"
                right="6px"
                onClick={() => onRemove(img.id)}
              >
                <BiTrash />
              </IconButton>

              {/* 좌하단 라벨 (예: '사진 12번' 같은 느낌) */}
              <Box
                position="absolute"
                left="6px"
                bottom="6px"
                px={2}
                py={0.5}
                borderRadius="md"
                bg="blackAlpha.600"
              >
                <Text color="white" fontSize="xs" lineHeight="1">
                  사진 {i + 1}번
                </Text>
              </Box>
            </Box>
          </AspectRatio>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
