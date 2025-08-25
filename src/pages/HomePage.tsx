import { Box, Heading, Text, VStack, Button, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <Box p={6}>
      <VStack gap={6} align="center">
        <Heading size="xl" color="blue.600">
          🏠 홈페이지
        </Heading>

        <Text fontSize="lg" textAlign="center" color="gray.600">
          마니또 마니띠와 함께하는 특별한 순간들
          <br />
          일상 속 따뜻한 마음을 주고받아요 💌
        </Text>

        <HStack gap={4} wrap="wrap" justify="center">
          <Button asChild colorScheme="blue" size="lg">
            <Link to="/main">메인으로 가기</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">로그인</Link>
          </Button>
        </HStack>

        <Box mt={8} p={4} bg="gray.50" rounded="lg" w="full" maxW="600px">
          <Text fontSize="sm" color="gray.500" textAlign="center">
            🚀 더미 페이지들이 준비되었습니다!
            <br />위 버튼들을 클릭해서 다양한 페이지들을 확인해보세요!
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}