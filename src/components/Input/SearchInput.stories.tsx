import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/Input/SearchInput',
  component: SearchInput,
  args: {
    placeholder: '물품명을 입력해주세요',
    buttonText: '검색하기',
    value: '',
  },
  argTypes: {
    placeholder: { control: 'text' },
    buttonText: { control: 'text' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'filled', 'flushed', 'unstyled'] },
    isInvalid: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isRequired: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          '검색 입력창과 검색 버튼이 결합된 컴포넌트입니다. Enter 키로도 검색할 수 있습니다.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

export const 기본: Story = {};

export const 커스텀플레이스홀더: Story = {
  args: {
    placeholder: '검색어를 입력하세요',
  },
};

export const 커스텀버튼텍스트: Story = {
  args: {
    buttonText: '찾기',
  },
};

export const 비활성화: Story = {
  args: {
    disabled: true,
  },
};

export const 값이있는상태: Story = {
  args: {
    value: '노트북',
  },
};

export const 오류상태: Story = {
  args: {
    isInvalid: true,
    value: '잘못된 입력',
  },
};

export const 읽기전용: Story = {
  args: {
    isReadOnly: true,
    value: '수정할 수 없는 값',
  },
};

export const 필수입력: Story = {
  args: {
    isRequired: true,
    placeholder: '필수 입력 항목입니다',
  },
};

export const 작은크기: Story = {
  args: {
    size: 'sm',
  },
};

export const 큰크기: Story = {
  args: {
    size: 'lg',
  },
};
