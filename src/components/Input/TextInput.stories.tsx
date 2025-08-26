import type { Meta, StoryObj } from '@storybook/react-vite';
import TextInput from './TextInput';
import React, { useState } from 'react';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof TextInput>;

/**
 * Storybook Controls에서 value prop을 조절하면
 * onChange가 정상 동작하지 않으므로, 필요한 경우에는
 * 아래처럼 StateWrapper를 추가하여 구현할 수도 있습니다.
 */
const StateWrapper = (
  props: Omit<React.ComponentProps<typeof TextInput>, 'value' | 'onChange'>
) => {
  const [value, setValue] = useState('');
  return <TextInput {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
};

export const Default: Story = {
  args: {
    value: '',
    placeholder: '내용을 입력하세요',
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    value: '입력값 예시',
    placeholder: '내용을 입력하세요',
    onChange: () => {},
  },
};

export const Playground: Story = {
  render: (args) => <StateWrapper {...args} />,
  args: {
    placeholder: '직접 입력해보세요',
  },
};
