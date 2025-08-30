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
  Flex,
  Button as ChakraButton,
} from '@chakra-ui/react';
// import StickyActionButton from './StickyActionButton' // 쓰는 중이면
import { getRequest, postRequest } from '@/api/requests';
import { Button } from '@/components/Button';
// API 응답 타입 정의 수정 (any 타입 제거)
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
  countWaitList: number;
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
    imageUrl: string;
  }>;
  units: {
    content: Array<{
      id: number;
      itemId: number;
      status: string;
      assetNo: string;
      currentRental: null | {
        rentalId: number;
        userId: number;
        dueAt: string;
      };
    }>;
    page: number;
    size: number;
    totalElements: number;
  };
}

// 홀딩 예약 응답 타입 추가
interface ReservationResponse {
  id: number;
  status: string;
  itemId: number;
  unitId: number;
  reservedAt: string;
  reserveExpiresAt: string;
}

const formatKRW = (v: number) => `${v.toLocaleString('ko-KR')}원`;

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

        // 하드코딩된 URL 제거하고 환경변수 기반으로 변경
        const res = await getRequest<ItemDetail>(`/items/${itemId}`);

        if (mounted) {
          setData(res);
          // 대여 가능한 첫 번째 unit을 기본 선택으로 설정
          const firstAvailableUnit = res.units?.content?.find((u) => u.status === 'AVAILABLE');
          if (firstAvailableUnit) {
            setSelectedUnitId(firstAvailableUnit.id);
          }
        }
      } catch (error) {
        console.error('아이템 상세 조회 실패:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [itemId]);

  // 대여 가능한 unit만 필터링 (이미 있음)
  const availableUnits = useMemo(
    () => (data?.units?.content ?? []).filter((u) => u.status === 'AVAILABLE'),
    [data?.units?.content]
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

      // 홀딩 예약 API 호출
      const reservation = await postRequest<ReservationResponse>('/rental-requests/reservations', {
        itemId: data.id,
        unitId: selectedUnitId,
        ttlMinutes: 30, // 30분 홀딩
      });

      console.log('홀딩 예약 성공:', reservation);

      // 성공 처리
      alert(
        `물품이 30분간 홀딩되었습니다!\n만료시간: ${new Date(
          reservation.reserveExpiresAt
        ).toLocaleString('ko-KR')}`
      );

      // 모달 닫기 (필요시)
      // closeModal();

      // 데이터 새로고침 (선택사항)
      // window.location.reload();
    } catch (error: unknown) {
      console.error('홀딩 예약 실패:', error);

      let errorMessage = '홀딩 중 오류가 발생했습니다.';

      // 타입 단언으로 error 타입 지정
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };

      if (axiosError.response?.status === 409) {
        errorMessage = '이미 대여중이거나 예약할 수 없는 상태입니다.';
      } else if (axiosError.response?.status === 404) {
        errorMessage = '아이템 또는 유닛을 찾을 수 없습니다.';
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }

      alert(`홀딩 실패: ${errorMessage}`);
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

  // mainPhoto 변수 활성화
  const mainPhoto = data.photos?.[0]?.imageUrl;
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
    <Box display="flex" flexDirection="column" h="100%" overflow="hidden">
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
            <ChakraButton size="sm" variant="outline" onClick={enterSelectView}>
              다른 물품 선택하기
            </ChakraButton>
          ) : (
            <ChakraButton size="sm" variant="ghost" onClick={() => setView('detail')}>
              ← 상세보기
            </ChakraButton>
          )}
        </HStack>
      </Box>
      <VStack align="stretch" gap={4} p={4} flex="1" overflowY="auto">
        {/* ✅ 모달 내부 상단 전환 바 (sticky) */}

        {/* ── 상세 화면 ───────────────────────────────────────────── */}
        {view === 'detail' && (
          <>
            <AspectRatio ratio={16 / 9} w="100%" h="360px">
              {mainPhoto ? (
                <Image src={mainPhoto || ''} alt={data.name} objectFit="cover" bg="gray.100" />
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
            {/* <Box position="sticky" bottom={0}>
            <Button
              w="full"
              //   colorScheme="blue"
              onClick={rent}
              loading={renting}
              disabled={!canRent}
            >
              {canRent ? '대여하기' : '대여 불가'}
            </Button>
          </Box> */}
          </>
        )}

        {/* ── 전체 선택 화면 ──────────────────────────────────────── */}
        {view === 'selectUnit' && (
          <>
            <Text fontWeight="semibold">대여 가능한 전체 목록 ({availableUnits.length}개)</Text>

            {availableUnits.length === 0 ? (
              <Box
                textAlign="center"
                py={8}
                color="gray.500"
                border="1px dashed"
                borderColor="gray.300"
                rounded="md"
              >
                <Text>현재 대여 가능한 물품이 없습니다.</Text>
                <Text fontSize="sm" mt={2}>
                  다른 물품을 선택해주세요.
                </Text>
              </Box>
            ) : (
              <>
                <SimpleGrid columns={2} gap={3}>
                  {pagedUnits.map((u) => {
                    const active = u.id === highlightId;
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
                        onClick={() => setPendingSelectedUnitId(u.id)}
                        _hover={{
                          borderColor: 'blue.300',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Box
                          w="100%"
                          h="72px"
                          bg="gray.100"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          rounded="md"
                          overflow="hidden"
                        >
                          {/* 실제 이미지가 있으면 표시, 없으면 기본 텍스트 */}
                          {data?.photos?.find((p) => p.assetNo === u.assetNo)?.imageUrl ? (
                            <Image
                              src={data.photos.find((p) => p.assetNo === u.assetNo)?.imageUrl}
                              alt={`${u.assetNo}번 물품`}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                            />
                          ) : (
                            <Text color="gray.500" fontSize="sm">
                              {u.assetNo}번
                            </Text>
                          )}
                        </Box>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color={active ? 'pink.500' : 'gray.800'}
                        >
                          {u.assetNo}번
                        </Text>
                        <Badge colorScheme="green" size="sm">
                          대여가능
                        </Badge>
                      </VStack>
                    );
                  })}
                </SimpleGrid>

                {/* 페이지 이동 (대여 가능한 것이 6개 이상일 때만 표시) */}
                {totalPages > 1 && (
                  <HStack justify="space-between" mt={2}>
                    <Button
                      label="이전"
                      disabled={page === 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                    />
                    <Text fontSize="sm" color="gray.600">
                      {page + 1} / {totalPages}
                    </Text>
                    <Button
                      label="다음"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    />
                  </HStack>
                )}
              </>
            )}

            {/* 하단 선택완료 버튼 */}
            <Box position="sticky" bottom={0} bg="white" pt={2} pb={4}>
              <HStack gap={2}>
                <Button label="취소" flex="1" onClick={cancelSelect} />
                <Button
                  label="선택완료"
                  flex="2"
                  colorScheme="blue"
                  onClick={confirmSelect}
                  disabled={!pendingSelectedUnitId}
                />
              </HStack>
            </Box>
          </>
        )}
      </VStack>

      {/* 하단 대여 버튼 */}
      <Box position="sticky" bottom={0}>
        <Button
          label={renting ? '홀딩 중...' : canRent ? '대여하기 (30분 홀딩)' : '대여 불가'}
          onClick={rent}
          loading={renting}
          disabled={!canRent}
          w="full"
        />
      </Box>
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
