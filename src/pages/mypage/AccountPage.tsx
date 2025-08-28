import { Box, Heading, Text, VStack, Button, HStack, SimpleGrid } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function AccountPage() {
  return (
    <Box p={6}>
      <VStack gap={6} align="center">
        <Heading size="lg" color="teal.600">
          💰 지갑/보증금
        </Heading>

        <Text fontSize="md" textAlign="center" color="gray.600">
          현재 잔액과 보증금 현황을 확인하세요
        </Text>

        {/* 잔액 정보 */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full" maxW="600px">
          <Box
            p={6}
            border="1px solid"
            borderColor="green.200"
            rounded="lg"
            bg="green.50"
            textAlign="center"
          >
            <Text fontSize="lg" color="green.600" mb={2}>
              💰 현재 잔액
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="green.700">
              ₩25,000
            </Text>
            <Text fontSize="sm" color="green.600" mt={2}>
              충분한 잔액이 있습니다
            </Text>
          </Box>

          <Box
            p={6}
            border="1px solid"
            borderColor="blue.200"
            rounded="lg"
            bg="blue.50"
            textAlign="center"
          >
            <Text fontSize="lg" color="blue.600" mb={2}>
              💳 보증금
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="blue.700">
              ₩50,000
            </Text>
            <Text fontSize="sm" color="blue.600" mt={2}>
              정상적으로 보관중
            </Text>
          </Box>
        </SimpleGrid>

        {/* 거래 내역 */}
        <Box w="full" maxW="600px">
          <Heading size="md" mb={4} color="gray.700">
            📊 최근 거래 내역
          </Heading>
          <VStack gap={3} align="stretch">
            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack justify="space-between">
                <VStack align="start" gap={1}>
                  <Text fontWeight="bold">노트북 대여료</Text>
                  <Text fontSize="sm" color="gray.600">
                    2024.01.15 14:30
                  </Text>
                </VStack>
                <Text color="red.500" fontWeight="bold">
                  -₩5,000
                </Text>
              </HStack>
            </Box>

            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack justify="space-between">
                <VStack align="start" gap={1}>
                  <Text fontWeight="bold">보증금 반환</Text>
                  <Text fontSize="sm" color="gray.600">
                    2024.01.10 16:20
                  </Text>
                </VStack>
                <Text color="green.500" fontWeight="bold">
                  +₩10,000
                </Text>
              </HStack>
            </Box>

            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack justify="space-between">
                <VStack align="start" gap={1}>
                  <Text fontWeight="bold">프로젝터 대여료</Text>
                  <Text fontSize="sm" color="gray.600">
                    2024.01.08 09:15
                  </Text>
                </VStack>
                <Text color="red.500" fontWeight="bold">
                  -₩3,000
                </Text>
              </HStack>
            </Box>
          </VStack>
        </Box>

        {/* 액션 버튼 */}
        <HStack gap={4} wrap="wrap" justify="center">
          <Button colorScheme="teal" size="lg">
            충전하기
          </Button>
          <Button colorScheme="blue" size="lg">
            보증금 관리
          </Button>
          <Button variant="outline" size="lg">
            거래 내역 상세
          </Button>
        </HStack>

        <Button asChild variant="ghost" size="sm">
          <Link to="/main">← 메인으로 돌아가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
