import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Image, VStack } from '@chakra-ui/react';
import { useAuthStore } from '@/stores/authStore';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

      // 인증 상태에 따라 라우팅
      if (isAuthenticated) {
        navigate('/rent'); // 로그인된 사용자는 메인 페이지로
      } else {
        navigate('/login'); // 로그인되지 않은 사용자는 로그인 페이지로
      }
    }, 2000); // 2초 후 전환

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <VStack gap={6}>
          <Image
            src="/src/assets/imgs/main_logo.png"
            alt="Main Logo"
            maxW="300px"
            w="full"
            h="auto"
            animation="fade-in 0.5s ease-in-out"
          />
        </VStack>
      </Box>
    );
  }

  return null;
}
