import { Box, Heading, Text, VStack, Button, Input } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <Box p={6} maxW="400px" mx="auto">
      <VStack gap={6} align="stretch">
        <Heading size="lg" textAlign="center" color="blue.600">
          🔐 로그인
        </Heading>

        <Box>
          <Text fontWeight="medium" mb={2}>
            이메일
          </Text>
          <Input type="email" placeholder="example@email.com" />
        </Box>

        <Box>
          <Text fontWeight="medium" mb={2}>
            비밀번호
          </Text>
          <Input type="password" placeholder="••••••••" />
        </Box>

        <Button colorScheme="blue" size="lg">
          로그인
        </Button>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          계정이 없으신가요?{' '}
          <Link to="/signup" style={{ color: '#3182ce', textDecoration: 'underline' }}>
            회원가입
          </Link>
        </Text>

        <Button asChild variant="ghost" size="sm">
          <Link to="/main">메인으로 가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
