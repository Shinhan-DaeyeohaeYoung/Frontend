import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Checkbox,
  Steps,
  Container,
  Heading,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { postRequest } from '@/api/requests';

export default function SignupPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    university: '',
    department: '',
    studentId: '',
    password: '',
    termsAgreed: false,
  });

  // 학교 목록 컬렉션 (universityId 포함)
  const universities = createListCollection({
    items: [
      { label: '쏠 대학교', value: 'ssol', id: 1 },
      { label: '서울대학교', value: 'seoul', id: 2 },
      { label: '연세대학교', value: 'yonsei', id: 3 },
      { label: '고려대학교', value: 'korea', id: 4 },
    ],
  });

  // 학과 목록 컬렉션
  const departments = createListCollection({
    items: [
      { label: '컴퓨터공학과', value: 'computer' },
      { label: '소프트웨어학과', value: 'software' },
      { label: '인공지능학과', value: 'ai' },
      { label: '데이터사이언스학과', value: 'data' },
    ],
  });

  // 학생 인증 API 호출
  const verifyStudent = async () => {
    const selectedUniversity = universities.items.find((u) => u.value === formData.university);
    if (!selectedUniversity) return false;

    try {
      await postRequest('/students/verify', {
        universityId: selectedUniversity.id,
        studentNo: formData.studentId,
        password: formData.password,
      });

      console.log('학생 인증 성공');
      return true;
    } catch (error) {
      console.error('학생 인증 오류:', error);
      return false;
    }
  };

  // 회원가입 API 호출
  const signupStudent = async () => {
    const selectedUniversity = universities.items.find((u) => u.value === formData.university);
    if (!selectedUniversity) return false;

    try {
      await postRequest('/students/signup', {
        universityId: selectedUniversity.id,
        studentNo: formData.studentId,
        password: formData.password,
      });

      console.log('회원가입 성공');

      // 잠시 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 2000);

      return true;
    } catch (error) {
      console.error('회원가입 오류:', error);
      return false;
    }
  };

  const steps = [
    {
      title: '학교',
      content: (
        <VStack gap={6} w="full">
          <Heading size="md" color="blue.600">
            학교를 선택해주세요
          </Heading>
          <Select.Root
            collection={universities}
            size="lg"
            value={formData.university ? [formData.university] : []}
            onValueChange={(e) => setFormData({ ...formData, university: e.value[0] || '' })}
            w="full"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="학교 선택" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {universities.items.map((university) => (
                    <Select.Item item={university} key={university.value}>
                      {university.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </VStack>
      ),
    },
    {
      title: '학과',
      content: (
        <VStack gap={6} w="full">
          <Heading size="md" color="blue.600">
            학과를 선택해주세요
          </Heading>
          <Select.Root
            collection={departments}
            size="lg"
            value={formData.department ? [formData.department] : []}
            onValueChange={(e) => setFormData({ ...formData, department: e.value[0] || '' })}
            w="full"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="학과 선택" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {departments.items.map((department) => (
                    <Select.Item item={department} key={department.value}>
                      {department.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </VStack>
      ),
    },
    {
      title: '학번',
      content: (
        <VStack gap={6} w="full">
          <Heading size="md" color="blue.600">
            학번과 비밀번호를 입력해주세요
          </Heading>
          <Input
            placeholder="학번"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            size="lg"
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            size="lg"
          />
        </VStack>
      ),
    },
    {
      title: '약관 동의',
      content: (
        <VStack gap={6} w="full">
          <Heading size="md" color="blue.600">
            약관에 동의해주세요
          </Heading>
          <Box
            p={4}
            borderWidth={1}
            borderRadius="md"
            bg="gray.50"
            w="full"
            maxH="200px"
            overflowY="auto"
          >
            <Text fontSize="sm" color="gray.600">
              대여해Young 서비스 이용약관
            </Text>
            <Text fontSize="sm" color="gray.600">
              1. 서비스 이용에 관한 일반사항
            </Text>
            <Text fontSize="sm" color="gray.600">
              2. 개인정보 보호에 관한 사항
            </Text>
            <Text fontSize="sm" color="gray.600">
              3. 책임제한에 관한 사항
            </Text>
            <Text fontSize="sm" color="gray.600">
              4. 기타 필요한 사항
            </Text>
          </Box>
          <Checkbox.Root
            checked={formData.termsAgreed}
            onCheckedChange={(e) => setFormData({ ...formData, termsAgreed: !!e.checked })}
            size="lg"
            w="full"
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>약관에 동의합니다</Checkbox.Label>
          </Checkbox.Root>
        </VStack>
      ),
    },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 약관 동의 단계에서 회원가입 진행
      await handleSignup();
    }
  };

  const handleSignup = async () => {
    if (!formData.termsAgreed) {
      console.warn('약관 동의가 필요합니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 1단계: 학생 인증
      const isVerified = await verifyStudent();
      if (!isVerified) {
        setIsLoading(false);
        return;
      }

      // 2단계: 회원가입
      const isSignupSuccess = await signupStudent();
      if (isSignupSuccess) {
        console.log('회원가입 프로세스 완료');
        return;
      }
    } catch (error) {
      console.error('회원가입 처리 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.university !== '';
      case 1:
        return formData.department !== '';
      case 2:
        return formData.studentId !== '' && formData.password !== '';
      case 3:
        return formData.termsAgreed;
      default:
        return false;
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={8} w="full">
        <Heading size="xl" color="blue.600">
          회원가입
        </Heading>

        <Steps.Root
          step={currentStep}
          onStepChange={(e) => setCurrentStep(e.step)}
          count={steps.length}
          size="lg"
          colorPalette="blue"
        >
          <Steps.List>
            {steps.map((step, index) => (
              <Steps.Item key={index} index={index} title={step.title}>
                <Steps.Indicator />
                <Steps.Title>{step.title}</Steps.Title>
                <Steps.Separator />
              </Steps.Item>
            ))}
          </Steps.List>

          <Box py={8} w="full">
            {steps.map((step, index) => (
              <Steps.Content key={index} index={index}>
                {step.content}
              </Steps.Content>
            ))}
          </Box>

          <HStack gap={4} w="full" justify="center">
            {currentStep > 0 && (
              <Button onClick={handlePrev} variant="outline" size="lg" w="120px">
                이전
              </Button>
            )}
            <Button
              onClick={handleNext}
              colorScheme="blue"
              size="lg"
              w="120px"
              disabled={!canProceed() || isLoading}
              loading={isLoading}
              loadingText={currentStep === steps.length - 1 ? '처리 중...' : '다음'}
            >
              {currentStep === steps.length - 1 ? '회원가입' : '다음'}
            </Button>
          </HStack>
        </Steps.Root>
      </VStack>
    </Container>
  );
}
