import { Box, Text, VStack, Flex, Image, Badge } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/Card';
import { useModalStore } from '@/stores/modalStore';
import { Button } from '@/components/Button';
import { getRequest, postRequest } from '@/api/requests';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

// QR 토큰 검증 응답 타입
interface QRTokenResponse {
  type: string;
  universityId: number;
  organizationId: number;
  issuedAt: string;
  expiresAt: string;
}

//   availableQuantity < totalQuantity면 대여가능
// countWaitList < totalQuantity면 대기열 가능
// countWaitList >= totalQuantity면 대기열 불가능

// API 응답 타입 정의
interface HoldingItem {
  id: number; // rental-request ID (API에서 사용할 ID)
  rentalId: number; // 실제 rental ID
  unitId: number;
  assetNo: string;
  unitStatus: string;
  itemId: number;
  description: string;
  universityId: number;
  organizationId: number;
  photos: {
    assetNo: string;
    key: string;
    imageUrl: string;
  }[];
}

// 아이템 타입 정의
export interface Item {
  id: number;
  universityId: number;
  organizationId: number;
  name: string;
  totalQuantity: number;
  availableQuantity: number;
  isActive: boolean;
  coverKey: string;
  description: string;
  countWaitList: number;
}

export default function QrRentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { openModal, closeModal } = useModalStore();

  // URL에서 토큰 추출
  const token = searchParams.get('token');

  // QR 토큰 검증 결과 상태
  const [qrTokenData, setQrTokenData] = useState<QRTokenResponse | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string>('');

  // QR 토큰 검증 함수 수정
  const validateQRToken = async (token: string) => {
    try {
      setIsLoadingToken(true);
      setTokenError('');

      const response = await postRequest<QRTokenResponse>('/qrs/resolve', {
        token: token,
      });

      if (response) {
        // 🔒 중요: QR 토큰의 organizationId와 사용자 소속 조직 비교
        if (!user) {
          setTokenError('사용자 정보를 찾을 수 없습니다.');
          setTimeout(() => navigate('/qr/scan'), 2000); // 2초 후 스캔 페이지로 이동
          return;
        }

        // 사용자의 소속 조직 정보 확인
        const userUniversityId = user.organizationInfo?.university?.id;
        const userCollegeId = user.organizationInfo?.college?.id;
        const userDepartmentId = user.organizationInfo?.department?.id;

        // QR 토큰의 organizationId가 사용자 소속 조직 중 하나와 일치하는지 확인
        const isAuthorized =
          response.organizationId === userUniversityId ||
          response.organizationId === userCollegeId ||
          response.organizationId === userDepartmentId;

        if (!isAuthorized) {
          setTokenError(
            '해당 조직의 대여 권한이 없습니다. 본인 소속 조직의 QR만 스캔할 수 있습니다.'
          );
          setIsTokenValid(false);
          setTimeout(() => navigate('/qr/scan'), 3000); // 3초 후 스캔 페이지로 이동
          return;
        }

        // 권한 확인 성공
        setQrTokenData(response);
        setIsTokenValid(true);
        console.log('QR 토큰 검증 및 권한 확인 성공:', response);

        // 토큰 검증 성공 후 대여 목록 가져오기
        await fetchListData();
      }
    } catch (error: unknown) {
      console.error('QR 토큰 검증 실패:', error);
      setIsTokenValid(false);

      const axiosError = error as { response?: { status?: number } };

      if (axiosError.response?.status === 400) {
        setTokenError('토큰이 누락되었거나 형식이 잘못되었습니다.');
      } else if (axiosError.response?.status === 401) {
        setTokenError('토큰이 만료되었거나 유효하지 않습니다.');
      } else {
        setTokenError('토큰 검증 중 오류가 발생했습니다.');
      }

      // 에러 발생 시 3초 후 스캔 페이지로 이동
      setTimeout(() => navigate('/qr/scan'), 3000);
    } finally {
      setIsLoadingToken(false);
    }
  };

  // 컴포넌트 마운트 시 토큰 검증
  useEffect(() => {
    if (token) {
      validateQRToken(token);
    } else {
      setTokenError('QR 토큰이 없습니다.');
      // 토큰이 없으면 즉시 스캔 페이지로 이동
      setTimeout(() => navigate('/qr/scan'), 2000);
    }
  }, [token]);

  // 데이터 상태를 HoldingItem 타입으로 변경
  const [data, setData] = useState<HoldingItem[]>([]);

  // 대여 확정 API 호출 함수 추가
  const handleApproveRental = async (item: HoldingItem) => {
    try {
      // rentalId 사용 (rental_requests 테이블의 ID)
      const response = await postRequest(`/rental-requests/${item.rentalId}/approve`);

      console.log('대여 확정 성공:', response);
      handleResultModal();
    } catch (error: unknown) {
      console.error('대여 확정 실패:', error);

      let errorMessage = '대여 확정 중 오류가 발생했습니다.';

      const axiosError = error as { response?: { status?: number } };

      if (axiosError.response?.status === 400) {
        errorMessage = '만료되었거나 상태 전이가 불가능합니다.';
      } else if (axiosError.response?.status === 403) {
        errorMessage = '본인이 소유한 예약이 아닙니다.';
      } else if (axiosError.response?.status === 404) {
        errorMessage = '예약을 찾을 수 없습니다.';
      }

      alert(`대여 확정 실패: ${errorMessage}`);
    }
  };

  // 첫 번째 모달 수정
  const handleOpenModal = (item: HoldingItem) => {
    openModal({
      title: `${item?.assetNo}번 물품이 배정되었습니다!`,
      caption: `${item?.assetNo}번 물품을 가져가세요!`, // id → assetNo로 통일
      body: (
        <Button
          w="full"
          onClick={() => {
            closeModal(); // 첫 번째 모달 닫기
            handleApproveRental(item); // 대여 확정 API 호출
          }}
          label="대여하기"
        ></Button>
      ),
    });
  };

  // 결과 모달 수정
  const handleResultModal = () => {
    openModal({
      title: '대여가 완료되었습니다.',
      caption:
        '지정된 기간 안에 물품을 반납해주세요! 파손되거나 연체되는 경우 보증금 환불이 불가할 수 있습니다.',
      footer: (
        <Button
          w="full"
          onClick={() => {
            closeModal(); // 모달 닫기
            navigate('/rent'); // 홈으로 이동
          }}
          label="홈으로 가기"
        ></Button>
      ),
    });
  };

  // fetchListData 함수 수정 - QR 토큰의 organizationId 사용
  const fetchListData = useCallback(async () => {
    try {
      // QR 토큰에서 검증된 organizationId 사용
      if (!qrTokenData) {
        console.error('QR 토큰 데이터가 없습니다.');
        return;
      }

      const currentOrganizationId = qrTokenData.organizationId;
      console.log('QR 토큰에서 가져온 조직 ID:', currentOrganizationId);

      // 실제 API 호출하여 홀딩 중인 물품 가져오기
      const res = await getRequest<HoldingItem[]>(
        `/rental-requests/${currentOrganizationId}/holding`
      );

      if (res && Array.isArray(res)) {
        setData(res);
        console.log('홀딩 중인 물품 데이터:', res);

        if (res.length === 0) {
          openModal({
            title: '대여할 수 있는 물품이 없어요',
            caption: '대여하기 버튼을 누른 후 QR을 스캔해주세요',
            body: (
              <Button
                w="full"
                onClick={() => {
                  navigate('/rent');
                }}
                label="홈으로 가기"
              ></Button>
            ),
          });
        }
      } else {
        console.log('응답 데이터가 없거나 배열이 아님:', res);
        setData([]);
      }
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      setData([]);
    }
  }, [qrTokenData, openModal, navigate]);

  useEffect(() => {
    if (qrTokenData) {
      fetchListData();
    }
  }, [qrTokenData, fetchListData]);

  // QR 토큰 정보 표시 컴포넌트
  const renderQRTokenInfo = () => {
    if (isLoadingToken) {
      return (
        <Box bg="blue.50" p={4} borderRadius="md" mb={4}>
          <Text color="blue.600" fontWeight="bold">
            🔍 QR 토큰 검증 중...
          </Text>
        </Box>
      );
    }

    if (tokenError) {
      return (
        <Box bg="red.50" p={4} borderRadius="md" mb={4}>
          <Text color="red.600" fontWeight="bold">
            ❌ 오류: {tokenError}
          </Text>
        </Box>
      );
    }

    if (qrTokenData && isTokenValid) {
      return (
        <Box
          bg="green.50"
          p={6}
          borderRadius="xl"
          mb={6}
          border="2px solid"
          borderColor="green.200"
        >
          <VStack gap={4} align="stretch">
            <Text fontSize="xl" fontWeight="bold" color="green.700" textAlign="center">
              ✅ QR 토큰 검증 성공!
            </Text>

            <Box bg="white" p={4} borderRadius="md">
              <VStack gap={3} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" color="gray.700">
                    토큰 타입:
                  </Text>
                  <Badge colorScheme="blue" fontSize="sm">
                    {qrTokenData.type}
                  </Badge>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" color="gray.700">
                    대학교 ID:
                  </Text>
                  <Text color="gray.600">{qrTokenData.universityId}</Text>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" color="gray.700">
                    조직 ID:
                  </Text>
                  <Text color="gray.600">{qrTokenData.organizationId}</Text>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" color="gray.700">
                    발급 시간:
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {new Date(qrTokenData.issuedAt).toLocaleString('ko-KR')}
                  </Text>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" color="gray.700">
                    만료 시간:
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {new Date(qrTokenData.expiresAt).toLocaleString('ko-KR')}
                  </Text>
                </Flex>
              </VStack>
            </Box>

            <Text fontSize="sm" color="green.600" textAlign="center">
              🎯 이제 대여할 물품을 선택해주세요!
            </Text>
          </VStack>
        </Box>
      );
    }

    return null;
  };

  // 데이터 렌더링 부분 수정
  return (
    <Box>
      <PageHeader
        px={10}
        py={10}
        title={'대여해요'}
        subtitle={'대여하실 물품을 선택해주세요! \n 대여가능시간: 09:00 ~ 18:00 (사무실 운영시간)'}
      ></PageHeader>

      {/* QR 토큰 정보 표시 */}
      {/* {renderQRTokenInfo()} */}
      <Box px={10}>
        <VStack gap={2} align="stretch" mt={2}>
          {data.map((item) => {
            return (
              <Card
                key={item.rentalId}
                image={
                  item.photos && item.photos.length > 0 ? (
                    <Image src={item.photos[0].imageUrl} alt={item.description} />
                  ) : (
                    <Image src="/placeholder-image.jpg" alt="이미지 없음" />
                  )
                }
                title={`${item.assetNo} - ${item.description}`}
                subtitle={`상태: ${item.unitStatus}`}
                bottomExtra={
                  <Flex justify={'space-between'} width={'100%'} align={'flex-end'}>
                    <Button
                      ml="auto"
                      size="sm"
                      label={'대여하기'}
                      onClick={() => {
                        handleOpenModal(item);
                      }}
                    ></Button>
                  </Flex>
                }
              ></Card>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
}
