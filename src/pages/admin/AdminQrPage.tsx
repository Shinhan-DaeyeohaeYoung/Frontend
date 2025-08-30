import { useState, useEffect } from 'react';
import { Box, VStack, Container, Text, Flex, Image } from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/Button';
import Modal from '@/components/Modal';
import { getRequest } from '@/api/requests';
import { useAuthStore } from '@/stores/authStore';
import { AspectRatio } from '@chakra-ui/react';
import logo_03 from '@/assets/imgs/logo_03.png';
import logo_05 from '@/assets/imgs/logo_05.png';
type PageState = 'main' | 'rental' | 'return';

interface QRMetaResponse {
  token: string;
  type: string;
  universityId: number;
  organizationId: number;
  issuedAt: string;
  expiresAt: string;
}

export default function AdminQrPage() {
  const { user, universityId } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<PageState>('main');
  const [countdown, setCountdown] = useState<number>(0);
  const [qrData, setQrData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 카운트다운 로직
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && currentPage !== 'main') {
      // 카운트다운이 끝나면 모달 닫기
      setIsModalOpen(false);
      setCurrentPage('main');
    }
  }, [countdown, currentPage]);

  // QR 메타데이터 가져오기
  const fetchQRMeta = async (type: 'RENT' | 'RETURN') => {
    try {
      setIsLoading(true);

      // authStore에서 universityId와 organizationId 가져오기
      const currentUniversityId = universityId || user?.universityId;

      // admin 값에 따라 해당하는 organizationInfo 가져오기
      let currentOrganizationId: number | undefined;

      if (user?.admin === 'university') {
        currentOrganizationId = user.organizationInfo?.university?.id;
      } else if (user?.admin === 'college') {
        currentOrganizationId = user.organizationInfo?.college?.id;
      } else if (user?.admin === 'department') {
        currentOrganizationId = user.organizationInfo?.department?.id;
      }

      if (!currentUniversityId || !currentOrganizationId) {
        throw new Error('대학교 ID 또는 조직 ID를 찾을 수 없습니다.');
      }

      const response = await getRequest<QRMetaResponse>('/admin/org-qr/meta', {
        params: {
          universityId: currentUniversityId,
          organizationId: currentOrganizationId,
          type: 'SITE',
          page: 0,
          size: 20,
        },
      });

      if (response) {
        const baseUrl = window.location.origin;
        const qrUrl =
          type === 'RENT'
            ? `${baseUrl}/qr/rent?token=${response.token}`
            : `${baseUrl}/qr/return?token=${response.token}`;

        setQrData(qrUrl);
      }
    } catch (error) {
      console.error('QR 메타데이터 가져오기 실패:', error);
      // 에러 시 기본 데이터로 폴백
      setQrData(`fallback_${type}_${Date.now()}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRentalClick = async () => {
    setCurrentPage('rental');
    setCountdown(50);
    await fetchQRMeta('RENT');
    setIsModalOpen(true);
  };

  const handleReturnClick = async () => {
    setCurrentPage('return');
    setCountdown(50);
    await fetchQRMeta('RETURN');
    setIsModalOpen(true);
  };

  const handleRefreshQR = async () => {
    // QR 새로고침 시 카운트다운을 다시 50초로 리셋하고 새로운 QR 데이터 생성
    setCountdown(50);
    if (currentPage === 'rental') {
      await fetchQRMeta('RENT');
    } else if (currentPage === 'return') {
      await fetchQRMeta('RETURN');
    }
  };

  const getModalTitle = () => {
    switch (currentPage) {
      case 'rental':
        return '대여하기';
      case 'return':
        return '반납하기';
      default:
        return 'QR 페이지';
    }
  };

  const renderMainContent = () => {
    return (
      <VStack gap={4} w="full">
        {/* 대여하기 QR - 정사각형 */}
        <AspectRatio ratio={1} w="full">
          {/* bgImage={`url(${logo_03})`} // ✅ 원하는 이미지 경로로 교체 */}
          <Button
            shadow="sm"
            bgColor={'#FFAD67'}
            position={'relative'}
            aria-label="대여하기 QR"
            onClick={handleRentalClick}
            disabled={isLoading}
            w="100%"
            h="100%"
            p={0}
            borderRadius="2xl"
            overflow="hidden"
            // bgImage="url('/assets/images/return-qr.jpg')" // ✅ 원하는 이미지 경로로 교체
            // bgSize="cover"
            bgPos="center"
            color="white"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            transition="transform .15s ease"
            label=""
          >
            <VStack
              w="100%"
              h="100%"
              align="flex-start"
              justify="flex-end"
              p={5}
              bgGradient="linear(to-t, blackAlpha.600, blackAlpha.100 40%, transparent)"
              gap={1}
            >
              <Text fontSize="3xl" fontWeight="bold">
                대여하기 QR
              </Text>
              <Text fontSize="sm" opacity={0.9}>
                스캔하여 대여를 진행하세요
              </Text>
            </VStack>
            <Image
              src={logo_05}
              alt="rent icon"
              position="absolute"
              top={4}
              right={0}
              boxSize={240} // ✅ 원하는 사이즈
              objectFit="contain"
              pointerEvents="none"
            ></Image>
          </Button>
        </AspectRatio>

        {/* 반납하기 QR - 정사각형 */}
        <AspectRatio ratio={1} w="full">
          <Button
            shadow="sm"
            bgColor={'#95CAFF'}
            aria-label="반납하기 QR"
            onClick={handleReturnClick}
            disabled={isLoading}
            w="100%"
            h="100%"
            p={0}
            borderRadius="2xl"
            overflow="hidden"
            bgImage="url('/assets/images/return-qr.jpg')" // ✅ 원하는 이미지 경로로 교체
            bgSize="cover"
            bgPos="center"
            color="white"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            transition="transform .15s ease"
            label=""
          >
            <VStack
              w="100%"
              h="100%"
              align="flex-start"
              justify="flex-end"
              p={5}
              bgGradient="linear(to-t, blackAlpha.600, blackAlpha.100 40%, transparent)"
              gap={1}
            >
              <Text fontSize="3xl" fontWeight="bold">
                반납하기 QR
              </Text>
              <Text fontSize="sm" opacity={0.9}>
                스캔하여 반납을 진행하세요
              </Text>
            </VStack>
            <Image
              src={logo_03}
              alt="rent icon"
              position="absolute"
              top={4}
              right={0}
              boxSize={240} // ✅ 원하는 사이즈
              objectFit="contain"
              pointerEvents="none"
            ></Image>
          </Button>
        </AspectRatio>
      </VStack>
    );
  };

  const renderQRModalContent = () => {
    return (
      <VStack gap={8} w="full" h="full" justify="center">
        {/* QR 코드 영역 */}
        <Box
          bg="white"
          p={10}
          borderRadius="2xl"
          w="400px"
          h="400px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="3px solid"
          borderColor="gray.200"
          mx="auto"
        >
          {/* 실제 QR 코드 표시 */}
          {isLoading ? (
            <Text color="gray.500" fontSize="lg">
              QR 생성 중...
            </Text>
          ) : (
            <QRCodeSVG value={qrData} size={350} level="M" includeMargin={true} />
          )}
        </Box>

        {/* 카운트다운 */}
        <Text fontSize="3xl" fontWeight="bold" color="gray.700">
          {countdown}초
        </Text>

        {/* QR 새로고침 버튼 */}
        <Button
          label="QR 새로고침"
          size="lg"
          w="full"
          maxW="400px"
          bg="white"
          border="2px"
          borderColor="gray.300"
          color="gray.700"
          _hover={{
            borderColor: '#ff4d8d',
            color: '#ff4d8d',
          }}
          borderRadius="xl"
          py={6}
          onClick={handleRefreshQR}
          disabled={isLoading}
        />

        {/* 닫기 버튼 */}
        <Button
          label="닫기"
          size="lg"
          w="full"
          maxW="400px"
          bg="gray.100"
          color="gray.600"
          _hover={{ bg: 'gray.200' }}
          borderRadius="xl"
          py={4}
          onClick={() => setIsModalOpen(false)}
        />
      </VStack>
    );
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #ff4d8d, #7a5cf5)">
      <Container maxW="md" py={0} px={0}>
        <VStack gap={6} align="stretch">
          {/* 메인 카드 */}
          <Box bg="white" borderRadius="2xl" p={6}>
            {renderMainContent()}
          </Box>
        </VStack>
      </Container>

      {/* QR 풀스크린 모달 */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={getModalTitle()}
        body={renderQRModalContent()}
        fullscreen={true}
      />
    </Box>
  );
}
