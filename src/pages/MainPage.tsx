import { Box, Heading, Text, VStack, Button, SimpleGrid } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function MainPage() {
  return (
    <Box p={6}>
      <VStack gap={8} align="center">
        <Heading size="xl" color="blue.600">
          🎯 메인 페이지
        </Heading>

        <Text fontSize="lg" textAlign="center" color="gray.600">
          주요 서비스들을 한눈에 확인하세요
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full" maxW="800px">
          <Button asChild size="lg" h="120px" colorScheme="green">
            <Link to="/requests">📝 신청해요 게시판</Link>
          </Button>

          <Button asChild size="lg" h="120px" colorScheme="purple">
            <Link to="/qr/scan">📱 QR 스캔</Link>
          </Button>

          <Button asChild size="lg" h="120px" colorScheme="orange">
            <Link to="/notifications">🔔 알림함</Link>
          </Button>

          <Button asChild size="lg" h="120px" colorScheme="red">
            <Link to="/ranking">🏆 학교 랭킹</Link>
          </Button>

          <Button asChild size="lg" h="120px" colorScheme="teal">
            <Link to="/account">💰 지갑/보증금</Link>
          </Button>

          <Button asChild size="lg" h="120px" colorScheme="gray">
            <Link to="/admin">⚙️ 관리자</Link>
          </Button>
        </SimpleGrid>

        <Button asChild variant="ghost" size="sm">
          <Link to="/">← 홈으로 돌아가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
