import React from 'react';
import { Box, Stack, Text, type BoxProps } from '@chakra-ui/react';

export interface PageHeaderProps extends BoxProps {
  /** 메인 헤더 제목 */
  title: string;
  /** 서브 설명 텍스트 (선택사항) */
  subtitle?: string;
  /** 헤더 정렬 방식 */
  align?: 'left' | 'center' | 'right';
  /** 커스텀 배경색 */
  bgColor?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  align = 'left',
  bgColor,
  ...rest
}) => {
  const textAlign = align === 'left' ? 'start' : align === 'right' ? 'end' : 'center';

  return (
    <Box
      bg={bgColor || 'gray.50'}
      px={6}
      py={8}
      w="100%"
      // _dark={{
      //   bg: bgColor ? undefined : 'gray.800',
      // }}
      {...rest}
    >
      <Stack gap={2} align={align === 'center' ? 'center' : 'flex-start'} textAlign={textAlign}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="gray.900"
          _dark={{ color: 'white' }}
          lineHeight="shorter"
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            fontSize="sm"
            color="gray.600"
            _dark={{ color: 'gray.300' }}
            maxW="md"
            lineHeight="relaxed"
            whiteSpace="pre-line"
          >
            {subtitle}
          </Text>
        )}
      </Stack>
    </Box>
  );
};

export default PageHeader;
