// ItemDetailModalContent.tsx
import { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Spinner,
  AspectRatio,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';

interface ItemDetail {
  id: number;
  universityId: number;
  organizationId: number;
  name: string;
  description: string;
  deposit: number;
  maxRentalDays: number;
  totalQuantity: number;
  availableQuantity: number;
  isActive: boolean;
  unitStats: {
    AVAILABLE: number;
    RESERVED: number;
    RENTED: number;
    REPAIR: number;
    LOST: number;
    DISPOSED: number;
  };
  photos: Array<{
    assetNo: string;
    key: string;
  }>;
  units: {
    content: Array<{
      id: number;
      itemId: number;
      status: string;
      assetNo: string;
      currentRental: boolean | null;
    }>;
    page: number;
    size: number;
    totalElements: number;
  };
}

const formatKRW = (v: number) => `${v.toLocaleString('ko-KR')}원`;
const MOCK_ITEM_DETAIL: ItemDetail = {
  id: 2,
  universityId: 1,
  organizationId: 2,
  name: '충전기',
  description: 'C타입 65W 충전기',
  deposit: 10000,
  maxRentalDays: 7,
  totalQuantity: 2,
  availableQuantity: 2,
  isActive: true,
  unitStats: {
    AVAILABLE: 2,
    RESERVED: 0,
    RENTED: 0,
    REPAIR: 0,
    LOST: 0,
    DISPOSED: 0,
  },
  photos: [
    {
      assetNo: '501',
      key: 'univ/1/items/1/units/501.jpg',
    },
  ],
  units: {
    content: [
      {
        id: 3,
        itemId: 2,
        status: 'AVAILABLE',
        assetNo: '501',
        currentRental: null,
      },
      {
        id: 4,
        itemId: 2,
        status: 'AVAILABLE',
        assetNo: '502',
        currentRental: null,
      },
    ],
    page: 0,
    size: 50,
    totalElements: 2,
  },
};

export default function ItemDetailModalContent({ itemId }: { itemId: number }) {
  const [data, setData] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!mounted) return;
        setData(MOCK_ITEM_DETAIL);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [itemId]);

  if (loading) {
    return (
      <Box h="60dvh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={6}>
        <Text>데이터가 없습니다.</Text>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" h="100%" overflow="hidden">
      <VStack align="stretch" gap={4} p={4} flex="1" overflowY="auto">
        {/* 대표 사진 와이어프레임 */}
        <WireframePhoto titleTop="반납 당시" titleBottom="사진" />

        <Box bg="gray.100" w="100%" h="1px" />

        <Flex justify="space-between" py={1} px={1}>
          <Text textAlign="right" color="gray.500">
            보증금
          </Text>
          <Text textAlign="right" fontWeight="semibold">
            {formatKRW(data.deposit)}
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 3, md: 3 }} gap={3}>
          <Info label="최대 대여기간" value={`${data.maxRentalDays}일`} />
          <Info label="보유수량" value={`${data.totalQuantity}개`} />
          <Info label="대여가능" value={`${data.availableQuantity}개`} />
        </SimpleGrid>

        <Box bg="gray.100" w="100%" h="1px" />

        <Box>
          <Text fontWeight="semibold" mb={2}>
            반납 이전 상태
          </Text>
          <WireframePhoto titleTop="과거" titleBottom="사진" />
        </Box>

        <Box bg="gray.100" rounded="sm" p={3} minH="160px">
          <Text mt={1} fontSize="sm" color="gray.600" whiteSpace="pre-line">
            {data.description || '설명이 없습니다.'}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <VStack
      align="flex-start"
      p={3}
      border="1px solid"
      borderColor="gray.200"
      rounded="md"
      bg="white"
      gap={1}
    >
      <Text fontSize="xs" color="gray.500">
        {label}
      </Text>
      <Text fontWeight="semibold">{value}</Text>
    </VStack>
  );
}

function WireframePhoto({
  titleTop,
  titleBottom,
  ratio = 16 / 9,
  height = '360px',
}: {
  titleTop: string;
  titleBottom?: string;
  ratio?: number;
  height?: string | number;
}) {
  return (
    <Box>
      <AspectRatio ratio={ratio} w="100%" h={height}>
        <VStack
          border="2px dashed"
          borderColor="gray.300"
          rounded="md"
          bg="gray.50"
          align="center"
          justify="center"
          gap={1}
        >
          <Text fontSize="xl" fontWeight="bold" color="gray.700">
            {titleTop}
          </Text>
          {titleBottom && (
            <Text fontSize="xl" fontWeight="bold" color="gray.700">
              {titleBottom}
            </Text>
          )}
        </VStack>
      </AspectRatio>
    </Box>
  );
}
