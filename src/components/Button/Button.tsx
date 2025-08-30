import * as React from 'react';
import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

export type AppButtonVariant = 'default' | 'caption' | 'text';

export interface AppButtonProps extends Omit<ChakraButtonProps, 'variant' | 'size'> {
  label: string;
  variant?: AppButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  backgroundColor?: string; // backgroundColor prop 추가
}

export const Button: React.FC<AppButtonProps> = ({
  label,
  variant = 'default',
  size = 'lg',
  backgroundColor, // backgroundColor 추가
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
        backgroundColor={backgroundColor} // backgroundColor 적용
        _hover={{ bg: 'accent.600' }}
        {...rest}
      >
        {label} {children}
      </ChakraButton>
    );
  }

  if (variant === 'text') {
    return (
      <ChakraButton
        variant="ghost"
        size="sm"
        fontSize="sm"
        backgroundColor={backgroundColor} // backgroundColor 적용
        color="gray.600"
        _hover={{ bg: 'accent.600' }}
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
      backgroundColor={backgroundColor || 'accent.500'} // backgroundColor 적용, 기본값 유지
      _hover={{ bg: 'accent.600' }}
      {...rest}
    >
      {label} {children}
    </ChakraButton>
  );
};

export default Button;
