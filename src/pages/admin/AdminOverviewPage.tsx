// src/pages/admin/AdminOverviewPage.tsx
import { Box, Text, VStack, Flex, Image } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '@/api/requests';

// API 응답에 맞는 타입 정의
type AdminItem = {
  id: number;
  universityId: number;
  organizationId: number;
  name: string;
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  countWaitList: number;
  isActive: boolean;
  isBooked: boolean;
  coverKey: string | null;
};

type AdminItemsResponse = {
  content: AdminItem[];
  page: number;
  size: number;
  totalElements: number;
};

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchAdminItems = async () => {
    try {
      setLoading(true);

      const data: AdminItemsResponse = await getRequest<AdminItemsResponse>(
        '/admin/items?page=0&size=20&sort=id,asc'
      );

      setItems(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminItems();
  }, []);

  // 상세보기 -> 라우팅
  const handleInfo = (id: number) => {
    navigate(`/admin/overview/${id}`);
  };

  if (loading) {
    return (
      <Box px={10}>
        <PageHeader
          px={0}
          py={10}
          bgColor="transparent"
          title="물품 관리"
          subtitle="등록된 물품들을 확인하고 관리할 수 있습니다."
        />
        <Text>로딩 중...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box px={10}>
        <PageHeader
          px={0}
          py={10}
          bgColor="transparent"
          title="물품 관리"
          subtitle="등록된 물품들을 확인하고 관리할 수 있습니다."
        />
        <Text color="red.500">오류: {error}</Text>
        <Button label="다시 시도" onClick={fetchAdminItems} mt={4} />
      </Box>
    );
  }

  return (
    <Box px={10}>
      <PageHeader
        px={0}
        py={10}
        bgColor="transparent"
        title="물품 관리"
        subtitle="등록된 물품들을 확인하고 관리할 수 있습니다."
      />

      <Flex justify="space-between" mt={2} gap={2}>
        <Text fontSize="sm" color="gray.500">
          총 {items.length}개의 물품
        </Text>
        <Flex gap={2}>
          <Button label="최신순 ^" variant="text" size="sm" />
          <Button label="물품 등록하기" size="sm" onClick={() => navigate('/admin/items/create')} />
        </Flex>
      </Flex>

      <VStack gap={2} align="stretch" mt={2}>
        {items.map((item) => (
          <Card
            key={item.id}
            image={
              item.coverKey ? (
                <Image src={item.coverKey} alt={item.name} objectFit="cover" w="100%" h="200px" />
              ) : (
                <Box
                  bg="gray.200"
                  w="100%"
                  h="200px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="gray.500">이미지 없음</Text>
                </Box>
              )
            }
            title={item.name}
            subtitle={item.description}
            bottomExtra={
              <Flex justify="space-between" w="100%" align="flex-end">
                <Flex direction="column" gap={1}>
                  <Text fontSize="sm" color="gray.500">
                    총 수량: {item.totalQuantity}개
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    대여 가능: {item.availableQuantity}개
                  </Text>
                  {item.countWaitList > 0 && (
                    <Text fontSize="sm" color="orange.500">
                      대기자: {item.countWaitList}명
                    </Text>
                  )}
                </Flex>
                <Flex gap={2}>
                  <Button
                    size="sm"
                    label="상세보기"
                    colorScheme="green"
                    onClick={() => handleInfo(item.id)}
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
