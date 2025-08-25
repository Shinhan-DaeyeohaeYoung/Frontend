import { Box, Heading, Text, VStack, Button, HStack, Icon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function QrScanPage() {
  return (
    <Box p={6}>
      <VStack gap={6} align="center">
        <Heading size="lg" color="purple.600">
          📱 QR 스캔
        </Heading>

        <Text fontSize="md" textAlign="center" color="gray.600">
          카메라 권한이 필요합니다
        </Text>

        {/* QR 스캔 영역 시뮬레이션 */}
        <Box
          w="300px"
          h="300px"
          border="2px dashed"
          borderColor="purple.300"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="purple.50"
        >
          <VStack gap={3}>
            <Icon viewBox="0 0 24 24" w={12} h={12} color="purple.400">
              <path
                fill="currentColor"
                d="M3,5V7H5V5H3M7,5V7H9V5H7M11,5V7H13V5H11M15,5V7H17V5H15M19,5V7H21V5H19M3,9V11H5V9H3M7,9V11H9V9H7M11,9V11H13V9H11M15,9V11H17V9H15M19,9V11H21V9H19M3,13V15H5V13H3M7,13V15H9V13H7M11,13V15H13V13H11M15,13V15H17V13H15M19,13V15H21V13H19M3,17V19H5V17H3M7,17V19H9V17H7M11,17V19H13V17H11M15,17V19H17V17H15M19,17V19H21V17H19Z"
              />
            </Icon>
            <Text fontSize="sm" color="purple.600" textAlign="center">
              QR 코드를
              <br />
              카메라에 비춰주세요
            </Text>
          </VStack>
        </Box>

        <HStack gap={4}>
          <Button colorScheme="purple" size="lg">
            카메라 시작
          </Button>
          <Button variant="outline" size="lg">
            갤러리에서 선택
          </Button>
        </HStack>

        <Box p={4} bg="blue.50" rounded="lg" w="full" maxW="400px">
          <Text fontSize="sm" color="blue.600" textAlign="center">
            💡 QR 코드를 스캔하면 대여 신청이나 반납 처리가 가능합니다
          </Text>
        </Box>

        <Button asChild variant="ghost" size="sm">
          <Link to="/main">← 메인으로 돌아가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
