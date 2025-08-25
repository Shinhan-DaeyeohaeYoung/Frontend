// src/components/layout/AppLayout.tsx
import type { PropsWithChildren } from 'react';
import { Box, Grid, GridItem, Flex, Text, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import bgImage from '@/assets/imgs/profile_bg.png';

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

/** 화면 전체 고정 배경 레이어 */
function BackgroundLayer() {
  return (
    <Box
      aria-hidden
      position="fixed"
      inset={0}
      zIndex={0}
      pointerEvents="none"
      bgImage={`url(${bgImage})`}
      bgRepeat="repeat" // 한 장을 채우고 싶으면 'no-repeat'
      bgSize="auto" // 한 장을 꽉 채우려면 'cover'
    />
  );
}

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <Box minH="100dvh" position="relative">
      {/* 화면 전체에 깔리는 고정 배경 */}
      <BackgroundLayer />

      {/* 실제 컨텐츠는 배경 위로 (zIndex 1) */}
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

        <GridItem display="flex" justifyContent="center" alignItems="center" position="relative">
          <Box
            position="relative"
            w={{ base: '100%', mobile: '520px' }}
            h="100dvh"
            overflow="hidden"
            bg="white"
          >
            <Container maxW="560px" w="full" h="100dvh" p={0} overflowY="auto">
              {children || <Outlet />}
            </Container>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
