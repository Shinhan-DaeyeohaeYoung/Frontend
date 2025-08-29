// src/pages/admin/AdminUnitOverviewPage.tsx
import { Box, Text, VStack, Image } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { useMemo, useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { getRequest } from '@/api/requests';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/Button';

type Unit = {
  id: number;
  itemId: number;
  status: string;
  assetNo: string;
  currentRental?: {
    rentalId: number;
    userId: number;
    dueAt: string;
  };
};

type Photo = {
  assetNo: string;
  key: string;
  imageUrl: string;
};

type AdminItemDetail = {
  id: number;
  universityId: number;
  organizationId: number;
  name: string;
  description: string;
  deposit: number;
  maxRentalDays: number;
  totalQuantity: number;
  availableQuantity: number;
  countWaitList: number;
  isActive: boolean;
  unitStats: Record<string, number>;
  photos: Photo[];
  units: {
    content: Unit[];
    page: number;
    size: number;
    totalElements: number;
  };
};

export default function AdminUnitOverviewPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const [itemDetail, setItemDetail] = useState<AdminItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchItemDetail = async () => {
    if (!itemId) return;

    try {
      setLoading(true);

      const data: AdminItemDetail = await getRequest<AdminItemDetail>(
        `/admin/items/${itemId}?page=0&size=20&sort=id,asc`
      );

      setItemDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '아이템 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetail();
  }, [itemId]);

  const { availableCount, totalCount } = useMemo(() => {
    if (!itemDetail) return { availableCount: 0, totalCount: 0 };

    const units = itemDetail.units.content;
    const rented = units.filter((d) => d.status === 'RENTED').length;
    const available = units.filter((d) => d.status === 'AVAILABLE').length;
    return { availableCount: available, rentedCount: rented, totalCount: units.length };
  }, [itemDetail]);

  if (loading) {
    return (
      <Box px={10}>
        <PageHeader
          px={0}
          py={10}
          bgColor="transparent"
          title="로딩 중..."
          subtitle="데이터를 불러오는 중입니다."
        />
        <Text>로딩 중...</Text>
      </Box>
    );
  }

  if (error || !itemDetail) {
    return (
      <Box px={10}>
        <PageHeader px={0} py={10} title="오류 발생" subtitle="데이터를 불러올 수 없습니다." />
        <Text color="red.500">오류: {error}</Text>
        <Button label="다시 시도" onClick={fetchItemDetail} mt={4} />
      </Box>
    );
  }

  return (
    <Box px={10}>
      <PageHeader
        px={0}
        py={10}
        bgColor="transparent"
        title={`${itemDetail.name} 대여 현황`}
        subtitle="물품 개체들을 확인하고 관리할 수 있습니다."
      />

      {/* 아이템 기본 정보 */}
      <Box mb={6} p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          아이템 정보
        </Text>
        <Text fontSize="sm" color="gray.700" mb={1}>
          설명: {itemDetail.description}
        </Text>
        <Text fontSize="sm" color="gray.700" mb={1}>
          총 수량: {itemDetail.totalQuantity}개 | 대여 가능: {itemDetail.availableQuantity}개
        </Text>
        <Text fontSize="sm" color="gray.700" mb={1}>
          보증금: {itemDetail.deposit}원 | 최대 대여 기간: {itemDetail.maxRentalDays}일
        </Text>
        {itemDetail.countWaitList > 0 && (
          <Text fontSize="sm" color="orange.500">
            대기자: {itemDetail.countWaitList}명
          </Text>
        )}
      </Box>

      <Text fontSize="sm" color="gray.700" mt={-2} mb={2}>
        대여 가능, 대여 중 물품 개수: {availableCount}개 / {totalCount}개
      </Text>

      <VStack gap={3} align="stretch" mt={2}>
        {itemDetail.units.content.map((unit) => {
          const isRented = unit.status === 'RENTED';
          const isAvailable = unit.status === 'AVAILABLE';

          // 해당 유닛의 assetNo와 일치하는 사진 찾기
          const unitPhoto = itemDetail.photos.find((photo) => photo.assetNo === unit.assetNo);

          return (
            <Card
              key={unit.id}
              image={
                unitPhoto ? (
                  <Image
                    src={unitPhoto.imageUrl}
                    alt={`${unit.assetNo}번 사진`}
                    objectFit="cover"
                    w="100%"
                    h="200px"
                  />
                ) : (
                  <Text fontSize="4xl" fontWeight="bold" color="gray.500" lineHeight="80px">
                    {unit.assetNo}
                  </Text>
                )
              }
              title={`${unit.assetNo}번`} // 물품번호를 받아온 값으로 표시
              extra={
                isRented ? (
                  <Tag label="대여 중" variant="error" />
                ) : isAvailable ? (
                  <Tag label="대여 가능" variant="default" />
                ) : (
                  <Tag label={unit.status} variant="default" /> // 받아온 상태값 표시
                )
              }
              subtitle={
                isRented && unit.currentRental
                  ? `대여 ID: ${unit.currentRental.rentalId}\n만료일: ${new Date(
                      unit.currentRental.dueAt
                    ).toLocaleDateString()}`
                  : isAvailable
                  ? `대여 가능한 상태입니다`
                  : `상태: ${unit.status}` // 받아온 상태값 표시
              }
            />
          );
        })}
      </VStack>
    </Box>
  );
}
