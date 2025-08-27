// src/components/layout/AppLayout.tsx
import type { PropsWithChildren } from 'react';
import { Box, Grid, GridItem, Flex, Text, Container, Portal } from '@chakra-ui/react';
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
    closeModal,
  } = useModalStore();

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
              {children || <Outlet />}
            </Container>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
