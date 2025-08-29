import { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Spinner, Image, Checkbox, Button } from '@chakra-ui/react';
import { getRequest, postRequest } from '@/api/requests';
import { useAuthStore } from '@/stores/authStore';

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
  const [loading, setLoading] = useState(true);
  const [refundDeposit, setRefundDeposit] = useState(false);
  const [approving, setApproving] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!mounted) return;

        // returnRequestId로 API 호출
        const response = await getRequest<ReturnRequestDetail>(
          `/admin/return-requests/${returnRequestId}`
        );
        if (mounted) {
          setData(response);
          console.log('반납 신청 상세:', response);
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
  }, [returnRequestId]); // 의존성도 변경

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
          <VStack align="stretch" gap={2}>
            <HStack justify="space-between">
              <Text fontSize="sm">초기 상태와 비교했을 때 파손물 %</Text>
              <Text fontSize="sm" fontWeight="bold" color="green.600">
                11%
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm">어디가 파손되어 보이는 지</Text>
              <Text fontSize="sm" color="green.600">
                없음
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm">예상 보증금 차감액?</Text>
              <Text fontSize="sm" color="green.600">
                0원
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.500" mt={2}>
              (GPT 분석) 승인 버튼 클릭
            </Text>
          </VStack>
        </Box>

        {/* 반납 정보 */}
        <VStack align="stretch" gap={2}>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              대여인:
            </Text>
            <Text fontSize="sm">사용자 {data.userId}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              반납일:
            </Text>
            <Text fontSize="sm">{new Date(data.requestedAt).toLocaleDateString('ko-KR')}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              돌려줄 금액:
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              10,000원
            </Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              현재 보증금:
            </Text>
            <Text fontSize="sm">10,000원</Text>
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
