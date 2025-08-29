import { PageHeader } from '@/components/PageHeader';
import { Box } from '@chakra-ui/react';

export default function ReservationQueuePage() {
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
