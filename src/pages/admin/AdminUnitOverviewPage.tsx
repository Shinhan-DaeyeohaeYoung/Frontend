// src/pages/rent/RentPage.tsx
import { Box, Text, VStack } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { useMemo, useState } from 'react';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag'; // 새로 만든 Tag 불러오기

type UnitStatus = 'RENTED' | 'AVAILABLE';

type RentUnit = {
  id: number;
  universityId: number;
  organizationId: number;
  name: string;
  submitter: string;
  submissionNumber: string;
  category: string;
  status: UnitStatus;
  overdueDays: number | null;
  coverKey: string;
  startDate?: string;
  endDate?: string;
};

export default function RentPage() {
  const response = {
    content: [
      {
        id: 1,
        universityId: 1,
        organizationId: 2,
        name: '사진',
        submitter: '길태은(1335841)',
        submissionNumber: '250821',
        category: '3번 충전기',
        status: 'RENTED' as UnitStatus,
        overdueDays: 7,
        coverKey: 'univ/1/items/1/units/501.jpg',
      },
      {
        id: 2,
        universityId: 1,
        organizationId: 2,
        name: '사진',
        submitter: '신승용(1335874)',
        submissionNumber: '250821',
        category: '4번 충전기',
        status: 'RENTED' as UnitStatus,
        overdueDays: null,
        coverKey: 'univ/1/items/1/units/502.jpg',
      },
      {
        id: 3,
        universityId: 1,
        organizationId: 2,
        name: '사진',
        submitter: '이지혜(13302156)',
        submissionNumber: '250821',
        category: '5번 충전기',
        status: 'AVAILABLE' as UnitStatus,
        overdueDays: null,
        coverKey: 'univ/1/items/1/units/503.jpg',
      },
      {
        id: 4,
        universityId: 1,
        organizationId: 2,
        name: '사진',
        submitter: '홍길동(1330000)',
        submissionNumber: '250821',
        category: '6번 충전기',
        status: 'AVAILABLE' as UnitStatus,
        overdueDays: null,
        coverKey: 'univ/1/items/1/units/504.jpg',
      },
    ],
  };

  const withDates: RentUnit[] = response.content.map((u) => ({
    ...u,
    startDate: '250820',
    endDate: u.submissionNumber ?? '250821',
  }));

  const [data] = useState<RentUnit[]>(withDates);

  const { availableCount, totalCount } = useMemo(() => {
    const rented = data.filter((d) => d.status === 'RENTED').length;
    const available = data.filter((d) => d.status === 'AVAILABLE').length;
    return { availableCount: available, rentedCount: rented, totalCount: data.length };
  }, [data]);

  return (
    <Box px={10}>
      <PageHeader
        px={0}
        py={10}
        bgColor="transparent"
        title="{물품명} 대여 현황"
        subtitle="물품 개체들을 확인하고 관리할 수 있습니다."
      />

      <Text fontSize="sm" color="gray.700" mt={-2} mb={2}>
        대여 가능, 대여 중 물품 개수: {availableCount}개 / {totalCount}개
      </Text>

      <VStack gap={3} align="stretch" mt={2}>
        {data.map((el) => {
          const isRented = el.status === 'RENTED';

          return (
            <Card
              key={el.id}
              image={
                <Text fontSize="4xl" fontWeight="bold" color="gray.500" lineHeight="80px">
                  {el.name}
                </Text>
              }
              title={'물품번호'}
              extra={
                isRented ? (
                  <Tag label="대여 중" variant="error" />
                ) : (
                  <Tag label="대여 가능" variant="default" />
                )
              }
              subtitle={
                isRented
                  ? `대여한 사람 : ${el.submitter}\n대여 기간: ${el.startDate} ~ ${el.endDate}`
                  : `사람 : ${el.submitter}`
              }
            />
          );
        })}
      </VStack>
    </Box>
  );
}
