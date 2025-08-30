import { useEffect, useState } from 'react';
import { Box, Text, VStack, Flex, Heading } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { getRequest } from '@/api/requests';

// ====== API 타입 ======
interface RentalRequest {
  id: number;
  status: string;
  itemId: number;
  unitId: number;
  reservedAt: string;
  reserveExpiresAt: string;
  unitImageUrl: string; // 이미지 URL 필드 추가
}

interface RentalRequestResponse {
  content: RentalRequest[];
  page: number;
  size: number;
  totalElements: number;
}

// ====== 유틸 ======
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTimeRemaining(expiresAt: string): string {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) return '만료됨';

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}시간 ${minutes % 60}분 남음`;
  }
  return `${minutes}분 남음`;
}

export default function ReservationQueuePage() {
  const [reservations, setReservations] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 예약 목록 불러오기
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getRequest<RentalRequestResponse>('/rental-requests');

      if (response && response.content) {
        setReservations(response.content);
      } else {
        setReservations([]);
      }
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : '예약 목록을 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <Box>
      <PageHeader
        imageSize={40}
        title="예약 중인 물품 목록"
        subtitle="현재 예약된 물품들의 상태를 확인하세요"
      />

      <VStack gap={0} align="stretch" mt={4} borderBottom="1px solid" borderColor="gray.200">
        {error && (
          <Text color="red.500" fontSize="sm" mb={4}>
            {error}
          </Text>
        )}

        {loading && (
          <Text color="gray.600" fontSize="sm" textAlign="center" py={8}>
            예약 목록을 불러오는 중...
          </Text>
        )}

        {!loading && !error && reservations.length === 0 && (
          <VStack gap={6} py={12} textAlign="center">
            <Box fontSize="6xl">😢</Box>
            <VStack gap={2}>
              <Heading size="md" color="gray.600">
                현재 예약된 물품이 없습니다...
              </Heading>
            </VStack>
          </VStack>
        )}

        {!loading &&
          !error &&
          reservations.length > 0 &&
          reservations.map((reservation) => (
            <Card
              key={reservation.id}
              image={
                reservation.unitImageUrl ? (
                  <Box w="100%" h="120px" borderRadius="md" overflow="hidden" bg="gray.100">
                    <img
                      src={reservation.unitImageUrl}
                      alt={`물품 이미지 ${reservation.id}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ) : (
                  <Box w="100%" h="120px" bg="gray.100" borderRadius="md" />
                )
              }
              title={`예약 #${reservation.id}`}
              subtitle={`물품 ID: ${reservation.itemId} | 단위 ID: ${reservation.unitId}`}
              extra={<Tag label="예약됨" />}
              bottomExtra={
                <Flex justify={'space-between'} width={'100%'} align={'flex-end'}>
                  <VStack gap={2} align="stretch" fontSize="sm" flex={1}>
                    <Flex justify="space-between">
                      <Text color="gray.600">예약일시:</Text>
                      <Text>{formatDate(reservation.reservedAt)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">만료일시:</Text>
                      <Text>{formatDate(reservation.reserveExpiresAt)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">남은 시간:</Text>
                      <Text color="orange.500" fontWeight="500">
                        {getTimeRemaining(reservation.reserveExpiresAt)}
                      </Text>
                    </Flex>
                  </VStack>
                </Flex>
              }
            />
          ))}
      </VStack>
    </Box>
  );
}
