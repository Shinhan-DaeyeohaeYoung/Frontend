import React, { useState, useEffect } from 'react';
import { Box, VStack, Container, Text } from '@chakra-ui/react';
import { Button } from '@/components/Button'; // 경로는 프로젝트 구조에 맞게 조정
import { PageHeader } from '@/components/PageHeader'; // 경로는 프로젝트 구조에 맞게 조정

type PageState = 'main' | 'rental' | 'return';

export default function AdminQrPage() {
  const [currentPage, setCurrentPage] = useState<PageState>('main');
  const [countdown, setCountdown] = useState<number>(0);

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

  const handleRentalClick = () => {
    setCurrentPage('rental');
    setCountdown(50);
  };

  const handleReturnClick = () => {
    setCurrentPage('return');
    setCountdown(50);
  };

  const handleRefreshQR = () => {
    // QR 새로고침 시 카운트다운을 다시 50초로 리셋
    setCountdown(50);
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
          {/* 실제 QR 코드가 들어갈 자리 - 임시로 QR 패턴 표시 */}
          <Box
            w="250px"
            h="250px"
            bg="black"
            backgroundImage={`
              repeating-linear-gradient(
                0deg,
                black,
                black 10px,
                white 10px,
                white 20px
              ),
              repeating-linear-gradient(
                90deg,
                black,
                black 10px,
                white 10px,
                white 20px
              )
            `}
            backgroundBlendMode="multiply"
            borderRadius="lg"
          />
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
            bgColor="transparent"
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
