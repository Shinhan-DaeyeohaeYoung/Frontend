import { Box, Heading, Text, VStack, HStack, Badge, Flex, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { SegmentButtonGroup, type SegmentOption } from '@/components/SegmentButtonGroup';
import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { SearchInput } from '@/components/Input';
import { useModalStore } from '@/stores/modalStore';
import ItemDetailModalContent from './components/ItemDetailModalContent';
import { Tag } from '@/components/Tag';
import { Button } from '@/components/Button';
export default function RentPage() {
  const dummyContent =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  const response = {
    content: [
      {
        id: 1,
        universityId: 1,
        organizationId: 2,
        name: '충전기',
        totalQuantity: 2,
        availableQuantity: 2,
        isActive: true,
        coverKey: 'univ/1/items/1/units/501.jpg',
      },
      {
        id: 1,
        universityId: 1,
        organizationId: 2,
        name: '충전기',
        totalQuantity: 2,
        availableQuantity: 2,
        isActive: true,
        coverKey: 'univ/1/items/1/units/501.jpg',
      },
      {
        id: 1,
        universityId: 1,
        organizationId: 2,
        name: '충전기',
        totalQuantity: 2,
        availableQuantity: 2,
        isActive: true,
        coverKey: 'univ/1/items/1/units/501.jpg',
      },
    ],
    page: 0,
    size: 20,
    totalElements: 1,
  };

  const [query, setQuery] = useState('');
  const [lastSearched, setLastSearched] = useState('');
  const { openModal, closeModal } = useModalStore();

  const handleSearch = () => {
    // 이 자리에서 API 호출 또는 필터링 로직 실행
    setLastSearched(query);
    console.log('검색 실행:', query);
  };

  const [data, setData] = useState(response.content);

  const basicOptions: SegmentOption[] = [
    { value: 'all', label: '전체' },
    { value: 'school', label: '학교' },
    { value: 'middle', label: '총학' },
    { value: 'subject', label: '학과' },
  ];

  const [selectedValue, setSelectedValue] = useState(basicOptions[0].value);

  // 풀스크린 모달을 여는 함수
  const handleOpenItemModal = (item) => {
    openModal({
      title: item?.title,
      caption: '대표 사진 등록하기',
      body: <ItemDetailModalContent itemId={item.itemId} />,
      // footer: null,
      // footer: (
      //   <Button w="full" onClick={() => rentAction?.()}>
      //     대여하기
      //   </Button>
      // ),
      fullscreen: true, // 풀스크린 모드 활성화
    });
  };

  const handleOpenBookModal = (item) => {
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

  const handleBook = () => {
    // api 요청
    try {
      alert('api 요청');
      closeModal();
    } catch {}
  };

  useEffect(() => {
    // alert('검색 api 실행');  [todo]: api 연동
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

      <Flex flexDir={'column'} mt={2}>
        <SearchInput
          placeholder="물품명을 입력해주세요"
          buttonText="검색"
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          size="md"
          variant="outline"
          name="itemSearch"
        />

        <SegmentButtonGroup
          ml={'auto'}
          // mr={'auto'}
          mt={2}
          size="sm"
          options={basicOptions}
          value={selectedValue}
          onChange={setSelectedValue}
        />
      </Flex>

      <VStack gap={2} align="stretch" mt={2}>
        {data.map((el) => {
          const canRent = el?.availableQuantity < el?.totalQuantity;
          const canBook = true; // [todo] 예약 로직 수정
          return (
            <Card
              image={
                <Image src="https://1801889e95b1f9bf.kinxzone.com/webfile/product/9/9755/b1khuy9y3s1k.jpg" />
              }
              title={el?.name}
              subtitle={dummyContent}
              bottomExtra={
                <Flex justify={'space-between'} width={'100%'} align={'flex-end'}>
                  <Text fontSize={'xs'} color={'gray.500'}>
                    {`${
                      canRent
                        ? `대여 가능: ${el?.availableQuantity} / ${el?.totalQuantity}개`
                        : '예약 가능: 예약 대기열로 수정 필요'
                    }`}
                  </Text>
                  <Button
                    ml="auto"
                    size="sm"
                    label={'대여하기'}
                    onClick={() => {
                      // if (canRent) {
                      // handleOpenItemModal(el);
                      // }
                      if (canBook) {
                        handleOpenBookModal(el);
                      }
                    }}
                    // disabled={!canRent || !canBook}
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
