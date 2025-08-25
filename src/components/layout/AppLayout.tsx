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
  Portal
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
  // 1. 모달을 띄울 컨테이너의 ref입니다.
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 2. zustand 모달 store를 사용합니다.
  const { isModalOpen, modalTitle, modalCaption, modalBody, modalFooter, openModal, closeModal } = useModalStore();

  // 3. 모달을 여는 함수
  const handleOpenModal = () => {
    openModal({
      title: '앱 스크린 내부 모달',
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
            />
          </Portal>

          <Box
            // 이 Box가 모달의 부모가 됩니다.
            ref={containerRef}
            position="relative"
            w="100%"
            maxW="520px"
            minW="375px"
            h="100dvh"
            overflow="hidden" // Portal로 띄운 자식도 overflow:hidden의 영향을 받습니다.
            bg="white"
            boxShadow={{ base: 'none', lg: 'lg' }}
            rounded={{ base: 'none', lg: '2xl' }}
          >
            <Container
              maxW="560px"
              w="full"
              h="100dvh"
              p={4} // 버튼이 보이도록 패딩 추가
              overflowY="auto"
              style={{ overscrollBehavior: 'contain' }}
            >
              {/* 3. 모달을 여는 테스트용 버튼입니다. */}
              <Button onClick={handleOpenModal}>앱 스크린 안에 모달 열기</Button>

              {children || <Outlet />}
            </Container>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}