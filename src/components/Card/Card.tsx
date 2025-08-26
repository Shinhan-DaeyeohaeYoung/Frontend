import { Box, Flex, Text } from '@chakra-ui/react';

interface CardProps {
  image: React.ReactNode;
  title?: string;
  subtitle?: string;
  extra?: React.ReactNode; // 우측 상단 영역
  onClick?: () => void; // 클릭 이벤트 prop
}

export const Card = ({ image, title, subtitle, extra, onClick }: CardProps) => {
  return (
    <Flex
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
      overflow="hidden"
      p={2}
      align="flex-start"
      transition="all 0.2s ease-in-out"
      _hover={{
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)', // 아주 은은한 그림자
        bg: 'gray.50', // 살짝 배경색 변경
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Box
        flexShrink={0} // 이미지 영역 고정
        w="80px"
        h="80px"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {image}
      </Box>
      <Flex flex="1" direction="column" ml={3}>
        <Flex justify="space-between" align="center">
          <Text fontWeight="bold" color="gray.800">
            {title}
          </Text>
          {extra}
        </Flex>
        <Text
          mt={1}
          fontSize="sm"
          color="gray.600"
          wordBreak="break-word" // 긴 단어 강제 줄바꿈
          overflowWrap="anywhere" // 어디서든 개행 허용
          whiteSpace="normal"
          lineClamp="2" // 2줄까지, 넘치면 …
          textAlign="left"
        >
          {subtitle}
        </Text>
      </Flex>
    </Flex>
  );
};
