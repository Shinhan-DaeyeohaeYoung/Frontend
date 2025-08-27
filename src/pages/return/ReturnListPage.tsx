import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Button,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

type Item = {
  id: number | string;
  name: string;
  desc?: string;
};

const mockItems: Item[] = [
  { id: 1, name: '우산', desc: '은색 장우산' },
  { id: 2, name: '보조배터리', desc: '20,000mAh' },
  { id: 3, name: '노트북 충전기', desc: 'USB-C 65W' },
];

const ReturnListPage: React.FC = () => {
  const navigate = useNavigate();

  const goPhoto = (item: Item) => {
    navigate(`/return/${item.id}/photo`, { state: { itemName: item.name } });
  };

  return (
    <Box bg="gray.50" minH="100dvh">
      <Container maxW="container.sm" py={6}>
        <VStack align="stretch" spacing={4}>
          <Heading size="md" color="gray.800">
            반납할 물품을 선택하세요
          </Heading>

          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            {mockItems.map((item) => (
              <Box
                key={item.id}
                border="1px solid"
                borderColor="gray.200"
                bg="white"
                rounded="md"
                p={4}
                _hover={{ shadow: 'sm' }}
              >
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">{item.name}</Text>
                  {item.desc && (
                    <Text fontSize="sm" color="gray.600">
                      {item.desc}
                    </Text>
                  )}
                  <HStack w="100%" justify="flex-end">
                    <Button size="sm" colorScheme="blue" onClick={() => goPhoto(item)}>
                      반납하기
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default ReturnListPage;
