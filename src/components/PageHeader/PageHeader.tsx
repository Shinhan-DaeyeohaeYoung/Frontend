import React from 'react';
import { Box, Stack, Text, Image, type BoxProps } from '@chakra-ui/react';

export interface PageHeaderProps extends BoxProps {
  /** 메인 헤더 제목 */
  title: string;
  /** 서브 설명 텍스트 (선택사항) */
  subtitle?: string;
  minH?: string | number;
  /** 헤더 정렬 방식 */
  align?: 'left' | 'center' | 'right';
  /** 커스텀 배경색 */
  bgColor?: string;
  /** 제목 색상 */
  titleColor?: string;
  /** 부제목 색상 */
  subtitleColor?: string;
  /** 우측 하단에 표시할 이미지 (URL, 경로, Blob 가능) */
  imageSrc?: string;
  /** 이미지 크기 */
  imageSize?: string | number;
  imageBottom?: string | number;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  minH = 240,
  align = 'left',
  bgColor = '#A1C9FA',
  titleColor = 'white',
  subtitleColor = 'gray.800',
  imageSrc,
  imageSize = 100,
  imageBottom = 4,
  ...rest
}) => {
  const textAlign = align === 'left' ? 'start' : align === 'right' ? 'end' : 'center';

  return (
    <Box position="relative" bg={bgColor || 'gray.50'} px={6} py={8} w="100%" minH={minH} {...rest}>
      <Stack gap={2} align={align === 'center' ? 'center' : 'flex-start'} textAlign={textAlign}>
        <Text
          fontSize="4xl"
          fontFamily={'jalnan'}
          fontWeight="bold"
          color={titleColor}
          _dark={{ color: 'white' }}
          lineHeight="shorter"
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            fontSize="sm"
            color={subtitleColor}
            _dark={{ color: 'gray.300' }}
            maxW="md"
            fontWeight={500}
            lineHeight="relaxed"
            whiteSpace="pre-line"
          >
            {subtitle}
          </Text>
        )}
      </Stack>

      {imageSrc && (
        <Image
          src={imageSrc}
          alt="header decoration"
          position="absolute"
          right={4}
          bottom={imageBottom}
          boxSize={imageSize}
          objectFit="contain"
          pointerEvents="none"
        />
      )}
    </Box>
  );
};

export default PageHeader;
