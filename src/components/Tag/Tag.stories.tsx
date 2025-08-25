import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  args: { label: '반납 완료' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'error'] },
  },
};
export default meta;

type Story = StoryObj<typeof Tag>;

export const 기본: Story = {};

export const 에러: Story = {
  args: { label: '연체(7일)', variant: 'error' },
};
