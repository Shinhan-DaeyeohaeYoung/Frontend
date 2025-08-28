import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  SimpleGrid,
  HStack,
  Badge,
  Input,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function AdminQrPage() {
  return (
    <Box p={6}>
      <VStack gap={8} align="center">
        <Heading size="xl" color="purple.600">
          📱 QR 관리
        </Heading>

        <Text fontSize="lg" textAlign="center" color="gray.600">
          QR 코드 생성 및 관리 시스템입니다
        </Text>

        {/* QR 생성 폼 */}
        <Box w="full" maxW="600px" p={6} border="1px solid" borderColor="gray.200" rounded="lg">
          <Heading size="md" mb={4} color="gray.700">
            🆕 새 QR 코드 생성
          </Heading>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontWeight="medium" mb={2}>
                장비명
              </Text>
              <Input placeholder="노트북 A-001" />
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                장비 타입
              </Text>
              <Input placeholder="노트북" />
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                위치
              </Text>
              <Input placeholder="도서관 2층" />
            </Box>

            <Button colorScheme="purple" size="lg">
              QR 코드 생성
            </Button>
          </VStack>
        </Box>

        {/* QR 코드 목록 */}
        <Box w="full" maxW="800px">
          <Heading size="md" mb={4} color="gray.700">
            📋 등록된 QR 코드 목록
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">노트북 A-001</Text>
                <Badge colorScheme="green">활성</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                타입: 노트북
              </Text>
              <Text fontSize="sm" color="gray.600">
                위치: 도서관 2층
              </Text>
              <Text fontSize="sm" color="gray.600">
                생성일: 2024.01.10
              </Text>
              <HStack mt={3} gap={2}>
                <Button size="sm" colorScheme="blue">
                  다운로드
                </Button>
                <Button size="sm" variant="outline">
                  수정
                </Button>
                <Button size="sm" variant="outline" colorScheme="red">
                  비활성화
                </Button>
              </HStack>
            </Box>

            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">프로젝터 P-001</Text>
                <Badge colorScheme="green">활성</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                타입: 프로젝터
              </Text>
              <Text fontSize="sm" color="gray.600">
                위치: 강의실 101
              </Text>
              <Text fontSize="sm" color="gray.600">
                생성일: 2024.01.08
              </Text>
              <HStack mt={3} gap={2}>
                <Button size="sm" colorScheme="blue">
                  다운로드
                </Button>
                <Button size="sm" variant="outline">
                  수정
                </Button>
                <Button size="sm" variant="outline" colorScheme="red">
                  비활성화
                </Button>
              </HStack>
            </Box>

            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">카메라 C-001</Text>
                <Badge colorScheme="red">비활성</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                타입: 카메라
              </Text>
              <Text fontSize="sm" color="gray.600">
                위치: 미디어실
              </Text>
              <Text fontSize="sm" color="gray.600">
                생성일: 2024.01.05
              </Text>
              <HStack mt={3} gap={2}>
                <Button size="sm" colorScheme="blue">
                  다운로드
                </Button>
                <Button size="sm" variant="outline">
                  수정
                </Button>
                <Button size="sm" colorScheme="green">
                  활성화
                </Button>
              </HStack>
            </Box>

            <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">태블릿 T-001</Text>
                <Badge colorScheme="green">활성</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                타입: 태블릿
              </Text>
              <Text fontSize="sm" color="gray.600">
                위치: 학습지원센터
              </Text>
              <Text fontSize="sm" color="gray.600">
                생성일: 2024.01.12
              </Text>
              <HStack mt={3} gap={2}>
                <Button size="sm" colorScheme="blue">
                  다운로드
                </Button>
                <Button size="sm" variant="outline">
                  수정
                </Button>
                <Button size="sm" variant="outline" colorScheme="red">
                  비활성화
                </Button>
              </HStack>
            </Box>
          </SimpleGrid>
        </Box>

        {/* 액션 버튼 */}
        <HStack gap={4} wrap="wrap" justify="center">
          <Button colorScheme="purple" size="lg">
            일괄 생성
          </Button>
          <Button colorScheme="blue" size="lg">
            목록 내보내기
          </Button>
          <Button variant="outline" size="lg">
            QR 코드 통계
          </Button>
        </HStack>

        <Button asChild variant="ghost" size="sm">
          <Link to="/admin">← 관리자 메인으로 돌아가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
