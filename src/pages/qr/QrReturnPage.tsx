import { Box, Text, VStack, Flex, Image } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { SegmentButtonGroup, type SegmentOption } from '@/components/SegmentButtonGroup';
import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { SearchInput } from '@/components/Input';
import { useModalStore } from '@/stores/modalStore';
import { Button } from '@/components/Button';
import { getRequest, postRequest } from '@/api/requests';
import { useNavigate } from 'react-router-dom';
import { ReturnModal } from './components/ReturnModal';

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
    const universityId = 1;
    const organizationId = 1;

    openModal({
      body: (
        <ReturnModal
          item={item}
          userId={userId}
          universityId={universityId}
          organizationId={organizationId}
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
    // [todo] api 수정GET/api/rental-requests/{organizationId}/holding
    // 내 홀딩 예약 중 특정 조직의 것만
    const organizationId = 2; // [todo]: parameter로 수정
    const res = await getRequest<ApiResponse<Item>>(
      `http://43.200.61.108:8082/api/rental-requests/${organizationId}/holding`
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
        organizationId: 0,
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
      //   const handleOpenBookModal = (item: Item) => {
      //     openModal({
      //       title: '물품을 예약할까요?',
      //       caption: '물품을 대여할 수 있게 되면 자동으로 홀딩됩니다!',
      //       footer: (
      //         <Button
      //           w="full"
      //           onClick={() => {
      //             handleBook(item.id);
      //           }}
      //           label="예약하기"
      //         ></Button>
      //       ),
      //     });
      //   };
    } else {
      // [todo] 한 개일 때 분기처리
    }
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
        title={'반납하기'}
        subtitle={'사무실에서 대여한 물품 중 반납하려는 물품을 선택해주세요!'}
      ></PageHeader>

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
