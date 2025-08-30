// src/pages/admin/AdminOverviewPage.tsx
import { Box, Text, VStack, Flex, Image } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '@/api/requests';
import logo_01 from '@/assets/imgs/logo_01.png';

// API 응답에 맞는 타입 정의 (기존 유지)
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

  // ✅ API 요청 흐름은 수정하지 않음
  const fetchAdminItems = async () => {
    try {
      setLoading(true);
      const data: AdminItemsResponse = await getRequest<AdminItemsResponse>(
        '/admin/items?page=0&size=20&sort=id,desc'
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

  const handleInfo = (id: number) => {
    navigate(`/admin/overview/${id}`);
  };

  if (loading) {
    return (
      <PageHeader
        imageSrc={logo_01}
        imageSize={40}
        title="물품 관리"
        subtitle={'등록된 물품들을 확인하고 관리할 수 있어요'}
      />
    );
  }

  if (error) {
    return (
      <Box>
        <PageHeader
          imageSrc={logo_01}
          imageSize={40}
          title="물품 관리"
          subtitle={'등록된 물품들을 확인하고 관리할 수 있어요'}
        />
        <Text px={6} color="red.500">
          오류: {error}
        </Text>
        <Box px={6} mt={4}>
          <Button label="다시 시도" onClick={fetchAdminItems} />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* ✅ RentPage와 동일한 헤더 톤 */}
      <PageHeader
        imageSrc={logo_01}
        imageSize={40}
        title="물품 관리"
        subtitle={'등록된 물품들을 확인하고 관리할 수 있어요'}
      />

      {/* 상단 컨트롤 바: RentPage엔 없지만 유지해도 레이아웃에 영향 없음 */}
      <Flex justify="space-between" mt={6} gap={2} px={4}>
        <Text fontSize="sm" color="gray.500">
          총 {items.length}개의 물품
        </Text>
        <Flex gap={2}>
          {/* <Button label="최신순 ^" variant="text" size="sm" /> */}
          <Button label="물품 등록하기" size="sm" onClick={() => navigate('/admin/items/create')} />
        </Flex>
      </Flex>

      {/* ✅ RentPage 스타일의 리스트: VStack + borderBottom */}
      <VStack
        gap={0}
        align="stretch"
        mt={4}
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={0}
      >
        {items.map((item) => {
          const canRent = item.availableQuantity > 0;
          // const canBook = item.availableQuantity === 0 && item.countWaitList < item.totalQuantity;

          return (
            <Card
              key={item.id}
              image={
                item.coverKey ? (
                  <Image src={item.coverKey} alt={item.name} />
                ) : (
                  <Box
                    bg="gray.200"
                    w="100%"
                    h="100%"
                    minH="80px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="gray.500" fontSize="sm">
                      이미지 없음
                    </Text>
                  </Box>
                )
              }
              title={item.name}
              subtitle={item.description}
              bottomExtra={
                <Flex justify="space-between" width="100%" align="flex-end">
                  <Text fontSize="xs" color="gray.500">
                    {canRent
                      ? `대여 가능: ${item.availableQuantity}/${item.totalQuantity}개`
                      : `예약 가능: ${item.countWaitList}/${item.totalQuantity}개`}
                  </Text>

                  {/* 관리자 페이지에서는 '상세보기'로 이동 */}
                  <Button
                    ml="auto"
                    size="sm"
                    label="상세보기"
                    onClick={() => handleInfo(item.id)}
                  />
                </Flex>
              }
            />
          );
        })}
      </VStack>
    </Box>
  );
}
