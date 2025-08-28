import { Box, Heading, Text, VStack, Button, HStack, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function RankingPage() {
  return (
    <Box p={6}>
      <VStack gap={6} align="center">
        <Heading size="lg" color="red.600">
          🏆 학교 랭킹
        </Heading>

        <Text fontSize="md" textAlign="center" color="gray.600">
          이번 달 대여 서비스 이용 랭킹입니다
        </Text>

        <VStack gap={3} align="stretch" w="full" maxW="500px">
          {/* 1등 */}
          <Box p={4} border="2px solid" borderColor="yellow.400" rounded="lg" bg="yellow.50">
            <HStack gap={4}>
              <Badge colorScheme="yellow" fontSize="lg" p={2}>
                🥇 1등
              </Badge>
              <Box
                w="40px"
                h="40px"
                bg="blue.500"
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
              >
                김
              </Box>
              <VStack align="start" flex="1">
                <Text fontWeight="bold" fontSize="lg">
                  김철수
                </Text>
                <Text fontSize="sm" color="gray.600">
                  컴퓨터공학과 3학년
                </Text>
                <Text fontSize="sm" color="yellow.600">
                  대여 횟수: 15회
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* 2등 */}
          <Box p={4} border="2px solid" borderColor="gray.300" rounded="lg" bg="gray.50">
            <HStack gap={4}>
              <Badge colorScheme="gray" fontSize="lg" p={2}>
                🥈 2등
              </Badge>
              <Box
                w="40px"
                h="40px"
                bg="green.500"
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
              >
                이
              </Box>
              <VStack align="start" flex="1">
                <Text fontWeight="bold" fontSize="lg">
                  이영희
                </Text>
                <Text fontSize="sm" color="gray.600">
                  디자인학과 2학년
                </Text>
                <Text fontSize="sm" color="gray.600">
                  대여 횟수: 12회
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* 3등 */}
          <Box p={4} border="2px solid" borderColor="orange.300" rounded="lg" bg="orange.50">
            <HStack gap={4}>
              <Badge colorScheme="orange" fontSize="lg" p={2}>
                🥉 3등
              </Badge>
              <Box
                w="40px"
                h="40px"
                bg="orange.500"
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
              >
                박
              </Box>
              <VStack align="start" flex="1">
                <Text fontWeight="bold" fontSize="lg">
                  박민수
                </Text>
                <Text fontSize="sm" color="gray.600">
                  경영학과 4학년
                </Text>
                <Text fontSize="sm" color="orange.600">
                  대여 횟수: 10회
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* 4-10등 */}
          {[4, 5, 6, 7, 8, 9, 10].map((rank) => (
            <Box key={rank} p={3} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack gap={4}>
                <Text fontWeight="bold" color="gray.500" w="40px">
                  {rank}등
                </Text>
                <Box
                  w="32px"
                  h="32px"
                  bg="gray.500"
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  {rank}
                </Box>
                <VStack align="start" flex="1">
                  <Text fontWeight="bold">학생{rank}</Text>
                  <Text fontSize="sm" color="gray.600">
                    대여 횟수: {11 - rank}회
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>

        <Box p={4} bg="blue.50" rounded="lg" w="full" maxW="500px">
          <Text fontSize="sm" color="blue.600" textAlign="center">
            💡 랭킹은 매월 1일 초기화되며, 대여 횟수와 반납 시간 준수율을 반영합니다
          </Text>
        </Box>

        <Button asChild variant="ghost" size="sm">
          <Link to="/main">← 메인으로 돌아가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
