import React from 'react';
import {
  Box,
  Button,
  Container,
  VStack,
  Text,
  Input,
  Heading,
  Steps,
  Select,
  Checkbox,
  createListCollection,
} from '@chakra-ui/react';

export default function SignupPage() {
  // ✅ Select용 collection 생성
  const departments = createListCollection({
    items: [
      { label: '컴퓨터공학과', value: 'computer' },
      { label: '경영학과', value: 'business' },
      { label: '디자인학과', value: 'design' },
    ],
  });

  const steps = [
    {
      title: '학교 선택',
      content: (
        <VStack gap={6}>
          <Heading size="lg">학교 선택</Heading>
          <Input placeholder="학교 검색..." />
          <Box
            p={4}
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            cursor="pointer"
            bg="gray.50"
          >
            <Text>베이영대학교</Text>
          </Box>
        </VStack>
      ),
    },
    {
      title: '학과 선택',
      content: (
        <VStack gap={6}>
          <Heading size="lg">학과 선택</Heading>
          <Select.Root collection={departments} size="md" width="full">
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="학과를 선택하세요" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {departments.items.map((dept) => (
                  <Select.Item item={dept} key={dept.value}>
                    {dept.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </VStack>
      ),
    },
    {
      title: '학번 및 비밀번호',
      content: (
        <VStack gap={6}>
          <Heading size="lg">학번 및 비밀번호</Heading>
          <Input placeholder="학번" />
          <Input type="password" placeholder="비밀번호" />
        </VStack>
      ),
    },
    {
      title: '약관 동의',
      content: (
        <VStack gap={6}>
          <Heading size="lg">약관 동의</Heading>
          <Box
            p={4}
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            maxH="200px"
            overflowY="auto"
            bg="gray.50"
          >
            <Text>이용약관 내용...</Text>
          </Box>
          <Checkbox.Root>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>약관에 동의합니다</Checkbox.Label>
          </Checkbox.Root>
        </VStack>
      ),
    },
    {
      title: '완료',
      content: (
        <VStack gap={6}>
          <Heading size="lg">회원가입 완료!</Heading>
          <Text>회원가입이 완료되었습니다.</Text>
        </VStack>
      ),
    },
  ];

  return (
    <Container maxW="md" py={10}>
      <Steps.Root defaultStep={1} count={steps.length}>
        {steps.map((step, index) => (
          <Steps.Content key={index} index={index}>
            {step.content}
          </Steps.Content>
        ))}

        <Steps.CompletedContent>
          <VStack gap={6}>
            <Heading size="lg">🎉 모든 단계가 완료되었습니다!</Heading>
            <Text>회원가입이 성공적으로 완료되었습니다.</Text>
          </VStack>
        </Steps.CompletedContent>

        <VStack gap={4} mt={8}>
          <Steps.PrevTrigger asChild>
            <Button variant="outline" size="lg">
              이전
            </Button>
          </Steps.PrevTrigger>
          <Steps.NextTrigger asChild>
            <Button colorScheme="blue" size="lg">
              다음
            </Button>
          </Steps.NextTrigger>
        </VStack>
      </Steps.Root>
    </Container>
  );
}
