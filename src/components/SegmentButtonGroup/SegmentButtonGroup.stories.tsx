import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Stack, Text } from '@chakra-ui/react';
import {
  SegmentButtonGroup,
  type SegmentOption,
  type SegmentButtonGroupProps,
} from './SegmentButtonGroup';
import { useState } from 'react';

const meta = {
  title: 'Components/SegmentButtonGroup',
  component: SegmentButtonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '여러 옵션 중 하나를 선택할 수 있는 세그먼트 버튼 그룹 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box p={4}>
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '컴포넌트 크기',
    },
    colorPalette: {
      control: { type: 'select' },
      options: ['gray', 'blue', 'green', 'purple', 'red'],
      description: '색상 테마',
    },
    isFullWidth: {
      control: 'boolean',
      description: '전체 너비 사용 여부',
    },
    isDisabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof SegmentButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 옵션들
const basicOptions: SegmentOption[] = [
  { value: 'all', label: '전체' },
  { value: 'school', label: '학교' },
  { value: 'middle', label: '총학' },
  { value: 'subject', label: '학과' },
];

const categoryOptions: SegmentOption[] = [
  { value: 'recent', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'rating', label: '평점순' },
];

const statusOptions: SegmentOption[] = [
  { value: 'pending', label: '대기중' },
  { value: 'approved', label: '승인됨' },
  { value: 'rejected', label: '거절됨' },
  { value: 'completed', label: '완료됨' },
];

const InteractiveTemplate = (args: SegmentButtonGroupProps) => {
  const [selectedValue, setSelectedValue] = useState(args.value || args.options[0].value);

  return (
    <Stack gap={4}>
      <SegmentButtonGroup {...args} value={selectedValue} onChange={setSelectedValue} />
      <Text fontSize="sm" color="gray.600">
        선택된 값: <strong>{selectedValue}</strong>
      </Text>
    </Stack>
  );
};

// 기본 스토리
export const Default: Story = {
  render: InteractiveTemplate,
  args: {
    options: basicOptions,
    value: 'all',
  },
};

// 다양한 크기
export const SmallSize: Story = {
  render: InteractiveTemplate,

  args: {
    options: basicOptions,
    value: 'all',
    size: 'sm',
  },
};

export const MediumSize: Story = {
  render: InteractiveTemplate,
  args: {
    options: basicOptions,
    value: 'school',
    size: 'md',
  },
};

export const LargeSize: Story = {
  render: InteractiveTemplate,
  args: {
    options: basicOptions,
    value: 'middle',
    size: 'lg',
  },
};

// 다양한 색상
export const BlueColor: Story = {
  render: InteractiveTemplate,
  args: {
    options: categoryOptions,
    value: 'popular',
    colorPalette: 'blue',
  },
};

// 전체 너비
export const FullWidth: Story = {
  render: InteractiveTemplate,
  args: {
    options: basicOptions,
    value: 'all',
    isFullWidth: true,
  },
  decorators: [
    (Story) => (
      <Box w="400px" p={4}>
        <Story />
      </Box>
    ),
  ],
};

// 비활성화 상태
export const Disabled: Story = {
  render: InteractiveTemplate,
  args: {
    options: statusOptions,
    value: 'pending',
    isDisabled: true,
  },
};

export const PartiallyDisabled: Story = {
  render: InteractiveTemplate,
  args: {
    options: [
      { value: 'pending', label: '대기중' },
      { value: 'approved', label: '승인됨', disabled: true },
      { value: 'rejected', label: '거절됨' },
      { value: 'completed', label: '완료됨', disabled: true },
    ],
    value: 'pending',
  },
};
