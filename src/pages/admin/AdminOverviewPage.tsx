import { Box, Heading, Text, VStack, Button, SimpleGrid, HStack, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function AdminOverviewPage() {
  return (
    <Box p={6}>
      <VStack gap={8} align="center">
        <Heading size="xl" color="blue.600">
          📊 현황 (실시간/지표)
        </Heading>

        <Text fontSize="lg" textAlign="center" color="gray.600">
          실시간 대여 현황과 주요 지표를 확인하세요
        </Text>

        {/* 실시간 통계 */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} w="full" maxW="900px">
          <Box
            p={6}
            border="1px solid"
            borderColor="blue.200"
            rounded="lg"
            bg="blue.50"
            textAlign="center"
          >
            <Text fontSize="lg" color="blue.600" mb={2}>
              🔄 현재 대여중
            </Text>
            <Text fontSize="4xl" fontWeight="bold" color="blue.700">
              42
            </Text>
            <Text fontSize="sm" color="blue.600" mt={2}>
              총 50개 중
            </Text>
            <Box mt={3} w="full" bg="blue.200" rounded="full" h="8px">
              <Box w="84%" bg="blue.500" h="8px" rounded="full" />
            </Box>
          </Box>

          <Box
            p={6}
            border="1px solid"
            borderColor="green.200"
            rounded="lg"
            bg="green.50"
            textAlign="center"
          >
            <Text fontSize="lg" color="green.600" mb={2}>
              ✅ 오늘 반납
            </Text>
            <Text fontSize="4xl" fontWeight="bold" color="green.700">
              18
            </Text>
            <Text fontSize="sm" color="green.600" mt={2}>
              정시 반납률 95%
            </Text>
            <Box mt={3} w="full" bg="green.200" rounded="full" h="8px">
              <Box w="95%" bg="green.500" h="8px" rounded="full" />
            </Box>
          </Box>

          <Box
            p={6}
            border="1px solid"
            borderColor="orange.200"
            rounded="lg"
            bg="orange.50"
            textAlign="center"
          >
            <Text fontSize="lg" color="orange.600" mb={2}>
              ⏰ 대기 신청
            </Text>
            <Text fontSize="4xl" fontWeight="bold" color="orange.700">
              7
            </Text>
            <Text fontSize="sm" color="orange.600" mt={2}>
              평균 대기시간 2시간
            </Text>
            <Box mt={3} w="full" bg="orange.200" rounded="full" h="8px">
              <Box w="70%" bg="orange.500" h="8px" rounded="full" />
            </Box>
          </Box>
        </SimpleGrid>

        {/* 상세 현황 */}
        <Box w="full" maxW="900px">
          <Heading size="md" mb={4} color="gray.700">
            📋 상세 현황
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <Text fontWeight="bold" mb={2}>
                🔥 인기 대여 품목
              </Text>
              <VStack gap={2} align="stretch">
                <HStack justify="space-between">
                  <Text>노트북</Text>
                  <Badge colorScheme="red">15대 대여중</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text>프로젝터</Text>
                  <Badge colorScheme="orange">8대 대여중</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text>카메라</Text>
                  <Badge colorScheme="yellow">6대 대여중</Badge>
                </HStack>
              </VStack>
            </Box>

            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <Text fontWeight="bold" mb={2}>
                ⚠️ 주의 필요
              </Text>
              <VStack gap={2} align="stretch">
                <HStack justify="space-between">
                  <Text>지연 반납</Text>
                  <Badge colorScheme="red">1건</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text>장비 고장</Text>
                  <Badge colorScheme="orange">2건</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text>분실 신고</Text>
                  <Badge colorScheme="yellow">0건</Badge>
                </HStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>

        {/* 액션 버튼 */}
        <HStack gap={4} wrap="wrap" justify="center">
          <Button colorScheme="blue" size="lg">
            실시간 새로고침
          </Button>
          <Button colorScheme="green" size="lg">
            보고서 생성
          </Button>
          <Button variant="outline" size="lg">
            상세 분석
          </Button>
        </HStack>

        <Button asChild variant="ghost" size="sm">
          <Link to="/admin">← 관리자 메인으로 돌아가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
