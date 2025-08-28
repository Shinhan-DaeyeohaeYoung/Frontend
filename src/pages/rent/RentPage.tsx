import { Box, Text, VStack, Flex, Image } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { SegmentButtonGroup, type SegmentOption } from '@/components/SegmentButtonGroup';
import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { SearchInput } from '@/components/Input';
import { useModalStore } from '@/stores/modalStore';
import ItemDetailModalContent from './components/ItemDetailModalContent';
import { Button } from '@/components/Button';
import { getRequest, postRequest } from '@/api/requests';

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
  const dummyContent =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  // const response = {
  //   content: [
  // {
  //   id: 1,
  //   universityId: 1,
  //   organizationId: 2,
  //   name: '충전기',
  //   totalQuantity: 2,
  //   availableQuantity: 2,
  //   isActive: true,
  //   coverKey: 'univ/1/items/1/units/501.jpg',
  // },
  //     {
  //       id: 1,
  //       universityId: 1,
  //       organizationId: 2,
  //       name: '충전기',
  //       totalQuantity: 2,
  //       availableQuantity: 2,
  //       isActive: true,
  //       coverKey: 'univ/1/items/1/units/501.jpg',
  //     },
  //     {
  //       id: 1,
  //       universityId: 1,
  //       organizationId: 2,
  //       name: '충전기',
  //       totalQuantity: 2,
  //       availableQuantity: 2,
  //       isActive: true,
  //       coverKey: 'univ/1/items/1/units/501.jpg',
  //     },
  //   ],
  //   page: 0,
  //   size: 20,
  //   totalElements: 1,
  // };

  const [query, setQuery] = useState('');
  const [lastSearched, setLastSearched] = useState('');
  const { openModal, closeModal } = useModalStore();

  const handleSearch = () => {
    // 이 자리에서 API 호출 또는 필터링 로직 실행
    setLastSearched(query);
    console.log('검색 실행:', query);
  };

  const [data, setData] = useState<Item[]>([]);

  const basicOptions: SegmentOption[] = [
    { value: 'all', label: '전체' },
    { value: 'school', label: '학교' },
    { value: 'middle', label: '총학' },
    { value: 'subject', label: '학과' },
  ];

  const [selectedValue, setSelectedValue] = useState(basicOptions[0].value);

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
    // [todo] api 수정
    const res = await getRequest<ApiResponse<Item>>(`http://43.200.61.108:8082/api/items`);
    setData(res?.content);
    console.log(res);
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

  return (
    <Box px={10}>
      <PageHeader
        px={0}
        py={10}
        bgColor={'transparent'}
        title={'대여해요'}
        subtitle={'대여하실 물품을 선택해주세요! \n 대여가능시간: 09:00 ~ 18:00 (사무실 운영시간)'}
      ></PageHeader>

      <VStack gap={2} align="stretch" mt={2}>
        {data.map((el) => {
          const canRent = el?.availableQuantity < el?.totalQuantity;
          const canBook = el?.countWaitList < el?.totalQuantity; // [todo] 예약 로직 수정
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
                        handleOpenItemModal(el);
                      } else if (canBook) {
                        handleOpenBookModal(el);
                      }
                    }}
                    disabled={!canRent && !canBook}
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
