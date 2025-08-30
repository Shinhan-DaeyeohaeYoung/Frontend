import { useEffect, useState } from 'react';
import { Box, Text, VStack, Flex, Heading } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag'; // 커스텀 Tag 컴포넌트 import
import { getRequest } from '@/api/requests';

// ====== API 타입 ======
type RentalStatus = 'RESERVED' | 'RENTED' | 'CANCELLED' | 'RETURNED';

interface RentalHistory {
  id: number;
  status: RentalStatus;
  itemId: number;
  unitId: number;
  reservedAt: string;
  reserveExpiresAt: string;
  rentedAt: string | null;
  dueAt: string | null;
  returnedAt: string | null;
  expired: boolean;
  unitImageUrl: string; // 이미지 URL 필드 추가
}

interface RentalResponse {
  content: RentalHistory[];
  page: number;
  size: number;
  totalElements: number;
}

// ====== 유틸 ======
function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusLabel(status: RentalStatus): string {
  const statusMap: Record<RentalStatus, string> = {
    RESERVED: '예약됨',
    RENTED: '대여중',
    CANCELLED: '취소됨',
    RETURNED: '반납됨',
  };
  return statusMap[status];
}

// function getStatusColor(status: RentalStatus): string {
//   const colorMap: Record<RentalStatus, string> = {
//     RESERVED: 'blue',
//     RENTED: 'green',
//     CANCELLED: 'red',
//     RETURNED: 'gray',
//   };
//   return colorMap[status];
// }

// 아이템 목록이 비어있을 때 표시할 컴포넌트
const EmptyState = () => (
  <VStack gap={6} py={12} textAlign="center">
    <Box fontSize="6xl">😢</Box>
    <VStack gap={2}>
      <Heading size="md" color="gray.600">
        대여 내역이 없습니다...
      </Heading>
    </VStack>
  </VStack>
);

export default function RentHistoryPage() {
  const [rentals, setRentals] = useState<RentalHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 대여 이력 불러오기
  const fetchRentals = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getRequest<RentalResponse>('/rentals');

      if (response && response.content) {
        setRentals(response.content);
      } else {
        setRentals([]);
      }
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : '대여 이력을 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  return (
    <Box>
      <PageHeader
        imageSize={40}
        title="대여 내역"
        subtitle="지금까지 대여한 내역을 확인해보세요."
      />

      <VStack gap={0} align="stretch" mt={4} borderBottom="1px solid" borderColor="gray.200">
        {error && (
          <Text color="red.500" fontSize="sm" mb={4}>
            {error}
          </Text>
        )}

        {loading && (
          <Text color="gray.600" fontSize="sm" textAlign="center" py={8}>
            대여 이력을 불러오는 중...
          </Text>
        )}

        {!loading && !error && rentals.length === 0 && <EmptyState />}

        {!loading &&
          !error &&
          rentals.length > 0 &&
          rentals.map((rental) => (
            <Card
              key={rental.id}
              image={
                rental.unitImageUrl ? (
                  <Box w="100%" h="120px" borderRadius="md" overflow="hidden" bg="gray.100">
                    <img
                      src={rental.unitImageUrl}
                      alt={`대여 물품 ${rental.id}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        // 이미지 로드 실패 시 회색 박스로 대체
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.style.backgroundColor = '#E2E8F0';
                      }}
                    />
                  </Box>
                ) : (
                  <Box w="100%" h="120px" bg="gray.100" borderRadius="md" />
                )
              }
              title={`대여 #${rental.id}`}
              subtitle={`물품 ID: ${rental.itemId} | 단위 ID: ${rental.unitId}`}
              extra={<Tag label={getStatusLabel(rental.status)} />}
              bottomExtra={
                <Flex justify={'space-between'} width={'100%'} align={'flex-end'}>
                  <VStack gap={2} align="stretch" fontSize="sm" flex={1}>
                    <Flex justify="space-between">
                      <Text color="gray.600">예약일시:</Text>
                      <Text>{formatDate(rental.reservedAt)}</Text>
                    </Flex>
                    {rental.rentedAt && (
                      <Flex justify="space-between">
                        <Text color="gray.600">대여일시:</Text>
                        <Text>{formatDate(rental.rentedAt)}</Text>
                      </Flex>
                    )}
                    {rental.dueAt && (
                      <Flex justify="space-between">
                        <Text color="gray.600">반납예정일:</Text>
                        <Text>{formatDate(rental.dueAt)}</Text>
                      </Flex>
                    )}
                    {rental.returnedAt && (
                      <Flex justify="space-between">
                        <Text color="gray.600">반납일시:</Text>
                        <Text>{formatDate(rental.returnedAt)}</Text>
                      </Flex>
                    )}
                    {rental.expired && (
                      <Text color="red.500" fontSize="xs">
                        예약 만료됨
                      </Text>
                    )}
                  </VStack>
                </Flex>
              }
            />
          ))}
      </VStack>
    </Box>
  );
}
