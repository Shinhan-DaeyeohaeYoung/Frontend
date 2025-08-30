import { Box, Heading, Text, VStack, Button, HStack, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  return (
    <Box p={6}>
      <VStack gap={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="lg" color="orange.600">
            🔔 알림함
          </Heading>
          <Button colorScheme="orange" size="sm">
            모두 읽음
          </Button>
        </HStack>

        <VStack gap={4} align="stretch">
          <Box p={4} border="1px solid" borderColor="gray.200" rounded="md" bg="blue.50">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">대여 신청 승인됨</Text>
              <Badge colorScheme="blue">새 알림</Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              2024.01.15 14:30
            </Text>
            <Text fontSize="sm" color="gray.700">
              노트북 대여 신청이 승인되었습니다.
            </Text>
          </Box>

          <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">반납 예정일 알림</Text>
              <Badge colorScheme="yellow">중요</Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              2024.01.14 09:15
            </Text>
            <Text fontSize="sm" color="gray.700">
              프로젝터 반납 예정일이 3일 남았습니다.
            </Text>
          </Box>

          <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">시스템 점검 안내</Text>
              <Badge colorScheme="gray">공지</Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              2024.01.13 16:00
            </Text>
            <Text fontSize="sm" color="gray.700">
              1월 20일 새벽 2시부터 4시까지 시스템 점검이 예정되어 있습니다.
            </Text>
          </Box>

          <Box p={4} border="1px solid" borderColor="gray.200" rounded="md">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">대여 신청 반려됨</Text>
              <Badge colorScheme="red">처리완료</Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              2024.01.12 11:20
            </Text>
            <Text fontSize="sm" color="gray.700">
              카메라 대여 신청이 반려되었습니다. 사유: 대여 기간이 너무 깁니다.
            </Text>
          </Box>
        </VStack>

        <Button asChild variant="ghost" size="sm">
          <Link to="/rent">← 메인으로 돌아가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
