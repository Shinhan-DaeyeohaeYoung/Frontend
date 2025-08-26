// ItemDetailModalContent.tsx (핵심 변경만)
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  AspectRatio,
  Image,
  SimpleGrid,
  Button,
  Flex,
} from '@chakra-ui/react';
// import StickyActionButton from './StickyActionButton' // 쓰는 중이면

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
  const [renting, setRenting] = useState(false);

  // ✅ 모달 내부 화면 상태
  const [view, setView] = useState<'detail' | 'selectUnit'>('detail');
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [pendingSelectedUnitId, setPendingSelectedUnitId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!mounted) return;
        // 🔽 실제 API 대신 임시 데이터 주입
        setData(MOCK_ITEM_DETAIL);
        setSelectedUnitId(MOCK_ITEM_DETAIL.units?.content?.[0]?.id);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [itemId]);

  const availableUnits = useMemo(
    () => (data?.units.content ?? []).filter((u) => u.status === 'AVAILABLE'),
    [data?.units.content]
  );

  // (옵션) 간단 페이징
  const pageSize = 6;
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(availableUnits.length / pageSize));
  const pagedUnits = useMemo(
    () => availableUnits.slice(page * pageSize, page * pageSize + pageSize),
    [availableUnits, page, pageSize]
  );

  const canRent = useMemo(
    () => !!data && !!selectedUnitId && !renting && !loading,
    [data, selectedUnitId, renting, loading]
  );

  const rent = useCallback(async () => {
    if (!data || !selectedUnitId) return;
    try {
      setRenting(true);
      // await postRequest('/rentals', { itemId: data.id, unitId: selectedUnitId });
      // 성공 처리(토스트 + 모달 닫기 등)
    } finally {
      setRenting(false);
    }
  }, [data, selectedUnitId]);

  if (loading) {
    return (
      <Box h="60dvh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Box>
    );
  }
  if (!data)
    return (
      <Box p={6}>
        <Text>데이터가 없습니다.</Text>
      </Box>
    );

  const mainPhoto = data.photos?.[0]?.key;
  const selectedUnit = data.units.content.find((u) => u.id === selectedUnitId) || null;
  // ✔️ 상세/선택 화면 공통 하이라이트 기준
  const highlightId = view === 'selectUnit' ? pendingSelectedUnitId : selectedUnitId;

  const enterSelectView = () => {
    // 현재 확정된 값이 있으면 그걸 기본값으로, 없으면 첫 번째 AVAILABLE
    const fallback = availableUnits[0]?.id ?? null;
    setPendingSelectedUnitId(selectedUnitId ?? fallback);
    setPage(0); // 선택화면 진입 시 첫 페이지로 (선택)
    setView('selectUnit');
  };

  // 취소: 임시 선택 버리고 상세로 복귀
  const cancelSelect = () => {
    setPendingSelectedUnitId(null);
    setView('detail');
  };

  // 선택완료: 임시 선택을 확정(selectedUnitId)으로 반영
  const confirmSelect = () => {
    if (!pendingSelectedUnitId) return;
    setSelectedUnitId(pendingSelectedUnitId);
    setPendingSelectedUnitId(null);
    setView('detail');
  };

  return (
    <VStack align="stretch" gap={4} p={4} flex="1" minH="0">
      {/* ✅ 모달 내부 상단 전환 바 (sticky) */}
      <Box
        position="sticky"
        top={0}
        bg="white"
        zIndex="docked"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={1}
        py={2}
      >
        <HStack justify="space-between" align="center">
          <Text fontWeight="semibold">
            {selectedUnit?.assetNo ? `${data.name}(물품 번호: ${selectedUnit.assetNo})` : data.name}
          </Text>
          {view === 'detail' ? (
            <Button size="sm" variant="outline" onClick={enterSelectView}>
              다른 물품 선택하기
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setView('detail')}>
              ← 상세보기
            </Button>
          )}
        </HStack>
      </Box>

      {/* ── 상세 화면 ───────────────────────────────────────────── */}
      {view === 'detail' && (
        <>
          <AspectRatio ratio={16 / 9} w="100%" h="360px">
            {mainPhoto ? (
              <Image
                // [todo]: 이미지 주소 응답값을 수정
                src={
                  /* getAssetUrl(mainPhoto) */ 'https://1801889e95b1f9bf.kinxzone.com/webfile/product/9/9755/b1khuy9y3s1k.jpg'
                }
                alt={data.name}
                objectFit="cover"
                bg="gray.100"
              />
            ) : (
              <Box
                border="2px dashed"
                borderColor="gray.300"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="gray.50"
              >
                <Text color="gray.500">대표 사진이 없습니다</Text>
              </Box>
            )}
          </AspectRatio>
          <Box bg={'gray.100'} w={'100%'} h="1px"></Box>
          {/* <Box bg={'gray.100'} w={'cal(100% + 30px)'} h="1px" mx={'-30px'}></Box> */}

          <Flex
            justify={'space-between'}
            // borderTop={'1px solid black'}
            // borderBottom={'1px solid black'}
            py={1}
            px={1}
          >
            <Text textAlign={'right'} color={'gray.500'}>
              보증금
            </Text>
            <Text textAlign={'right'} fontWeight={'semibold'}>
              {formatKRW(data.deposit)}
            </Text>
          </Flex>

          <SimpleGrid columns={{ base: 3, md: 3 }} gap={3}>
            <Info label="최대 대여기간" value={`${data.maxRentalDays}일`} />
            <Info label="보유수량" value={`${data.totalQuantity}개`} />
            <Info label="대여가능" value={`${data.availableQuantity}개`} />
          </SimpleGrid>
          <Box bg={'gray.100'} w={'100%'} h="1px"></Box>
          <Box bg={'gray.100'} rounded={'sm'} p={3} minH={'160px'}>
            <Text mt={1} fontSize="sm" color="gray.600" whiteSpace="pre-line">
              {data.description || '설명이 없습니다.'}
            </Text>
          </Box>
          {/* 하단 대여 버튼 */}
          <Box position="sticky" bottom={0}>
            <Button
              w="full"
              //   colorScheme="blue"
              onClick={rent}
              loading={renting}
              disabled={!canRent}
            >
              {canRent ? '대여하기' : '대여 불가'}
            </Button>
          </Box>
        </>
      )}

      {/* ── 전체 선택 화면 ──────────────────────────────────────── */}
      {view === 'selectUnit' && (
        <>
          <Text fontWeight="semibold">대여 가능한 전체 목록</Text>

          <SimpleGrid columns={2} gap={3}>
            {pagedUnits.map((u) => {
              const active = u.id === highlightId; // ✅ 기존: selectedUnitId → 수정: highlightId
              return (
                <VStack
                  key={u.id}
                  border="1px solid"
                  borderColor={active ? 'pink.400' : 'gray.300'}
                  rounded="md"
                  bg="white"
                  p={3}
                  gap={2}
                  cursor="pointer"
                  onClick={() => setPendingSelectedUnitId(u.id)} // ✅ 확정 아님, 임시만
                >
                  <Box
                    w="100%"
                    h="72px"
                    bg="gray.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="gray.500">사진</Text>
                  </Box>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color={active ? 'pink.500' : 'gray.800'}
                  >
                    {u.assetNo}번
                  </Text>
                </VStack>
              );
            })}
          </SimpleGrid>

          {/* 페이지 이동 */}
          <HStack justify="space-between" mt={2}>
            <Button
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              이전
            </Button>
            <Button
              variant="outline"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              다음
            </Button>
          </HStack>

          {/* 하단 선택완료 버튼 */}
          <Box position="sticky" bottom={0} bg="white" pt={2} pb={4}>
            <HStack gap={2}>
              <Button flex="1" variant="outline" onClick={cancelSelect}>
                취소
              </Button>
              <Button
                flex="2"
                colorScheme="blue"
                onClick={confirmSelect}
                disabled={!pendingSelectedUnitId} // ✅ 임시 선택 없으면 비활성
              >
                선택완료
              </Button>
            </HStack>
          </Box>
        </>
      )}
    </VStack>
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
