import type { Preview } from '@storybook/react';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '../src/theme/system';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ChakraProvider value={system}>
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default preview;
