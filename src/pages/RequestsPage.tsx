import { Box, Heading, Text, VStack, Button, HStack, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function RequestsPage() {
  return (
    <Box p={6}>
      <VStack gap={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="lg" color="green.600">
            📝 신청해요 게시판
          </Heading>
          <Button colorScheme="green" size="sm">
            새 글 작성
          </Button>
        </HStack>

        <VStack gap={4} align="stretch">
          <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">노트북 대여 신청합니다</Text>
              <Badge colorScheme="green">승인됨</Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              2024.01.15 ~ 2024.01.20
            </Text>
            <Text fontSize="sm" color="gray.500">
              학습 목적으로 노트북이 필요합니다.
            </Text>
          </Box>

          <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">프로젝터 대여 신청</Text>
              <Badge colorScheme="yellow">검토중</Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              2024.01.18 ~ 2024.01.19
            </Text>
            <Text fontSize="sm" color="gray.500">
              발표 준비를 위해 프로젝터가 필요합니다.
            </Text>
          </Box>

          <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">카메라 대여 신청</Text>
              <Badge colorScheme="red">반려됨</Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              2024.01.22 ~ 2024.01.25
            </Text>
            <Text fontSize="sm" color="gray.500">
              동아리 활동을 위해 카메라가 필요합니다.
            </Text>
          </Box>
        </VStack>

        <Button asChild variant="ghost" size="sm">
          <Link to="/main">← 메인으로 돌아가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
