// src/components/layout/AppLayout.tsx
import type { PropsWithChildren } from 'react';
import { 
  Box, 
  Grid, 
  GridItem, 
  Flex, 
  Text, 
  Container, 
  Button,
  Portal,
  VStack
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import bgImage from '@/assets/imgs/profile_bg.png';
import { useRef } from 'react';
import { useModalStore } from '@/stores/modalStore';
import Modal from '@/components/Modal/Modal';

function PcMent() {
  return (
    <Flex h="100dvh" align="center" justify="flex-start" pl="120px" pr={8}>
      <Box maxW="320px">
        <Box pl={10}>
          <Text color="gray.500">테스트 입니다</Text>
        </Box>
      </Box>
    </Flex>
  );
}

function BackgroundLayer() {
  return (
    <Box
      aria-hidden
      role="presentation"
      position="fixed"
      inset={0}
      zIndex={0}
      pointerEvents="none"
      bgImage={`url(${bgImage})`}
      bgRepeat="repeat"
      bgSize="auto"
    />
  );
}

export default function AppLayout({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    isModalOpen, 
    modalTitle, 
    modalCaption, 
    modalBody, 
    modalFooter, 
    modalFullscreen, // 풀스크린 상태 추가
    openModal, 
    closeModal 
  } = useModalStore();

  // 일반 모달을 여는 함수
  const handleOpenModal = () => {
    openModal({
      title: '일반 모달',
      body: (
        <Text>
          이 모달은 오른쪽 앱 스크린 영역을 벗어나지 않습니다.
          배경(Backdrop) 또한 해당 영역에만 적용됩니다.
        </Text>
      ),
      footer: (
        <Flex gap={2}>
          <Button variant="outline" onClick={closeModal}>닫기</Button>
          <Button>저장</Button>
        </Flex>
      )
    });
  };

  // 풀스크린 모달을 여는 함수
  const handleOpenFullscreenModal = () => {
    openModal({
      title: '물품 번호: 14',
      caption: '대표 사진 등록하기',
      body: (
        <VStack gap={4} align="stretch">
          <Box
            border="2px dashed"
            borderColor="gray.300"
            rounded="lg"
            p={8}
            textAlign="center"
            bg="gray.50"
            minH="200px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <VStack>
              <Text fontSize="4xl">📷</Text>
              <Text>대표 사진</Text>
              <Text fontSize="sm" color="gray.500">
                더블 클릭하여 선택하기
              </Text>
            </VStack>
          </Box>
          
          <Box>
            <Text fontSize="sm" color="gray.600" mb={2}>
              물품 설명 물품 설명 물품 설명 물품 설명 물품 설명 물품 
              설명 물품설명물품 설명 물품 설명 물품 설명 물품 설명물 
              품 물품 설명물품
            </Text>
            
            <Text fontSize="xs" color="gray.500">
              • 오늘 대여단위에서 08:17까지 반납되어 입니다 (2주)
              • QR 화이포니와에서 바 아람 키 아직 화이정씨
            </Text>
          </Box>
        </VStack>
      ),
      footer: (
        <Button w="full" onClick={closeModal}>
          대여하기
        </Button>
      ),
      fullscreen: true // 풀스크린 모드 활성화
    });
  };

  return (
    <Box minH="100dvh" position="relative">
      <BackgroundLayer />

      <Grid
        position="relative"
        zIndex={1}
        templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        w="100%"
        h="100dvh"
      >
        <GridItem
          display={{ base: 'none', lg: 'flex' }}
          alignItems="center"
          justifyContent="flex-start"
        >
          <PcMent />
        </GridItem>

        {/* 앱 스크린 영역 */}
        <GridItem display="flex" justifyContent="center" alignItems="center" position="relative">
          {/* Portal로 모달을 앱 스크린 내부에 렌더링 */}
          <Portal container={containerRef}>
            <Modal
              open={isModalOpen}
              onClose={closeModal}
              title={modalTitle}
              caption={modalCaption}
              body={modalBody}
              footer={modalFooter}
              fullscreen={modalFullscreen} // 풀스크린 prop 전달
            />
          </Portal>

          <Box
            ref={containerRef}
            position="relative"
            w="100%"
            maxW="520px"
            minW="375px"
            h="100dvh"
            overflow="hidden"
            bg="white"
            boxShadow={{ base: 'none', lg: 'lg' }}
            rounded={{ base: 'none', lg: '2xl' }}
          >
            <Container
              maxW="560px"
              w="full"
              h="100dvh"
              p={4}
              overflowY="auto"
              style={{ overscrollBehavior: 'contain' }}
            >
              {/* 테스트용 버튼들 */}
              <VStack gap={4} align="stretch">
                <Button onClick={handleOpenFullscreenModal} colorScheme="blue">
                  풀스크린 모달 열기
                </Button>
              </VStack>

              {children || <Outlet />}
            </Container>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}