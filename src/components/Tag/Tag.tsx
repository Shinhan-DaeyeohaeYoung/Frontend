import * as React from 'react';
import { Tag as ChakraTag } from '@chakra-ui/react';

export type AppTagVariant = 'default' | 'error';

export interface AppTagProps {
  label: string;
  variant?: AppTagVariant;
}

export const Tag: React.FC<AppTagProps> = ({ label, variant = 'default' }) => {
  const styles =
    variant === 'error'
      ? { color: 'red.600', borderColor: 'red.600', bg: 'white', colorPalette: 'red' }
      : { color: 'gray.800', borderColor: 'gray.300', bg: 'white', colorPalette: 'gray' };

  return (
    <ChakraTag.Root size="md" borderRadius="md" px={3} py={1} variant="outline" {...styles}>
      <ChakraTag.Label>{label}</ChakraTag.Label>
    </ChakraTag.Root>
  );
};

export default Tag;
