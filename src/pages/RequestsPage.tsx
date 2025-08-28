// src/pages/RequestsPage.tsx
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  Badge,
  Input,
  Textarea,
  Field,
  Spinner,
  Alert,
  Separator,
  // Dialog, CloseButton, useDisclosure  // ❌ 제거
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { useModalStore } from '@/stores/modalStore'; // ✅ 전역 모달 스토어

// 타입 정의
interface RequestData {
  id: string;
  title: string;
  start: string;
  end: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface FormData {
  title: string;
  start: string;
  end: string;
  reason: string;
}

// 상태별 배지 색상과 텍스트
const statusConfig = {
  pending: { color: 'yellow', text: '검토중' },
  approved: { color: 'green', text: '승인됨' },
  rejected: { color: 'red', text: '반려됨' },
};

/** 모달 바디로 들어갈 폼 (로컬 컴포넌트) */
function NewRequestForm({ id, onSubmit }: { id: string; onSubmit: (data: FormData) => void }) {
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [formData, setFormData] = useState<FormData>({
    title: '',
    start: '',
    end: '',
    reason: '',
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }
    if (!formData.start) {
      newErrors.start = '시작일을 선택해주세요';
    }
    if (!formData.end) {
      newErrors.end = '종료일을 선택해주세요';
    }
    if (formData.start && formData.end && formData.start > formData.end) {
      newErrors.end = '종료일은 시작일보다 늦어야 합니다';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = '사유를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      <VStack align="stretch" gap={4}>
        <Field.Root invalid={!!errors.title}>
          <Field.Label>제목</Field.Label>
          <Input
            name="title"
            placeholder="예) 노트북 대여 신청합니다"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
          {errors.title && <Field.ErrorText>{errors.title}</Field.ErrorText>}
        </Field.Root>

        <HStack gap={3}>
          <Field.Root invalid={!!errors.start}>
            <Field.Label>시작일</Field.Label>
            <Input
              type="date"
              name="start"
              value={formData.start}
              onChange={(e) => handleInputChange('start', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.start && <Field.ErrorText>{errors.start}</Field.ErrorText>}
          </Field.Root>
          <Field.Root invalid={!!errors.end}>
            <Field.Label>종료일</Field.Label>
            <Input
              type="date"
              name="end"
              value={formData.end}
              onChange={(e) => handleInputChange('end', e.target.value)}
              min={formData.start || new Date().toISOString().split('T')[0]}
            />
            {errors.end && <Field.ErrorText>{errors.end}</Field.ErrorText>}
          </Field.Root>
        </HStack>

        <Field.Root invalid={!!errors.reason}>
          <Field.Label>사유</Field.Label>
          <Textarea
            name="reason"
            rows={4}
            placeholder="필요 사유를 간단히 적어주세요."
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
          />
          {errors.reason && <Field.ErrorText>{errors.reason}</Field.ErrorText>}
        </Field.Root>
      </VStack>
    </form>
  );
}

export default function RequestsPage() {
  const { openModal, closeModal } = useModalStore(); // ✅ 올바른 메서드명 사용
  const formId = 'new-request-form';

  const [requests, setRequests] = useState<RequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 초기 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    const mockData: RequestData[] = [
      {
        id: '1',
        title: '노트북 대여 신청합니다',
        start: '2024-01-15',
        end: '2024-01-20',
        reason: '학습 목적으로 노트북이 필요합니다.',
        status: 'approved',
        createdAt: '2024-01-10',
      },
      {
        id: '2',
        title: '프로젝터 대여 신청',
        start: '2024-01-18',
        end: '2024-01-19',
        reason: '발표 준비를 위해 프로젝터가 필요합니다.',
        status: 'pending',
        createdAt: '2024-01-12',
      },
      {
        id: '3',
        title: '카메라 대여 신청',
        start: '2024-01-22',
        end: '2024-01-25',
        reason: '동아리 활동을 위해 카메라가 필요합니다.',
        status: 'rejected',
        createdAt: '2024-01-14',
      },
    ];

    setTimeout(() => {
      setRequests(mockData);
      setIsLoading(false);
    }, 500);
  }, []);

  /** ✅ "새 글 작성" 클릭 시 전역 모달로 폼 띄우기 */
  const handleNewClick = useCallback(() => {
    openModal({
      title: '신청 글 작성',
      caption: '대여 기간과 사유를 입력해 주세요.',
      body: <NewRequestForm id={formId} onSubmit={handleSubmit} />,
      footer: (
        <HStack gap={2} w="full" justify="center">
          <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
            취소
          </Button>
          <Button
            type="submit"
            form={formId}
            colorScheme="green"
            loading={isSubmitting}
            loadingText="등록 중..."
          >
            등록
          </Button>
        </HStack>
      ),
    });
  }, [closeModal, isSubmitting]);

  /** 폼 제출 */
  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // TODO: API 호출
      const newRequest: RequestData = {
        id: Date.now().toString(),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setRequests((prev) => [newRequest, ...prev]);
      closeModal(); // ✅ 올바른 메서드명 사용

      console.log('신청이 완료되었습니다', data);
      alert('신청이 완료되었습니다!');
    } catch (error) {
      console.error('오류가 발생했습니다', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Box p={6} display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack gap={4}>
          <Spinner size="lg" color="green.500" />
          <Text color="gray.500">요청 목록을 불러오는 중...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack gap={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="lg" color="green.600">
            📝 신청해요 게시판
          </Heading>
          <Button colorScheme="green" size="sm" onClick={handleNewClick}>
            새 글 작성
          </Button>
        </HStack>

        {requests.length === 0 ? (
          <Alert.Root status="info" rounded="md">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>알림</Alert.Title>
              <Alert.Description>
                아직 등록된 신청이 없습니다. 첫 번째 신청을 작성해보세요!
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : (
          <VStack gap={4} align="stretch">
            {requests.map((request) => (
              <Box
                key={request.id}
                p={4}
                border="1px solid"
                borderColor="gray.200"
                rounded="lg"
                _hover={{
                  borderColor: 'green.300',
                  boxShadow: 'md',
                  transform: 'translateY(-1px)',
                  cursor: 'pointer',
                }}
                transition="all 0.2s"
                onClick={() =>
                  // openFullscreen({ // This line was removed as per the edit hint
                  //   title: request.title,
                  //   caption: `신청일: ${formatDate(request.createdAt)}\n기간: ${formatDate(
                  //     request.start,
                  //   )} ~ ${formatDate(request.end)}`,
                  //   body: (
                  //     <VStack align="stretch" gap={3}>
                  //       <HStack justify="space-between">
                  //         <Badge colorScheme={statusConfig[request.status].color}>
                  //           {statusConfig[request.status].text}
                  //         </Badge>
                  //         <Text fontSize="sm" color="gray.500">
                  //           #{request.id}
                  //         </Text>
                  //       </HStack>
                  //       <Text whiteSpace="pre-wrap" color="gray.700">
                  //         {request.reason}
                  //       </Text>
                  //     </VStack>
                  //   ),
                  //   footer: (
                  //     <HStack gap={2}>
                  //       <Button variant="ghost" onClick={close}>
                  //         닫기
                  //       </Button>
                  //       {/* 여기에 승인/반려 같은 액션 버튼도 추가 가능 */}
                  //     </HStack>
                  //   ),
                  console.log('Request clicked:', request.id)
                }
              >
                <HStack justify="space-between" mb={3}>
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {request.title}
                  </Text>
                  <Badge colorScheme={statusConfig[request.status].color} size="sm">
                    {statusConfig[request.status].text}
                  </Badge>
                </HStack>

                <HStack mb={2} fontSize="sm" color="gray.600">
                  <Text>
                    📅 {formatDate(request.start)} ~ {formatDate(request.end)}
                  </Text>
                  <Text>•</Text>
                  <Text>📝 {formatDate(request.createdAt)}</Text>
                </HStack>

                <Text
                  fontSize="sm"
                  color="gray.500"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {request.reason}
                </Text>
              </Box>
            ))}
          </VStack>
        )}

        <Separator />

        <Button asChild variant="ghost" size="sm" alignSelf="center">
          <Link to="/main">← 메인으로 돌아가기</Link>
        </Button>
      </VStack>

      {/* ✅ 페이지 내부 Dialog 전부 제거됨. 전역 Modal이 AppLayout에서 렌더링됨 */}
    </Box>
  );
}
