import React from 'react';
import { Box, HStack, Button, type BoxProps } from '@chakra-ui/react';

export interface SegmentOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SegmentButtonGroupProps extends Omit<BoxProps, 'onChange'> {
  /** 세그먼트 옵션들 */
  options: SegmentOption[];
  /** 현재 선택된 값 */
  value: string;
  /** 값 변경 핸들러 (선택사항) */
  onChange?: (value: string) => void;
  /** 컴포넌트 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 색상 테마 */
  colorPalette?: 'gray' | 'blue' | 'green' | 'purple' | 'red';
  /** 전체 너비 사용 여부 */
  isFullWidth?: boolean;
  /** 비활성화 상태 */
  isDisabled?: boolean;
}

export const SegmentButtonGroup: React.FC<SegmentButtonGroupProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  colorPalette = 'gray',
  isFullWidth = false,
  isDisabled = false,
  ...rest
}) => {
  const buttonHeight = {
    sm: '6',
    md: '10',
    lg: '12',
  }[size];

  const fontSize = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  }[size];

  return (
    <Box
      bg="white"
      border="2px solid"
      borderColor="gray.300"
      rounded="lg"
      p="1"
      display="inline-flex"
      w={isFullWidth ? '100%' : 'auto'}
      _dark={{
        bg: 'gray.800',
        borderColor: 'gray.600',
      }}
      {...rest}
    >
      <HStack gap="1" w={isFullWidth ? '100%' : 'auto'}>
        {options.map((option) => {
          const isSelected = option.value === value;
          const isOptionDisabled = isDisabled || option.disabled;

          return (
            <Button
              key={option.value}
              size={size}
              fontSize={fontSize}
              h={buttonHeight}
              flex={isFullWidth ? 1 : undefined}
              minW={isFullWidth ? undefined : '12'}
              variant={isSelected ? 'solid' : 'ghost'}
              colorPalette={isSelected ? colorPalette : 'gray'}
              bg={isSelected ? `${colorPalette}.500` : 'transparent'}
              color={isSelected ? 'white' : isOptionDisabled ? 'gray.400' : 'gray.700'}
              _hover={{
                bg: isSelected ? `${colorPalette}.600` : isOptionDisabled ? undefined : 'gray.100',
                _dark: {
                  bg: isSelected
                    ? `${colorPalette}.600`
                    : isOptionDisabled
                    ? undefined
                    : 'gray.700',
                },
              }}
              _active={{
                bg: isSelected ? `${colorPalette}.700` : 'gray.200',
                _dark: {
                  bg: isSelected ? `${colorPalette}.700` : 'gray.600',
                },
              }}
              _disabled={{
                opacity: 0.4,
                cursor: 'not-allowed',
              }}
              disabled={isOptionDisabled}
              onClick={() => !isOptionDisabled && onChange?.(option.value)}
              rounded="md"
              fontWeight={isSelected ? 'semibold' : 'normal'}
              transition="all 0.2s"
              _dark={{
                color: isSelected ? 'white' : isOptionDisabled ? 'gray.500' : 'gray.200',
              }}
            >
              {option.label}
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
};

export default SegmentButtonGroup;
