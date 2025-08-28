import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { label: '승인하기' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'caption', 'text'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    // isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const 기본: Story = {};

export const 캡션: Story = {
  args: { variant: 'caption', label: '계좌 재등록' },
};

export const 텍스트: Story = {
  args: { variant: 'text', label: '최신순 ^' },
};

export const 로딩상태: Story = {
  args: { loading: true },
  //   args: { isLoading: true },
};
