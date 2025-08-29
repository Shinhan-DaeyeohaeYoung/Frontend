import { Box, Text, VStack, Flex, Image, Badge } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { SegmentButtonGroup, type SegmentOption } from '@/components/SegmentButtonGroup';
import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { SearchInput } from '@/components/Input';
import { useModalStore } from '@/stores/modalStore';
import { Button } from '@/components/Button';
import { getRequest, postRequest } from '@/api/requests';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReturnModal } from './components/ReturnModal';
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

interface ApiResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
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

export default function QrReturnPage() {
  const navigate = useNavigate();
  const { openModal, closeModal } = useModalStore();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();

  // URL에서 토큰 추출
  const token = searchParams.get('token');

  // QR 토큰 검증 결과 상태
  const [qrTokenData, setQrTokenData] = useState<QRTokenResponse | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string>('');

  // QR 토큰 검증 함수
  const validateQRToken = async (token: string) => {
    try {
      setIsLoadingToken(true);
      setTokenError('');

      const response = await postRequest<QRTokenResponse>('/qrs/resolve', {
        token: token,
      });

      if (response) {
        setQrTokenData(response);
        setIsTokenValid(true);
        console.log('QR 토큰 검증 성공:', response);
      }
    } catch (error: any) {
      console.error('QR 토큰 검증 실패:', error);
      setIsTokenValid(false);

      if (error.response?.status === 400) {
        setTokenError('토큰이 누락되었거나 형식이 잘못되었습니다.');
      } else if (error.response?.status === 401) {
        setTokenError('토큰이 만료되었거나 유효하지 않습니다.');
      } else {
        setTokenError('토큰 검증 중 오류가 발생했습니다.');
      }
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
    }
  }, [token]);

  const [data, setData] = useState<Item[]>([]);

  const basicOptions: SegmentOption[] = [
    { value: 'all', label: '전체' },
    { value: 'school', label: '학교' },
    { value: 'middle', label: '총학' },
    { value: 'subject', label: '학과' },
  ];

  const [selectedValue, setSelectedValue] = useState(basicOptions[0].value);

  // 풀스크린 모달을 여는 함수
  const handleOpenModal = (item: Item) => {
    // 실제 값들로 대체해야 함
    const userId = 2;

    openModal({
      body: (
        <ReturnModal
          item={item}
          userId={Number(user.id)}
          onClose={() => {
            // 모달 닫기 로직
            closeModal();
          }}
        />
      ),
      fullscreen: true,
    });
  };

  const handleResultModal = (item: Item) => {
    openModal({
      title: '대여가 완료되었습니다.',
      caption:
        '지정된 기간 안에 물품을 반납해주세요! 파손되거나 연체되는 경우 보증금 환불이 불가할 수 있습니다.',
      footer: (
        <Button
          w="full"
          onClick={() => {
            navigate('/rent');
          }}
          label="홈으로 가기"
        ></Button>
      ),
    });
  };

  const fetchListData = async () => {
    try {
      // authStore에서 organizationId 가져오기 - 모든 조직 확인
      let currentOrganizationId: number | undefined;

      console.log('현재 사용자 정보:', user);
      console.log('사용자 admin 권한:', user?.admin);
      console.log('조직 정보:', user?.organizationInfo);

      // 모든 가능한 조직 ID 확인
      const universityId = user?.organizationInfo?.university?.id;
      const collegeId = user?.organizationInfo?.college?.id;
      const departmentId = user?.organizationInfo?.department?.id;

      console.log('가능한 조직 ID들:', { universityId, collegeId, departmentId });

      // admin 권한에 따라 조직 ID 선택
      if (user?.admin === 'university' && universityId) {
        currentOrganizationId = universityId;
        console.log('대학교 관리자로 설정됨:', currentOrganizationId);
      } else if (user?.admin === 'college' && collegeId) {
        currentOrganizationId = collegeId;
        console.log('총학생회 관리자로 설정됨:', currentOrganizationId);
      } else if (user?.admin === 'department' && departmentId) {
        currentOrganizationId = departmentId;
        console.log('학과 관리자로 설정됨:', currentOrganizationId);
      } else {
        // admin이 none이거나 조직 정보가 없는 경우, 첫 번째로 사용 가능한 조직 ID 사용
        currentOrganizationId = universityId || collegeId || departmentId;
        console.log('기본 조직 ID 사용:', currentOrganizationId);
      }

      if (!currentOrganizationId) {
        console.error('조직 ID를 찾을 수 없습니다. 사용자 정보:', user);
        setTokenError('사용자 조직 정보를 찾을 수 없습니다.');
        return;
      }

      console.log('최종 선택된 조직 ID:', currentOrganizationId);

      // [todo] api 수정GET/api/rental-requests/{organizationId}/holding
      // 내 홀딩 예약 중 특정 조직의 것만
      const res = await getRequest<ApiResponse<Item>>(
        `http://43.200.61.108:8082/api/rental-requests/${currentOrganizationId}/holding`
      );

      // setData(res?.content);
      const dummyContent = [
        {
          rentalId: 0,
          unitId: 0,
          assetNo: 'string',
          unitStatus: 'string',
          itemId: 0,
          description: 'string',
          universityId: 0,
          organizationId: currentOrganizationId,
          photos: [
            {
              assetNo: 'string',
              key: 'string',
              imageUrl: 'string',
            },
          ],
        },
      ];
      setData(dummyContent);

      if (dummyContent.length == 0) {
        // if (res?.content.length == 0) {
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
      } else {
        // [todo] 한 개일 때 분기처리
        console.log('데이터가 있습니다:', dummyContent.length);
      }
      console.log(res);
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  };

  const handleBook = (itemId: number) => {
    // api 요청
    try {
      const request = async () => {
        // [todo] api 수정
        const res = await postRequest(`http://43.200.61.108:8082/api/waitlists/items/${itemId}`);
        alert('완료!');
        closeModal();
        fetchListData();
      };
      request();
    } catch {}
  };

  useEffect(() => {
    try {
      fetchListData();
    } catch {}
  }, [selectedValue]);

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
              🎯 이제 반납할 물품을 선택해주세요!
            </Text>
          </VStack>
        </Box>
      );
    }

    return null;
  };

  return (
    <Box px={10}>
      <PageHeader
        px={0}
        py={10}
        bgColor={'transparent'}
        title={'반납하기'}
        subtitle={'사무실에서 대여한 물품 중 반납하려는 물품을 선택해주세요!'}
      ></PageHeader>

      {/* QR 토큰 정보 표시 */}
      {renderQRTokenInfo()}

      <VStack gap={2} align="stretch" mt={2}>
        {data.map((el) => {
          return (
            <Card
              image={<Image src={`${el?.coverKey}`} />}
              title={el?.name}
              subtitle={el?.description}
              bottomExtra={
                <Flex justify={'space-between'} width={'100%'} align={'flex-end'}>
                  <Button
                    ml="auto"
                    size="sm"
                    label={'반납하기'}
                    onClick={() => {
                      //   if (canRent) {
                      handleOpenModal(el);
                      //   } else if (canBook) {
                      //     handleOpenBookModal(el);
                      //   }
                    }}
                  ></Button>
                </Flex>
              }
            ></Card>
          );
        })}
      </VStack>
    </Box>
  );
}
