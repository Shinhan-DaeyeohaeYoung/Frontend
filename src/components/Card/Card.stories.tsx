// src/components/Card/Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { Card } from './Card';

const PlaceholderImage = ({ label = 'Image' }: { label?: string }) => (
  <Box w="80px" h="80px" bg="gray.100" display="flex" alignItems="center" justifyContent="center">
    <Text color="gray.500" fontSize="sm">
      {label}
    </Text>
  </Box>
);

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  args: {
    image: <PlaceholderImage />,
    title: 'Card Title',
    subtitle: 'Subtitle text goes here.',
    extra: undefined,
  },
  argTypes: {
    image: { control: false },
    extra: { control: false },
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const WithExtraActions: Story = {
  args: {
    extra: (
      <HStack>
        <Button size="xs" variant="outline">
          Edit
        </Button>
        <Button size="xs" colorScheme="blue">
          View
        </Button>
      </HStack>
    ),
  },
};

export const LongTitleAndSubtitle: Story = {
  args: {
    title: 'A very long card title — showing how it looks when overflowing',
    subtitle:
      'This is a long subtitle. It can span multiple lines to test how the layout behaves in case of lengthy content.',
  },
};

export const CustomImage: Story = {
  args: {
    image: <PlaceholderImage label="Thumbnail" />,
  },
};

export const NoTitleOrSubtitle: Story = {
  args: {
    title: undefined,
    subtitle: undefined,
  },
};
