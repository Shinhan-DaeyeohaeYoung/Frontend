import { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Spinner, Image, Checkbox, Button } from '@chakra-ui/react';
import { getRequest, postRequest } from '@/api/requests';
import { useAuthStore } from '@/stores/authStore';
// AI 분석 결과 타입 정의
interface DamageSuggestion {
  detail: string;
  damageRate: number;
  summary: string;
}

// 반납 신청 상세 타입 정의
interface ReturnRequestDetail {
  id: number;
  universityId: number;
  organizationId: number;
  rentalId: number;
  userId: number;
  status: string;
  submittedImageKey: string;
  submittedImageUrl: string;
  beforeImageKey: string;
  beforeImageUrl: string;
  requestedAt: string;
  isActive: boolean;
}

interface AprovalDetailModalContentProps {
  returnRequestId: number; // itemId → returnRequestId로 변경
  onApproveSuccess?: () => void; // 승인 성공 후 콜백 함수 추가
}

export default function AprovalDetailModalContent({
  returnRequestId,
  onApproveSuccess,
}: AprovalDetailModalContentProps) {
  const [data, setData] = useState<ReturnRequestDetail | null>(null);
  const [damageSuggestion, setDamageSuggestion] = useState<DamageSuggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [refundDeposit, setRefundDeposit] = useState(false);
  const [approving, setApproving] = useState(false);

  const { user } = useAuthStore();

  // AI 분석 결과 가져오기
  const fetchDamageSuggestion = async (organizationId: number) => {
    try {
      const response = await getRequest<DamageSuggestion>(
        `/admin/return-requests/${returnRequestId}/damage/suggestions?organizationId=${organizationId}`
      );
      if (response) {
        setDamageSuggestion(response);
        console.log('AI 분석 결과:', response);
      }
    } catch (error) {
      console.error('AI 분석 결과 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!mounted || !user?.admin || !user?.organizationInfo) return;

        // admin 값에 따라 적절한 organizationId 선택
        let organizationId: number | undefined;

        if (user.admin === 'university') {
          organizationId = user.organizationInfo.university?.id;
        } else if (user.admin === 'college') {
          organizationId = user.organizationInfo.college?.id;
        } else if (user.admin === 'department') {
          organizationId = user.organizationInfo.department?.id;
        }

        if (!organizationId) {
          console.error('조직 ID를 찾을 수 없습니다.');
          return;
        }

        // 반납 신청 상세 정보와 AI 분석 결과를 동시에 가져오기
        const [detailResponse] = await Promise.all([
          getRequest<ReturnRequestDetail>(
            `/admin/return-requests/${returnRequestId}?organizationId=${organizationId}`
          ),
          fetchDamageSuggestion(organizationId),
        ]);

        if (mounted) {
          setData(detailResponse);
          console.log('반납 신청 상세:', detailResponse);
        }
      } catch (error) {
        console.error('반납 신청 상세 가져오기 실패:', error);
        if (mounted) {
          setData(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [returnRequestId, user?.admin, user?.organizationInfo]);

  // 반납 승인 처리 함수
  const handleApprove = async () => {
    if (!data || !user) return;

    setApproving(true);
    try {
      const approveData = {
        universityId: data.universityId,
        organizationId: data.organizationId,
        approverUserId: parseInt(user.id), // 실제 사용자 ID 사용
        imageKey: data.submittedImageKey,
      };

      // returnRequestId를 사용해야 함 (API 스펙의 {id}는 반납 요청 ID)
      const response = await postRequest(
        `/admin/return-requests/${returnRequestId}/approve`,
        approveData
      );

      console.log('반납 승인 성공:', response);
      // 승인 성공 후 콜백 함수 호출 (목록 새로고침)
      if (onApproveSuccess) {
        onApproveSuccess();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      console.error('에러 메시지:', errorMessage);
    } finally {
      setApproving(false);
    }
  };

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
      {/* 상단 헤더 */}
      <Box
        position="sticky"
        top={0}
        bg="white"
        zIndex="docked"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={4}
        py={3}
      >
        <HStack>
          <Box bg="gray.100" px={3} py={1} rounded="full" fontSize="sm" color="gray.600">
            Section 40
          </Box>
          <Text fontWeight="semibold" fontSize="lg">
            물품 반납 승인
          </Text>
        </HStack>
      </Box>

      <VStack align="stretch" gap={4} p={4} flex="1" overflowY="auto">
        {/* 반납 당시 사진 */}
        <Box>
          <Text fontWeight="semibold" mb={2}>
            반납 상태
          </Text>
          <WireframePhoto
            titleTop="반납 당시"
            titleBottom="사진"
            imageUrl={data.submittedImageUrl}
          />
        </Box>

        {/* 이전 상태 사진 */}
        <Box>
          <Text fontWeight="semibold" mb={2}>
            반납 이전 상태
          </Text>
          <WireframePhoto titleTop="과거" titleBottom="사진" imageUrl={data.beforeImageUrl} />
        </Box>

        {/* AI 분석 결과 */}
        <Box bg="gray.50" rounded="sm" p={3} minH="160px">
          <Text fontWeight="semibold" mb={3} color="blue.600">
            AI 분석 조언
          </Text>
          {!damageSuggestion ? (
            <VStack align="center" justify="center" h="120px">
              <Spinner size="lg" color="blue.500" />
              <Text fontSize="sm" color="gray.500">
                AI가 이미지를 분석하고 있습니다...
              </Text>
            </VStack>
          ) : (
            <VStack align="stretch" gap={2}>
              <HStack justify="space-between">
                <Text fontSize="sm">초기 상태와 비교했을 때 파손물 %</Text>
                <Text fontSize="sm" fontWeight="bold" color="green.600">
                  {damageSuggestion.damageRate}%
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">어디가 파손되어 보이는 지</Text>
                <Text fontSize="sm" color="green.600">
                  {damageSuggestion.summary}
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.500" mt={2}>
                {damageSuggestion.detail}
              </Text>
            </VStack>
          )}
        </Box>

        {/* 반납 정보 */}
        <VStack align="stretch" gap={2}>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              대여인:
            </Text>
            <Text fontSize="sm">길태은</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              반납일:
            </Text>
            <Text fontSize="sm">{new Date(data.requestedAt).toLocaleDateString('ko-KR')}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              보증금:
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              1,000원
            </Text>
          </HStack>
        </VStack>

        {/* 보증금 반환 체크박스 */}
        <Box>
          <Text fontWeight="semibold" mb={2}>
            보증금 설정
          </Text>
          <Checkbox.Root
            checked={refundDeposit}
            onCheckedChange={(e) => setRefundDeposit(!!e.checked)}
            colorPalette="blue"
            size="md"
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>보증금을 반환한다</Checkbox.Label>
          </Checkbox.Root>

          {refundDeposit && (
            <Box mt={3} p={3} bg="blue.50" rounded="md">
              <Text fontSize="xs" color="blue.600">
                보증금이 반환됩니다. 승인 처리 시 자동으로 환불됩니다.
              </Text>
            </Box>
          )}
        </Box>

        {/* 승인 버튼 */}
        <Box mt={4}>
          <Button
            w="100%"
            colorScheme="blue"
            size="lg"
            onClick={handleApprove}
            loading={approving}
            loadingText="승인 중..."
          >
            승인하기
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}

function WireframePhoto({
  titleTop,
  titleBottom,
  imageUrl,
  height = '200px',
}: {
  titleTop: string;
  titleBottom?: string;
  imageUrl?: string;
  height?: string | number;
}) {
  return (
    <Box>
      <Box
        w="100%"
        h={height}
        border="1px solid"
        borderColor="gray.300"
        rounded="lg"
        overflow="hidden"
        position="relative"
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={titleTop} w="100%" h="100%" objectFit="cover" />
        ) : (
          <VStack
            border="2px dashed"
            borderColor="gray.300"
            rounded="md"
            bg="gray.50"
            align="center"
            justify="center"
            gap={1}
            h="100%"
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
        )}
      </Box>
    </Box>
  );
}
