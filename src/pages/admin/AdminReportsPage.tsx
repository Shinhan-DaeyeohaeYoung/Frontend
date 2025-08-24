import { Box, Heading, Text, VStack, Button, SimpleGrid, HStack, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function AdminReportsPage() {
  return (
    <Box p={6}>
      <VStack gap={8} align="center">
        <Heading size="xl" color="green.600">
          📋 보고서
        </Heading>

        <Text fontSize="lg" textAlign="center" color="gray.600">
          대여 서비스 현황 보고서를 생성하고 관리하세요
        </Text>

        {/* 보고서 생성 옵션 */}
        <Box w="full" maxW="600px" p={6} border="1px solid" borderColor="gray.200" rounded="lg">
          <Heading size="md" mb={4} color="gray.700">
            📊 보고서 생성
          </Heading>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontWeight="medium" mb={2}>
                보고서 유형
              </Text>
              <select
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                }}
              >
                <option value="">보고서 유형을 선택하세요</option>
                <option value="daily">일일 보고서</option>
                <option value="weekly">주간 보고서</option>
                <option value="monthly">월간 보고서</option>
                <option value="quarterly">분기별 보고서</option>
                <option value="yearly">연간 보고서</option>
              </select>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                기간
              </Text>
              <select
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                }}
              >
                <option value="">기간을 선택하세요</option>
                <option value="today">오늘</option>
                <option value="yesterday">어제</option>
                <option value="this-week">이번 주</option>
                <option value="this-month">이번 달</option>
                <option value="custom">사용자 지정</option>
              </select>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                포함 내용
              </Text>
              <select
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                }}
              >
                <option value="">포함할 내용을 선택하세요</option>
                <option value="all">전체 내용</option>
                <option value="rental-only">대여 현황만</option>
                <option value="financial-only">재정 현황만</option>
                <option value="user-only">사용자 통계만</option>
              </select>
            </Box>

            <Button colorScheme="green" size="lg">
              보고서 생성
            </Button>
          </VStack>
        </Box>

        {/* 기존 보고서 목록 */}
        <Box w="full" maxW="800px">
          <Heading size="md" mb={4} color="gray.700">
            📁 기존 보고서
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">2024년 1월 월간 보고서</Text>
                <Badge colorScheme="green">완료</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                생성일: 2024.02.01
              </Text>
              <Text fontSize="sm" color="gray.600">
                크기: 2.3MB
              </Text>
              <HStack mt={3} gap={2}>
                <Button size="sm" colorScheme="blue">
                  다운로드
                </Button>
                <Button size="sm" variant="outline">
                  미리보기
                </Button>
                <Button size="sm" variant="outline" colorScheme="red">
                  삭제
                </Button>
              </HStack>
            </Box>

            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">2024년 1주차 주간 보고서</Text>
                <Badge colorScheme="green">완료</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                생성일: 2024.01.08
              </Text>
              <Text fontSize="sm" color="gray.600">
                크기: 1.1MB
              </Text>
              <HStack mt={3} gap={2}>
                <Button size="sm" colorScheme="blue">
                  다운로드
                </Button>
                <Button size="sm" variant="outline">
                  미리보기
                </Button>
                <Button size="sm" variant="outline" colorScheme="red">
                  삭제
                </Button>
              </HStack>
            </Box>

            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">2024년 1월 15일 일일 보고서</Text>
                <Badge colorScheme="green">완료</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                생성일: 2024.01.16
              </Text>
              <Text fontSize="sm" color="gray.600">
                크기: 0.8MB
              </Text>
              <HStack mt={3} gap={2}>
                <Button size="sm" colorScheme="blue">
                  다운로드
                </Button>
                <Button size="sm" variant="outline">
                  미리보기
                </Button>
                <Button size="sm" variant="outline" colorScheme="red">
                  삭제
                </Button>
              </HStack>
            </Box>

            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">2023년 4분기 보고서</Text>
                <Badge colorScheme="green">완료</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                생성일: 2024.01.05
              </Text>
              <Text fontSize="sm" color="gray.600">
                크기: 5.2MB
              </Text>
              <HStack mt={3} gap={2}>
                <Button size="sm" colorScheme="blue">
                  다운로드
                </Button>
                <Button size="sm" variant="outline">
                  미리보기
                </Button>
                <Button size="sm" variant="outline" colorScheme="red">
                  삭제
                </Button>
              </HStack>
            </Box>
          </SimpleGrid>
        </Box>

        {/* 액션 버튼 */}
        <HStack gap={4} wrap="wrap" justify="center">
          <Button colorScheme="green" size="lg">
            자동 보고서 설정
          </Button>
          <Button colorScheme="blue" size="lg">
            일괄 다운로드
          </Button>
          <Button variant="outline" size="lg">
            보고서 템플릿 관리
          </Button>
        </HStack>

        <Button asChild variant="ghost" size="sm">
          <Link to="/admin">← 관리자 메인으로 돌아가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
