import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@chakra-ui/react';
import { AccountHistory, type AccountTransaction } from './AccountHistory';

const meta = {
  title: 'Components/AccountHistory',
  component: AccountHistory,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '계좌 거래 내역을 표시하는 컴포넌트입니다. 입금/출금 내역과 잔액을 보여줍니다.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box maxW="500px" w="100%" p={4}>
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    sectionLabel: {
      control: 'text',
      description: '섹션 라벨 (선택사항)',
    },
    showDividers: {
      control: 'boolean',
      description: '항목 사이 구분선 표시 여부',
    },
    onItemClick: {
      action: 'clicked',
      description: '아이템 클릭 핸들러',
    },
  },
} satisfies Meta<typeof AccountHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 데이터
const sampleTransactions: AccountTransaction[] = [
  {
    id: '1',
    date: '2025-08-25',
    title: '급여 입금',
    amount: 3500000,
    balance: 5200000,
  },
  {
    id: '2',
    date: '2025-08-24',
    title: '카페 결제',
    amount: -4500,
    balance: 1700000,
  },
  {
    id: '3',
    date: '2025-08-23',
    title: '온라인 쇼핑',
    amount: -89000,
    balance: 1704500,
  },
  {
    id: '4',
    date: '2025-08-22',
    title: '적금 입금',
    amount: 500000,
    balance: 1793500,
  },
  {
    id: '5',
    date: '08.21',
    title: '편의점 결제',
    amount: -3200,
    balance: 1293500,
  },
];

const longTransactionList: AccountTransaction[] = [
  ...sampleTransactions,
  {
    id: '6',
    date: '2025-08-20',
    title: '부모님 용돈',
    amount: -300000,
    balance: 1296700,
  },
  {
    id: '7',
    date: '2025-08-19',
    title: '주식 배당금',
    amount: 45000,
    balance: 1596700,
  },
  {
    id: '8',
    date: '2025-08-18',
    title: '교통비',
    amount: -12000,
    balance: 1551700,
  },
];

// 기본 스토리
export const Default: Story = {
  args: {
    items: sampleTransactions,
  },
};

// 섹션 라벨이 있는 버전
export const WithSectionLabel: Story = {
  args: {
    sectionLabel: '최근 거래내역',
    items: sampleTransactions,
  },
};

// 구분선이 있는 버전
export const WithDividers: Story = {
  args: {
    sectionLabel: '8월 거래내역',
    items: sampleTransactions,
    showDividers: true,
  },
};

// 빈 상태
export const Empty: Story = {
  args: {
    sectionLabel: '거래내역',
    items: [],
  },
};

// 클릭 가능한 버전
export const Clickable: Story = {
  args: {
    sectionLabel: '클릭 가능한 거래내역',
    items: sampleTransactions,
    onItemClick: (transaction) => {
      alert(
        `선택된 거래: ${transaction.title} (${
          transaction.amount > 0 ? '+' : ''
        }${transaction.amount.toLocaleString()}원)`
      );
    },
  },
};

// 긴 목록
export const LongList: Story = {
  args: {
    sectionLabel: '전체 거래내역',
    items: longTransactionList,
    showDividers: true,
  },
};

// 큰 금액들
export const LargeAmounts: Story = {
  args: {
    sectionLabel: '고액 거래내역',
    items: [
      {
        id: '1',
        date: '2025-08-25',
        title: '부동산 매매 대금',
        amount: 850000000,
        balance: 1200000000,
      },
      {
        id: '2',
        date: '2025-08-24',
        title: '자동차 구매',
        amount: -45000000,
        balance: 350000000,
      },
      {
        id: '3',
        date: '2025-08-23',
        title: '투자금 회수',
        amount: 125000000,
        balance: 395000000,
      },
    ],
  },
};

// 다양한 날짜 형식
export const VariousDateFormats: Story = {
  args: {
    sectionLabel: '다양한 날짜 형식',
    items: [
      {
        id: '1',
        date: '2025-08-25T10:30:00Z',
        title: 'ISO 날짜 형식',
        amount: 50000,
        balance: 1000000,
      },
      {
        id: '2',
        date: '08.24',
        title: '이미 형식된 날짜',
        amount: -15000,
        balance: 950000,
      },
      {
        id: '3',
        date: 'Aug 23, 2025',
        title: '영문 날짜 형식',
        amount: 30000,
        balance: 965000,
      },
      {
        id: '4',
        date: '2025/08/22',
        title: '슬래시 날짜 형식',
        amount: -8000,
        balance: 935000,
      },
    ],
  },
};

// 커스텀 스타일링
export const CustomStyling: Story = {
  args: {
    sectionLabel: '커스텀 스타일',
    items: sampleTransactions.slice(0, 3),
    bg: 'blue.50',
    borderColor: 'blue.200',
    _dark: {
      bg: 'blue.900',
      borderColor: 'blue.700',
    },
  },
};
