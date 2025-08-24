import { Box, Heading, Text, VStack, Button, SimpleGrid } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function AdminMainPage() {
  return (
    <Box p={6}>
      <VStack gap={8} align="center">
        <Heading size="xl" color="gray.700">
          ⚙️ 관리자 메인
        </Heading>

        <Text fontSize="lg" textAlign="center" color="gray.600">
          대여 서비스 관리 시스템입니다
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full" maxW="800px">
          <Button asChild size="lg" h="120px" colorScheme="blue">
            <Link to="/admin/overview">📊 현황 (실시간/지표)</Link>
          </Button>

          <Button asChild size="lg" h="120px" colorScheme="purple">
            <Link to="/admin/qr">📱 QR 관리</Link>
          </Button>

          <Button asChild size="lg" h="120px" colorScheme="green">
            <Link to="/admin/reports">📋 보고서</Link>
          </Button>

          <Button asChild size="lg" h="120px" colorScheme="teal">
            <Link to="/admin/account">💰 계정 관리</Link>
          </Button>
        </SimpleGrid>

        {/* 간단한 통계 */}
        <Box w="full" maxW="800px">
          <Heading size="md" mb={4} color="gray.700">
            📈 오늘의 요약
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md" textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                15
              </Text>
              <Text fontSize="sm" color="gray.600">
                신규 대여
              </Text>
            </Box>
            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md" textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                8
              </Text>
              <Text fontSize="sm" color="gray.600">
                반납 완료
              </Text>
            </Box>
            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md" textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                3
              </Text>
              <Text fontSize="sm" color="gray.600">
                대기중
              </Text>
            </Box>
            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md" textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="red.600">
                1
              </Text>
              <Text fontSize="sm" color="gray.600">
                지연 반납
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        <Button asChild variant="ghost" size="sm">
          <Link to="/main">← 메인으로 돌아가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
