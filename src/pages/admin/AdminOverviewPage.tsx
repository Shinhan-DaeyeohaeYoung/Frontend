// src/pages/admin/AdminOverviewPage.tsx
import { Box, Text, VStack, Flex, Image } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';

type RentItem = {
  id: number;
  universityId: number;
  organizationId: number;
  name: string;
  submitter: string;
  submissionNumber: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  overdueDays: number | null;
  coverKey: string;
};

export default function RentPage() {
  const navigate = useNavigate();

  const response = {
    content: [
      {
        id: 1,
        universityId: 1,
        organizationId: 2,
        name: '사진',
        submitter: '길태은(1335841)',
        submissionNumber: '250821',
        category: '충전기',
        status: 'pending',
        overdueDays: 7,
        coverKey: 'univ/1/items/1/units/501.jpg',
      },
      {
        id: 4,
        universityId: 1,
        organizationId: 2,
        name: '사진',
        submitter: '이지혜(13302156)',
        submissionNumber: '250818',
        category: '계산기',
        status: 'pending',
        overdueDays: null,
        coverKey: 'univ/1/items/1/units/504.jpg',
      },
    ] as RentItem[],
    page: 0,
    size: 20,
    totalElements: 4,
  };

  const [data] = useState<RentItem[]>(response.content);

  // 상세보기 -> 라우팅
  const handleInfo = (id: number) => {
    navigate(`/admin/overview/${id}`);
  };

  return (
    <Box px={10}>
      <PageHeader
        px={0}
        py={10}
        bgColor="transparent"
        title="물품 관리"
        subtitle="등록된 물품들을 확인하고 관리할 수 있습니다."
      />

      <Flex justify="flex-end" mt={2} gap={2}>
        <Button label="최신순 ^" variant="text" size="sm" />
        <Button label="물품 등록하기" size="sm" onClick={() => navigate('/admin/items/create')} />
      </Flex>

      <VStack gap={2} align="stretch" mt={2}>
        {data.map((el, index) => (
          <Card
            key={el.id}
            image={
              <Image
                src={
                  index === 0
                    ? 'https://1801889e95b1f9bf.kinxzone.com/webfile/product/9/9755/b1khuy9y3s1k.jpg'
                    : 'https://i.namu.wiki/i/m84JDBUQ7AU_2KTxlPFTXUPv8ddbq95UuFy_n05VcpTONz0fZYjnJjLdoRin4x0Z1DrdIYIfU6bZ6_piFCSg54awA4FgxA7lKsNc9vncZUbHItSFgi5LKV-N2QKxAp5ynFsx1Kk2BfdSFmBDOjpIew.webp'
                }
                alt={el.category}
              />
            }
            title={el.category}
            subtitle={`물품설명이 여기 들어갑니다. 물품설명이 여기 들어갑니다. 물품설명이 여기 들어갑니다. 물품설명이 여기 들어갑니다.`}
            bottomExtra={
              <Flex justify="space-between" w="100%" align="flex-end">
                <Text fontSize="sm" color="gray.500">
                  총 갯수 : 50개
                </Text>
                <Flex>
                  <Button
                    size="sm"
                    label="상세보기"
                    colorScheme="green"
                    onClick={() => handleInfo(el.id)}
                  />
                </Flex>
              </Flex>
            }
          />
        ))}
      </VStack>
    </Box>
  );
}
