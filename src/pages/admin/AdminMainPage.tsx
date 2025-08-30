import { Box, Text, VStack, Flex, Image } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { useModalStore } from '@/stores/modalStore';
import { Tag } from '@/components/Tag';
import { Button } from '@/components/Button';
import { getRequest } from '@/api/requests';
import { useAuthStore } from '@/stores/authStore';
import AprovalDetailModalContent from './components/AprovalDetailModalContent';

// 반납 신청 타입 정의
interface ReturnRequest {
  id: number;
  universityId: number;
  organizationId: number;
  rentalId: number;
  userId: number;
  status: string;
  submittedImageKey: string;
  submittedImageUrl: string;
  requestedAt: string;
  isActive: boolean;
}

// API 응답 타입
interface ReturnRequestResponse {
  content: ReturnRequest[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export default function AdminMainPage() {
  const { openModal } = useModalStore();
  const { user } = useAuthStore();
  const { admin, organizationInfo } = user ?? {};

  // admin 값에 따라 해당 조직의 ID 가져오기
  const organizationId =
    admin && organizationInfo
      ? (organizationInfo as Record<string, { id: number }>)[admin]?.id
      : null;

  const [data, setData] = useState<ReturnRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 반납 신청 목록 가져오기
  const fetchReturnRequests = async () => {
    if (!organizationId) {
      console.warn('조직 ID가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // API 호출
      const response = await getRequest<ReturnRequestResponse>(
        `/admin/return-requests?status=REQUESTED&page=0&size=20&organizationId=${organizationId}`
      );

      if (response && response.content) {
        setData(response.content);
        console.log('반납 신청 목록:', response.content);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('반납 신청 목록 가져오기 실패:', error);
      setError('데이터를 가져오는 중 오류가 발생했습니다.');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchReturnRequests();
  }, []);

  // 풀스크린 모달을 여는 함수
  const handleOpenItemModal = (item: ReturnRequest) => {
    openModal({
      title: `반납 신청 승인`,
      caption: '반납 상태를 확인하고 승인 처리해주세요',
      body: <AprovalDetailModalContent returnRequestId={item.id} />, // item.id는 반납 요청 ID
      footer: '',
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

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <Box>
        <PageHeader
          bgColor={'transparent'}
          title={'승인 대기 중'}
          subtitle={'사용자가 반납 완료 후 관리자 승인 대기 목록입니다.'}
        />
        <Box textAlign="center" py={20}>
          <Text>데이터를 불러오는 중...</Text>
        </Box>
      </Box>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <Box>
        <PageHeader
          bgColor={'transparent'}
          title={'승인 대기 중'}
          subtitle={'사용자가 반납 완료 후 관리자 승인 대기 목록입니다.'}
        />
        <Box textAlign="center" py={20}>
          <Text color="red.500">{error}</Text>
          <Button mt={4} onClick={fetchReturnRequests} label="다시 시도" />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={'승인 대기 중'}
        subtitle={'사용자가 반납 완료 후 관리자 승인 대기 목록입니다.'}
      />

      <Flex justify={'space-between'} px={4} mt={2}>
        <Text fontSize="sm" color="gray.500">
          총 {data.length}개의 반납 신청
        </Text>
      </Flex>

      {data.length === 0 ? (
        <Box textAlign="center" py={20}>
          <Text color="gray.500">승인 대기 중인 반납 신청이 없습니다.</Text>
        </Box>
      ) : (
        <VStack gap={2} align="stretch" mt={2}>
          {data.map((el) => (
            <Card
              key={el.id}
              image={
                <Image
                  src={
                    el.submittedImageUrl || 'https://via.placeholder.com/300x200?text=이미지+없음'
                  }
                  alt="반납 이미지"
                />
              }
              title={`반납 신청 #${el.id}`}
              subtitle={`대여 ID: ${el.rentalId} | 사용자 ID: ${el.userId}`}
              extra={<Tag label={el.status} variant="default" />}
              bottomExtra={
                <Flex justify={'space-between'} width={'100%'} align={'flex-end'}>
                  <Text fontSize={'sm'} color={'gray.500'}>
                    신청일: {new Date(el.requestedAt).toLocaleDateString('ko-KR')}
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
      )}
    </Box>
  );
}
