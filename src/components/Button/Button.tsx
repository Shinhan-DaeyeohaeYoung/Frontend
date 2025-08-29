import * as React from 'react';
import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

export type AppButtonVariant = 'default' | 'caption' | 'text';

export interface AppButtonProps extends Omit<ChakraButtonProps, 'variant' | 'size'> {
  label: string;
  variant?: AppButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<AppButtonProps> = ({
  label,
  variant = 'default',
  size = 'lg',
  children,
  ...rest
}) => {
  if (variant === 'caption') {
    return (
      <ChakraButton
        size="sm"
        variant="solid"
        fontSize="sm"
        px={3}
        py={1}
        borderColor="gray.300"
        colorPalette="accent"
        _hover={{ bg: 'gray.100' }}
        {...rest}
      >
        {label} {children}
      </ChakraButton>
    );
  }

  if (variant === 'text') {
    return (
      <ChakraButton
        variant="ghost" // 배경 없음
        size="sm"
        fontSize="sm"
        colorPalette="accent" // hover 색상용
        color="gray.600"
        _hover={{ bg: 'gray.200' }}
        {...rest}
      >
        {label} {children}
      </ChakraButton>
    );
  }

  // default
  return (
    <ChakraButton
      size={size}
      variant="solid"
      // borderColor="gray.400"
      backgroundColor="accent.500"
      _hover={{ bg: 'gray.100' }}
      {...rest}
    >
      {label} {children}
    </ChakraButton>
  );
};

export default Button;
