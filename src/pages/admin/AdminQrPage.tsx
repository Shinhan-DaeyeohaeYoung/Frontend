import { useState, useEffect } from 'react';
import { Box, VStack, Container, Text } from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';
import { getRequest } from '@/api/requests';

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
  const [currentPage, setCurrentPage] = useState<PageState>('main');
  const [countdown, setCountdown] = useState<number>(0);
  const [qrData, setQrData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 카운트다운 로직
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && currentPage !== 'main') {
      // 카운트다운이 끝나면 메인 페이지로 돌아감
      setCurrentPage('main');
    }
  }, [countdown, currentPage]);

  // QR 메타데이터 가져오기
  const fetchQRMeta = async (type: 'RENT' | 'RETURN') => {
    try {
      setIsLoading(true);
      const response = await getRequest<QRMetaResponse>('/api/admin/org-qr/meta', {
        params: {
          universityId: 1, // 실제로는 authStore에서 가져와야 함
          organizationId: 2, // 실제로는 authStore에서 가져와야 함
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
  };

  const handleReturnClick = async () => {
    setCurrentPage('return');
    setCountdown(50);
    await fetchQRMeta('RETURN');
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

  const getPageTitle = () => {
    switch (currentPage) {
      case 'rental':
        return '대여하기';
      case 'return':
        return '반납하기';
      default:
        return 'QR 페이지';
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      case 'rental':
      case 'return':
        return undefined;
      default:
        return '대여관련 설명\n대여하기 버튼을\n누른 뒤에\nQR 찍어주세요';
    }
  };

  const renderMainContent = () => {
    if (currentPage === 'main') {
      return (
        <VStack gap={4} w="full">
          <Button
            label="대여하기(QR 띄우기)"
            size="lg"
            w="full"
            bg="#ff4d8d"
            color="white"
            _hover={{ bg: '#e63d7a' }}
            borderRadius="xl"
            py={6}
            onClick={handleRentalClick}
            disabled={isLoading}
          />

          <Button
            label="반납하기(QR 띄우기)"
            size="lg"
            w="full"
            bg="gray.100"
            color="gray.600"
            _hover={{ bg: 'gray.200' }}
            borderRadius="xl"
            py={6}
            onClick={handleReturnClick}
            disabled={isLoading}
          />
        </VStack>
      );
    }

    // QR 화면 (대여하기 또는 반납하기)
    return (
      <VStack gap={6} w="full">
        {/* QR 코드 영역 */}
        <Box
          bg="white"
          p={8}
          borderRadius="2xl"
          w="300px"
          h="300px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="2px solid"
          borderColor="gray.200"
        >
          {/* 실제 QR 코드 표시 */}
          {isLoading ? (
            <Text color="gray.500">QR 생성 중...</Text>
          ) : (
            <QRCodeSVG value={qrData} size={250} level="M" includeMargin={true} />
          )}
        </Box>

        {/* 카운트다운 */}
        <Text fontSize="xl" fontWeight="bold" color="gray.700">
          {countdown}초 ~ 0초
        </Text>

        {/* QR 새로고침 버튼 */}
        <Button
          label="QR 새로고침"
          size="lg"
          w="full"
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
      </VStack>
    );
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #ff4d8d, #7a5cf5)">
      <Container maxW="md" py={0}>
        <VStack gap={6} align="stretch">
          {/* 헤더 */}
          <PageHeader
            title={getPageTitle()}
            subtitle={getPageSubtitle()}
            align="center"
            color="white"
          />

          {/* 메인 카드 */}
          <Box bg="white" shadow="xl" borderRadius="2xl" p={8}>
            {renderMainContent()}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
