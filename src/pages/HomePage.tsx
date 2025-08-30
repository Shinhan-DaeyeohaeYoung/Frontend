import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Image, VStack } from '@chakra-ui/react';
import { useAuthStore } from '@/stores/authStore';
// ✅ 정적 자산은 import로! (Vite가 해시 경로로 바꿔줌)
import logoUrl from '@/assets/imgs/main_logo.png?url';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // ✅ 로고 프리로드(초기 깜빡임 줄이기)
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = logoUrl;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      navigate(isAuthenticated ? '/rent' : '/login');
    }, 1200); // 필요하면 200~800ms로 더 줄여도 OK
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  if (isLoading) {
    return (
      <Box minH="100dvh" display="flex" alignItems="center" justifyContent="center" bg="white">
        <VStack gap={6}>
          <Image
            src={logoUrl} // ✅ import한 경로 사용
            alt="Main Logo"
            maxW="300px"
            w="full"
            h="auto"
          />
        </VStack>
      </Box>
    );
  }

  return null;
}
