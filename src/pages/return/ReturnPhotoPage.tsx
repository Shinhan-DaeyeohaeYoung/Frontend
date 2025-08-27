import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
  //   useToast,
  VStack,
} from '@chakra-ui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useModalStore } from '@/stores/modalStore';
// import { X } from 'lucide-react';

type LocationState = { itemName?: string };

const MAX_MB = 10;

const ReturnPhotoPage: React.FC = () => {
  const { itemId } = useParams();
  const { state } = useLocation();
  const itemName = (state as LocationState)?.itemName;
  const navigate = useNavigate();
  //   const toast = useToast();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const pickFile = () => inputRef.current?.click();

  const handleFile = (f: File | null) => {
    if (!f) {
      setFile(null);
      return;
    }
    // 검증: 이미지 타입/최대 크기
    if (!f.type.startsWith('image/')) {
      toast({ status: 'error', description: '이미지 파일만 업로드할 수 있어요.' });
      return;
    }
    if (f.size / (1024 * 1024) > MAX_MB) {
      toast({
        status: 'error',
        description: `파일 크기는 최대 ${MAX_MB}MB 이하여야 해요.`,
      });
      return;
    }
    setFile(f);
  };

  // 드래그 앤 드롭
  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer?.files?.[0];
    if (f) handleFile(f);
  };
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 미리보기 URL
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const canSubmit = useMemo(() => !!file, [file]);
  const { openModal, closeModal } = useModalStore();
  const submit = async () => {
    // TODO: 실제 업로드가 필요하면 아래 FormData 사용
    // const fd = new FormData();
    // fd.append('itemId', String(itemId ?? ''));
    // if (file) fd.append('photo', file);
    // await api.post('/return/photo', fd);

    openModal({
      title: '일반 모달',
      body: (
        <Box>
          <Text>반납이 완료되었습니다.</Text>
          <Button
            variant="outline"
            onClick={() => {
              closeModal();
              navigate(`/rent`, {
                replace: true,
                // state: {
                //   itemName,
                //   // 미리보기 URL만 전달(데모). 실제론 서버 반환 데이터 전달 권장
                //   preview,
                // },
              });
            }}
          >
            홈으로 가기
          </Button>
        </Box>
      ),
    });
  };

  return (
    <Box bg="gray.50" minH="100dvh">
      <Container maxW="container.sm" py={6}>
        <VStack align="stretch">
          <Heading size="md" color="gray.800">
            반납 상태
          </Heading>
          <Text fontSize="sm" color="gray.600" whiteSpace="pre-line">
            {itemName ? `${itemName} 반납 상태를 기록해 주세요.` : '사진을 첨부해 주세요.'}
          </Text>

          {/* 업로드 박스 */}
          <Box>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              // 모바일 카메라 힌트
              capture="environment"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <Box
              role="button"
              tabIndex={0}
              onClick={pickFile}
              onKeyDown={(e) => e.key === 'Enter' && pickFile()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              border="1px solid"
              borderColor="gray.300"
              rounded="md"
              bg="white"
              minH="180px"
              px={4}
              py={6}
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              _hover={{ shadow: 'sm' }}
              _active={{ shadow: 'md' }}
            >
              {!preview ? (
                <VStack whiteSpace="pre-line">
                  <Text color="gray.800" fontWeight="semibold" textAlign="center">
                    사진을 첨부해주세요
                    {'\n'}(1장만)
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    탭하여 선택 또는 드래그 앤 드롭
                  </Text>
                </VStack>
              ) : (
                <Box w="100%" position="relative">
                  <Image
                    src={preview}
                    alt={file?.name ?? 'preview'}
                    w="100%"
                    h="200px"
                    objectFit="cover"
                    rounded="md"
                  />
                  <IconButton
                    aria-label="첨부 제거"
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    position="absolute"
                    top={2}
                    right={2}
                  >
                    {/* <X /> */}
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>

          {/* 하단 버튼 여백 확보 */}
          <Box h="56px" />
        </VStack>
      </Container>
      <Container maxW="container.sm">
        <Button w="100%" size="lg" colorScheme="blue" disabled={!canSubmit} onClick={submit}>
          완료
        </Button>
      </Container>
    </Box>
  );
};

export default ReturnPhotoPage;
