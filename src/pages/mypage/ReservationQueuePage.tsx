import { PageHeader } from '@/components/PageHeader';
import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useModalStore } from '@/stores/modalStore';
import { useEffect } from 'react';
import checkIcon from '@/assets/imgs/icon_check.png';

export default function ReservationQueuePage() {
  const { openModal, closeModal } = useModalStore(); // ✅ 올바른 메서드명 사용
  useEffect(() => {
    openModal({
      title: '대여 신청 완료',
      body: (
        <VStack w="full" align="center" textAlign="center" gap={4} py={2}>
          {/* 성공 아이콘 */}
          <Image src={checkIcon} alt="신청 완료" boxSize="72px" />

          {/* 안내 문구 */}
          <Text fontSize="md" color="gray.800">
            물품이{' '}
            <Text as="span" fontWeight="bold">
              30분
            </Text>
            간 홀딩되었습니다!
          </Text>

          {/* 만료시간 표시 */}
          <HStack gap={2}>
            <Box px={2} py={1} bg="gray.100" rounded="md" fontSize="xs" color="gray.600">
              만료시간
            </Box>
            <Text fontSize="sm" fontFamily="mono" fontWeight="semibold" color="gray.700">
              {/* {expiresAtText} */}26.01.01
            </Text>
          </HStack>
        </VStack>
      ),
    });
  }, []);

  return (
    <Box position="relative">
      {/* 헤더 */}
      <PageHeader
        title="예약 중인 물품 목록"
        subtitle="지금까지 입출금한 보증금 내역을 확인해보세요"
      />
    </Box>
  );
}
