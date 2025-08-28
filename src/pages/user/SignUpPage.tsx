// src\pages\user\SignUpPage.tsx
import { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Fieldset,
  Input,
  Stack,
  Text,
  Steps,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react';

type Form = {
  schoolId: string | null;
  email: string;
  password: string;
  agreeRequired: boolean;
  agreeOptional: boolean;
};

const INITIAL: Form = {
  schoolId: null,
  email: '',
  password: '',
  agreeRequired: false,
  agreeOptional: false,
};

const SCHOOLS = [
  { id: '1', name: 'SSAFY 서울' },
  { id: '2', name: 'SSAFY 대전' },
  { id: '3', name: 'SSAFY 광주' },
];

// Select용 collection
const schoolCollection = createListCollection({
  items: SCHOOLS,
  itemToString: (s) => s.name,
  itemToValue: (s) => s.id,
});

export default function SignupFlow() {
  const [step, setStep] = useState(0); // 0-based
  const [form, setForm] = useState<Form>(INITIAL);
  const lastStep = 4;

  const canNext = validate(step, form);
  const goNext = () => setStep((s) => Math.min(lastStep, s + 1));
  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <Box w="full" maxW="520px" mx="auto" p="4">
      <Steps.Root step={step} onStepChange={(e) => setStep(e.step)} count={lastStep} linear>
        <Steps.List mb="6" display="none">
          <Steps.Item index={0} title="학교 선택">
            <Steps.Indicator />
            <Steps.Title>학교 선택</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={1} title="계정 정보">
            <Steps.Indicator />
            <Steps.Title>계정 정보</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={2} title="약관 동의">
            <Steps.Indicator />
            <Steps.Title>약관 동의</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={3} title="완료">
            <Steps.Indicator />
            <Steps.Title>완료</Steps.Title>
          </Steps.Item>
        </Steps.List>
        {/* Step 1: 학교 선택 */}
        <Steps.Content index={0}>
          <Fieldset.Root size="sm">
            <Fieldset.Legend mb="2">학교 선택</Fieldset.Legend>
            <Select.Root
              collection={schoolCollection}
              size="sm"
              value={form.schoolId ? [form.schoolId] : []}
              onValueChange={({ value }) => setForm({ ...form, schoolId: value[0] ?? null })}
              positioning={{ sameWidth: true }}
            >
              <Select.HiddenSelect name="schoolId" />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="학교를 선택하세요" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {schoolCollection.items.map((item) => (
                      <Select.Item item={item} key={item.id}>
                        {item.name}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Fieldset.Root>
        </Steps.Content>
        {/* Step 2: 계정 정보 */}
        <Steps.Content index={1}>
          <Stack gap="3">
            <Fieldset.Root size="sm">
              <Fieldset.Legend mb="2">계정 정보</Fieldset.Legend>
              <Input
                placeholder="이메일"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                placeholder="비밀번호"
                type="password"
                mt="2"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Fieldset.Root>
          </Stack>
        </Steps.Content>
        {/* Step 3: 약관 동의 */}
        <Steps.Content index={2}>
          <Stack gap="3">
            <Text fontWeight="medium">약관 동의</Text>

            {/* 필수 동의 */}
            <Checkbox.Root
              checked={form.agreeRequired}
              onCheckedChange={(e) => setForm({ ...form, agreeRequired: !!e.checked })}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>(필수) 서비스 이용약관, 개인정보 처리방침 동의</Checkbox.Label>
            </Checkbox.Root>

            {/* 선택 동의 */}
            <Checkbox.Root
              checked={form.agreeOptional}
              onCheckedChange={(e) => setForm({ ...form, agreeOptional: !!e.checked })}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>(선택) 마케팅 정보 수신 동의</Checkbox.Label>
            </Checkbox.Root>
          </Stack>
        </Steps.Content>
        {/* Step 4: 완료 */}
        <Steps.Content index={3}>
          <Box textAlign="center" py="10">
            <Text fontSize="xl" fontWeight="bold" mb="2">
              회원가입이 완료되었습니다 🎉
            </Text>
            <Text color="gray.600">이제 서비스를 시작해보세요.</Text>
          </Box>
        </Steps.Content>
        <Steps.CompletedContent /> {/* not used but required structurally */}
        <ButtonGroup mt="6" w="full" justifyContent="space-between" variant="outline" size="sm">
          <Steps.PrevTrigger asChild>
            <Button onClick={goPrev} disabled={step === 1}>
              이전
            </Button>
          </Steps.PrevTrigger>
          {step < lastStep ? (
            <Steps.NextTrigger asChild>
              <Button onClick={goNext} disabled={!canNext} variant="solid" colorPalette="purple">
                다음
              </Button>
            </Steps.NextTrigger>
          ) : (
            <Button
              variant="solid"
              colorPalette="purple"
              w="24"
              onClick={() => console.log('Submit form', form)}
            >
              시작하기
            </Button>
          )}
        </ButtonGroup>
      </Steps.Root>
    </Box>
  );
}

function validate(step: number, f: Form) {
  if (step === 1) return !!f.schoolId;
  if (step === 2) return f.email.includes('@') && f.password.length >= 8;
  if (step === 3) return f.agreeRequired; // 필수 약관 체크 필수
  return true;
}
