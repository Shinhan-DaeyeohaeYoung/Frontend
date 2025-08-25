import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@chakra-ui/react';
import { PageHeader } from './PageHeader';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '페이지 상단의 헤더 섹션을 표시하는 컴포넌트입니다. 제목과 선택적 부제목을 포함할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box w="100%" minH="200px">
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: '메인 헤더 제목',
    },
    subtitle: {
      control: 'text',
      description: '서브 설명 텍스트 (선택사항)',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: '헤더 정렬 방식',
    },
    bgColor: {
      control: 'color',
      description: '커스텀 배경색',
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리 (제목만)
export const Default: Story = {
  args: {
    title: '반납해요',
  },
};

// 부제목이 있는 버전
export const WithSubtitle: Story = {
  args: {
    title: '반납해요',
    subtitle: '반납하실 물품을 선택해주세요',
  },
};

// 긴 부제목
export const WithLongSubtitle: Story = {
  args: {
    title: '계좌 관리',
    subtitle:
      '연결된 계좌의 잔액을 확인하고 거래 내역을 조회할 수 있습니다. 새로운 계좌를 추가하거나 기존 계좌를 관리해보세요.',
  },
};

// 중앙 정렬
export const CenterAligned: Story = {
  args: {
    title: '서비스 소개',
    subtitle: '우리의 혁신적인 서비스를 소개합니다',
    align: 'center',
  },
};

// 커스텀 배경색
export const CustomBackground: Story = {
  args: {
    title: '프로모션',
    subtitle: '특별한 혜택을 만나보세요',
    bgColor: 'blue.50',
    align: 'center',
  },
};

// 최소한의 패딩
export const Compact: Story = {
  args: {
    title: '간단한 제목',
    subtitle: '짧은 설명',
    py: 4,
    px: 4,
  },
};

// 넓은 패딩
export const Spacious: Story = {
  args: {
    title: '넓은 헤더',
    subtitle: '여유로운 공간의 헤더 디자인입니다',
    py: 12,
    px: 8,
  },
};
