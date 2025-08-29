import { Box, Text, VStack, Flex, Image, Badge, HStack } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { useModalStore } from '@/stores/modalStore';
import { Button } from '@/components/Button';
import { getRequest, postRequest } from '@/api/requests';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { createHandleOpenModal } from './components/ReturnModal';

// QR 토큰 검증 응답 타입
interface QRTokenResponse {
  type: string;
  universityId: number;
  organizationId: number;
  issuedAt: string;
  expiresAt: string;
}

// 대여 중인 물품 타입 정의
interface RentalItem {
  id: number;
  universityId: number;
  organizationId: number;
  userId: number;
  itemId: number;
  individualItemId: number;
  quantity: number;
  rentedAt: string;
  dueAt: string;
  returnedAt: string | null;
  status: string;
  depositId: number | null;
}

// 대여 목록 응답 타입
interface RentalListResponse {
  content: RentalItem[];
  page: number;
  size: number;
  totalElements: number;
}

// 물품 사진 타입 정의
interface ItemPhoto {
  id: number;
  key: string;
  imageUrl: string;
  mime: string | null;
  hash: string | null;
  takenAt: string | null;
}

// 물품 정보 타입 정의
interface ItemInfo {
  id: number;
  name: string;
  description: string;
  coverKey: string;
}

export default function QrReturnPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { openModal, closeModal } = useModalStore();

  // URL에서 토큰 추출
  const token = searchParams.get('token');

  // QR 토큰 검증 결과 상태
  const [qrTokenData, setQrTokenData] = useState<QRTokenResponse | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string>('');

  // 대여 중인 물품 목록 상태
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [isLoadingRentals, setIsLoadingRentals] = useState<boolean>(false);

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
        const { user } = useAuthStore.getState(); // 컴포넌트 외부에서 store 접근

        if (!user) {
          setTokenError('사용자 정보를 찾을 수 없습니다.');
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
            '해당 조직의 반납 권한이 없습니다. 본인 소속 조직의 QR만 스캔할 수 있습니다.'
          );
          setIsTokenValid(false);
          return;
        }

        // 권한 확인 성공
        setQrTokenData(response);
        setIsTokenValid(true);
        console.log('QR 토큰 검증 및 권한 확인 성공:', response);

        // 토큰 검증 성공 후 대여 목록 가져오기
        await fetchRentalItems(response.organizationId);
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
    } finally {
      setIsLoadingToken(false);
    }
  };

  // 대여 중인 물품 목록 가져오기
  const fetchRentalItems = async (organizationId: number) => {
    try {
      setIsLoadingRentals(true);

      const response = await getRequest<RentalListResponse>(
        `/rentals/organizations/${organizationId}`
      );

      if (response && response.content) {
        // RENTED 상태이고 반납되지 않은 물품만 필터링
        const activeRentals = response.content.filter(
          (item) => item.status === 'RENTED' && !item.returnedAt
        );

        setRentalItems(activeRentals);
        console.log('대여 중인 물품:', activeRentals);
      }
    } catch (error) {
      console.error('대여 목록 가져오기 실패:', error);
      setRentalItems([]);
    } finally {
      setIsLoadingRentals(false);
    }
  };

  // 물품 사진 가져오기
  const getItemPhoto = async (itemId: number, assetNo: string): Promise<string | null> => {
    try {
      const response = await getRequest<ItemPhoto>(`/items/${itemId}/units/${assetNo}/photo`);
      return response?.imageUrl || null;
    } catch (error) {
      console.error('물품 사진 가져오기 실패:', error);
      return null;
    }
  };

  // ReturnModal 직접 렌더링 제거
  // <ReturnModal /> 삭제

  // handleOpenReturnModal 함수 생성
  const handleOpenReturnModal = createHandleOpenModal(openModal, closeModal);

  // 반납 신청 처리 함수에서 모달 열기
  const handleReturnRequest = (rentalItem: RentalItem) => {
    // ReturnModal에 필요한 모든 정보 전달
    handleOpenReturnModal({
      id: rentalItem.itemId,
      name: `물품 ID: ${rentalItem.itemId}`,
      rentalId: rentalItem.id,
      universityId: rentalItem.universityId, // ✅ 추가됨
      organizationId: rentalItem.organizationId, // ✅ 추가됨
      userId: rentalItem.userId, // ✅ 추가됨
    });
  };

  // 컴포넌트 마운트 시 토큰 검증
  useEffect(() => {
    if (token) {
      validateQRToken(token);
    } else {
      setTokenError('QR 토큰이 없습니다.');
    }
  }, [token]);

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

                <Text fontSize="sm" color="green.600" textAlign="center">
                  🎯 반납할 물품을 선택해주세요!
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Box>
      );
    }

    return null;
  };

  // 대여 중인 물품 목록 렌더링
  const renderRentalItems = () => {
    if (isLoadingRentals) {
      return (
        <Box bg="blue.50" p={4} borderRadius="md" mb={4}>
          <Text color="blue.600" fontWeight="bold">
            🔍 대여 목록을 불러오는 중...
          </Text>
        </Box>
      );
    }

    if (rentalItems.length === 0) {
      return (
        <Box bg="yellow.50" p={6} borderRadius="xl" mb={6} textAlign="center">
          <Text fontSize="lg" color="yellow.700" fontWeight="bold">
            📦 반납할 물품이 없습니다
          </Text>
          <Text color="yellow.600" mt={2}>
            현재 대여 중인 물품이 없거나 모든 물품이 반납되었습니다.
          </Text>
          <Button mt={4} onClick={() => navigate('/main')} label="홈으로 가기" />
        </Box>
      );
    }

    return (
      <VStack gap={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          반납할 물품 목록 ({rentalItems.length}개)
        </Text>

        {rentalItems.map((item) => (
          <Card
            key={item.id}
            image={
              <Image
                src="/placeholder-image.jpg"
                alt="물품 이미지"
                fallbackSrc="/placeholder-image.jpg"
              />
            }
            title={`물품 ID: ${item.itemId}`}
            subtitle={`개별 ID: ${item.individualItemId}`}
            bottomExtra={
              <VStack gap={3} align="stretch">
                <HStack justify="space-between" fontSize="sm" color="gray.600">
                  <Text>대여일:</Text>
                  <Text>{new Date(item.rentedAt).toLocaleDateString('ko-KR')}</Text>
                </HStack>
                <HStack justify="space-between" fontSize="sm" color="gray.600">
                  <Text>반납예정일:</Text>
                  <Text>{new Date(item.dueAt).toLocaleDateString('ko-KR')}</Text>
                </HStack>
                <Button
                  w="full"
                  size="sm"
                  label="반납 신청하기"
                  onClick={() => handleReturnRequest(item)}
                />
              </VStack>
            }
          />
        ))}
      </VStack>
    );
  };

  return (
    <Box px={10}>
      <PageHeader
        px={0}
        py={10}
        bgColor={'transparent'}
        title={'반납해요'}
        subtitle={'반납하실 물품을 선택해주세요! \n 반납가능시간: 09:00 ~ 18:00 (사무실 운영시간)'}
      />

      {/* QR 토큰 정보 표시 */}
      {renderQRTokenInfo()}

      {/* 대여 중인 물품 목록 표시 */}
      {isTokenValid && renderRentalItems()}
    </Box>
  );
}
