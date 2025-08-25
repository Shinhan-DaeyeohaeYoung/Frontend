import { HStack, Text } from '@chakra-ui/react';
import type { StackProps } from '@chakra-ui/react';
import React from 'react';

export interface BasicListItemProps extends StackProps {
  date: string; // ex) "07.21"
  content: string;
}

const BasicListItem: React.FC<BasicListItemProps> = ({ date, content, ...rest }) => (
  <HStack py={2} px={1} align="start" justify="flex-start" width="100%" {...rest}>
    <Text wordBreak="break-all" flex={1}>
      {content}
    </Text>
    <Text minWidth="48px" flexShrink={0} color="gray.500" fontSize="sm">
      {date}
    </Text>
  </HStack>
);

export default BasicListItem;
