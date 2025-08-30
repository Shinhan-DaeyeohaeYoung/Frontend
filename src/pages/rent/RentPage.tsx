import { Box, Text, VStack, Flex, Image, Heading } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { useModalStore } from '@/stores/modalStore';
import ItemDetailModalContent from './components/ItemDetailModalContent';
import { Button } from '@/components/Button';
import { getRequest, postRequest } from '@/api/requests';
import logo_01 from '@/assets/imgs/logo_01.png';
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
  isBooked: boolean; // 예약 상태 필드 추가
}

// 아이템 목록이 비어있을 때 표시할 컴포넌트
const EmptyState = () => (
  <VStack gap={6} py={12} textAlign="center">
    <Box fontSize="6xl">😢</Box>
    <VStack gap={2}>
      <Heading size="md" color="gray.600">
        현재 대여가능한 물품이 없습니다...
      </Heading>
    </VStack>
  </VStack>
);

export default function RentPage() {
  const { openModal, closeModal } = useModalStore();

  const [data, setData] = useState<Item[]>([]);

  // 풀스크린 모달을 여는 함수
  const handleOpenItemModal = (item: Item) => {
    openModal({
      title: item?.name,
      caption: '대표 사진 등록하기',
      body: <ItemDetailModalContent itemId={item.id} />,
      fullscreen: true, // 풀스크린 모드 활성화
    });
  };

  const handleOpenBookModal = (item: Item) => {
    openModal({
      title: '물품을 예약할까요?',
      caption: '물품을 대여할 수 있게 되면 자동으로 홀딩됩니다!',
      footer: (
        <Button
          w="full"
          onClick={() => {
            handleBook(item.id);
          }}
          label="예약하기"
        ></Button>
      ),
    });
  };
  const fetchListData = async () => {
    try {
      // 하드코딩된 URL을 requests 함수로 변경
      const res = await getRequest<ApiResponse<Item>>('/items');
      setData(res?.content || []);
      console.log('아이템 목록 조회 성공:', res);
    } catch (error) {
      console.error('아이템 목록 조회 실패:', error);
      setData([]);
    }
  };
  const handleBook = async (itemId: number) => {
    try {
      // 하드코딩된 URL을 requests 함수로 변경
      await postRequest(`/waitlists/items/${itemId}`);
      alert('예약이 완료되었습니다!');
      closeModal();
      fetchListData();
    } catch (error: unknown) {
      console.error('예약 실패:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '예약 중 오류가 발생했습니다.';
      alert(`예약 실패: ${errorMessage}`);
    }
  };

  // 예약 취소 API 호출 함수 추가
  const handleCancelReservation = async (itemId: number) => {
    try {
      // 올바른 API 엔드포인트 사용
      const response = await postRequest(`/waitlists/items/${itemId}/cancel`);

      console.log('대기열 취소 성공:', response);
      alert('대기열이 취소되었습니다.');

      // 목록 새로고침
      fetchListData();
    } catch (error: unknown) {
      console.error('대기열 취소 실패:', error);

      let errorMessage = '대기열 취소 중 오류가 발생했습니다.';

      // 타입 단언으로 error 타입 지정
      const axiosError = error as { response?: { status?: number } };

      if (axiosError.response?.status === 403) {
        errorMessage = '본인이 참여한 대기열이 아닙니다.';
      } else if (axiosError.response?.status === 404) {
        errorMessage = '대기열을 찾을 수 없습니다.';
      }

      alert(`대기열 취소 실패: ${errorMessage}`);
    }
  };

  useEffect(() => {
    // try-catch 제거 (fetchListData 내부에서 이미 처리)
    fetchListData();
  }, []); // selectedValue 의존성 제거

  return (
    <Box
    // px={10}
    >
      <PageHeader
        // bgColor={'#A1C9FA'}
        // bgColor={'transparent'}
        // titleColor="#002DAB"
        imageSrc={logo_01}
        imageSize={40}
        title={'대여해요'}
        subtitle={'대여하실 물품을 선택해주세요! \n 대여가능시간: 09:00 ~ 18:00 (사무실 운영시간)'}
      ></PageHeader>

      <VStack gap={0} align="stretch" mt={4} borderBottom="1px solid" borderColor="gray.200">
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          data.map((el) => {
            const canRent = el?.availableQuantity > 0; // 사용 가능한 수량이 1개 이상
            const canBook =
              el?.availableQuantity === 0 && el?.totalQuantity - el?.countWaitList > 0; // 대여 불가능하지만 예약 가능한 수량이 있을 때
            const isBooked = el?.isBooked; // 예약 상태 확인

            return (
              <Card
                image={<Image src={`${el?.coverKey}`} />}
                title={el?.name}
                subtitle={el?.description}
                bottomExtra={
                  <Flex justify={'space-between'} width={'100%'} align={'flex-end'}>
                    <Text fontSize={'xs'} color={'gray.500'}>
                      {`${
                        canRent
                          ? `대여 가능: ${el?.availableQuantity}/${el?.totalQuantity}개`
                          : `예약 가능: ${el?.totalQuantity - el?.countWaitList}/${
                              el?.totalQuantity
                            }개`
                      }`}
                    </Text>
                    <Button
                      ml="auto"
                      size="sm"
                      label={isBooked ? '예약 취소' : canRent ? '대여신청' : '예약하기'}
                      onClick={() => {
                        if (isBooked) {
                          handleCancelReservation(el.id);
                        } else if (canRent) {
                          handleOpenItemModal(el);
                        } else if (canBook) {
                          handleOpenBookModal(el);
                        }
                      }}
                      disabled={!canRent && !canBook && !isBooked}
                      backgroundColor={isBooked ? 'red.500' : canRent ? 'accent.500' : 'teal.500'}
                    ></Button>
                  </Flex>
                }
              ></Card>
            );
          })
        )}
      </VStack>
    </Box>
  );
}
