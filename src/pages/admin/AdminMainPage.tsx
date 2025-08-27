import { Box, Text, VStack, Flex, Image } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { useState } from 'react';
import { Card } from '@/components/Card';
import { useModalStore } from '@/stores/modalStore';
import { Tag } from '@/components/Tag';
import { Button } from '@/components/Button';
import AprovalDetailModalContent from './components/AprovalDetailModalContent';

export default function RentPage() {
  const response = {
    content: [
      {
        id: 1,
        universityId: 1,
        organizationId: 2,
        name: '사진',
        submitter: '길태은(1335841)',
        submissionNumber: '250821',
        category: '3번 충전기',
        status: 'pending',
        overdueDays: 7,
        coverKey: 'univ/1/items/1/units/501.jpg',
      },
      {
        id: 2,
        universityId: 1,
        organizationId: 2,
        name: '사진',
        submitter: '신승용(1335874)',
        submissionNumber: '250820',
        category: '4번 충전기',
        status: 'pending',
        overdueDays: null,
        coverKey: 'univ/1/items/1/units/502.jpg',
      },
      {
        id: 3,
        universityId: 1,
        organizationId: 2,
        name: '사진',
        submitter: '안수진(13322058)',
        submissionNumber: '250818',
        category: '5번 충전기',
        status: 'pending',
        overdueDays: null,
        coverKey: 'univ/1/items/1/units/503.jpg',
      },
      {
        id: 4,
        universityId: 1,
        organizationId: 2,
        name: '사진',
        submitter: '이지혜(13302156)',
        submissionNumber: '250818',
        category: '6번 충전기',
        status: 'pending',
        overdueDays: null,
        coverKey: 'univ/1/items/1/units/504.jpg',
      },
    ],
    page: 0,
    size: 20,
    totalElements: 4,
  };

  const { openModal, closeModal } = useModalStore();

  const [data, setData] = useState(response.content);

  // 풀스크린 모달을 여는 함수
  const handleOpenItemModal = (item: any) => {
    openModal({
      title: `${item.category} 반납 승인`,
      caption: '반납 상태를 확인하고 승인 처리해주세요',
      body: <AprovalDetailModalContent itemId={item.id} />,
      footer: (
        <Flex gap={2} w="full">
          <Button flex={1} label={'취소'} onClick={() => closeModal()}></Button>
          <Button
            label={'승인하기'}
            flex={1}
            colorScheme="green"
            onClick={() => {
              // 승인 처리 로직
              console.log('승인 처리:', item.id);
              closeModal();
            }}
          ></Button>
        </Flex>
      ),
      fullscreen: true, // 풀스크린 모드 활성화
    });
  };

  const handleInfo = (id: number) => {
    console.log('확인:', id);
    // 해당 아이템 찾기
    const item = data.find((el) => el.id === id);
    if (item) {
      handleOpenItemModal(item);
    }
  };

  return (
    <Box px={10}>
      <PageHeader
        px={0}
        py={10}
        bgColor={'transparent'}
        title={'승인 대기 중'}
        subtitle={'사용자가 반납 완료 후 관리자 승인 대기 목록입니다.'}
      />

      <Flex justify={'flex-end'} mt={2}>
        <Button label={'최신순 ^'} variant={'text'} size={'sm'}></Button>
      </Flex>

      <VStack gap={2} align="stretch" mt={2}>
        {data.map((el) => (
          <Card
            key={el.id}
            image={
              <Image src="https://1801889e95b1f9bf.kinxzone.com/webfile/product/9/9755/b1khuy9y3s1k.jpg" />
            }
            title={el.category}
            subtitle={`대여한 사람 : ${el.submitter}`}
            extra={el.overdueDays && <Tag label={`연체(${el.overdueDays}일)`} variant="error" />}
            bottomExtra={
              <Flex justify={'space-between'} width={'100%'} align={'flex-end'}>
                <Text fontSize={'sm'} color={'gray.500'}>
                  반납일: {el.submissionNumber}
                </Text>
                <Flex>
                  <Button
                    size="sm"
                    label={'확인하기'}
                    colorScheme="green"
                    onClick={() => handleInfo(el.id)}
                  />
                </Flex>
              </Flex>
            }
          />
        ))}
      </VStack>
    </Box>
  );
}
