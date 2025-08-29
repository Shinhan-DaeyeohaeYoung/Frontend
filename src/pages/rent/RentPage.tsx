import { Box, Text, VStack, Flex, Image } from '@chakra-ui/react';
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
}

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

  useEffect(() => {
    // try-catch 제거 (fetchListData 내부에서 이미 처리)
    fetchListData();
  }, []); // selectedValue 의존성 제거

  return (
    <Box
    // px={10}
    >
      <PageHeader
        px={4}
        pt={10}
        py={16}
        // bgColor={'#A1C9FA'}
        // bgColor={'transparent'}
        // titleColor="#002DAB"
        imageSrc={logo_01}
        imageSize={40}
        title={'대여해요'}
        subtitle={'대여하실 물품을 선택해주세요! \n 대여가능시간: 09:00 ~ 18:00 (사무실 운영시간)'}
      ></PageHeader>

      <VStack gap={0} align="stretch" mt={4} borderBottom="1px solid" borderColor="gray.200">
        {data.map((el) => {
          const canRent = el?.availableQuantity > 0; // 사용 가능한 수량이 1개 이상
          const canBook = el?.availableQuantity === 0 && el?.countWaitList < el?.totalQuantity; // 대여 불가능하지만 대기열에 여유가 있을 때
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
                        : `예약 가능: ${el?.countWaitList}/${el?.totalQuantity}개`
                    }`}
                  </Text>
                  <Button
                    ml="auto"
                    size="sm"
                    label={canRent ? `대여하기` : `예약하기`}
                    onClick={() => {
                      if (canRent) {
                        handleOpenItemModal(el); // 대여 모달 열기
                      } else if (canBook) {
                        handleOpenBookModal(el); // 예약 모달 열기
                      }
                    }}
                    disabled={!canRent && !canBook} // 둘 다 불가능하면 버튼 비활성화
                  >
                    {canRent ? '대여하기' : '예약하기'}
                  </Button>
                </Flex>
              }
            ></Card>
          );
        })}
      </VStack>
    </Box>
  );
}
