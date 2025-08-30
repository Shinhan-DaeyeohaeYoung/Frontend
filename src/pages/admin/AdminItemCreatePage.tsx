// src/pages/admin/AdminItemCreatePage.tsx
import * as React from 'react';
import { Box, VStack, Textarea, Input, Text } from '@chakra-ui/react';
import { Button } from '@/components/Button';
import TextInput from '@/components/Input/TextInput';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { useAuthStore } from '@/stores/authStore';
import { postRequest } from '@/api/requests';
import logo_01 from '@/assets/imgs/logo_01.png';

export default function ItemCreatePage() {
  const navigate = useNavigate();
  const { universityId, user } = useAuthStore(); // authStore에서 값들 가져오기

  const [name, setName] = React.useState('');
  const [maxRentalDays, setMaxRentalDays] = React.useState<number | ''>('');
  const [deposit, setDeposit] = React.useState<number | ''>('');
  const [description, setDescription] = React.useState('');

  const { admin, organizationInfo } = user ?? {};

  // admin 값에 따라 해당 조직의 ID 가져오기
  const organizationId =
    admin && organizationInfo
      ? (organizationInfo as Record<string, { id: number }>)[admin]?.id
      : null;

  // organizationId가 없으면 에러 처리
  if (!organizationId) {
    return <div>조직 정보를 찾을 수 없습니다.</div>;
  }

  const validate = () => {
    if (!name.trim()) return '물품 명을 입력해주세요.';
    if (maxRentalDays === '' || Number(maxRentalDays) <= 0)
      return '최대 대여일을 1 이상으로 입력해주세요.';
    if (deposit === '' || Number(deposit) < 0) return '보증금을 0 이상으로 입력해주세요.';
    if (!description.trim()) return '설명을 입력해주세요.';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    try {
      const requestBody = {
        universityId: universityId || 1,
        organizationId: organizationId, // 하드코딩된 값 제거
        name: name.trim(),
        description: description.trim(),
        deposit: Number(deposit),
        maxRentalDays: Number(maxRentalDays),
        isActive: true,
      };

      const result = await postRequest<{ id: number }>('/admin/items', requestBody);

      alert('아이템이 성공적으로 생성되었습니다.');

      // 생성된 아이템의 id를 포함해서 unitcreatepage로 이동
      navigate('/admin/units/create', {
        state: {
          createdItemId: result.id,
          createdItemName: name.trim(),
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '요청 처리 중 오류가 발생했습니다.';
      alert(msg);
    }
  };

  return (
    <Box
      w="full"
      maxW="520px"
      mx="auto"
      minH="calc(100% - 52px - 20px)" // [todo]: 하단 픽셀 수정
      display="flex"
      flexDir="column"
    >
      {/* 상단 헤더 (PageHeader + 오버레이 아이콘 버튼) */}
      <PageHeader
        title="물품 등록"
        subtitle={'보증금·대여기간·물품 설명을 설정하고\n안전하고 편리한 대여 환경을 만들어 보세요'}
        imageSrc={logo_01}
        imageSize={40}
      />
      <VStack
        as="form"
        align="stretch"
        gap={5}
        px={4}
        py={4}
        flex="1"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* 카드 느낌의 섹션 래퍼 */}
        {/* <Box bg="white" border="1px solid" borderColor="gray.200" rounded="xl" p={4}> */}
        {/* 물품 명 */}
        <Box mb={4}>
          <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.800" textAlign="left">
            물품명
          </Text>
          <TextInput
            placeholder="물품명을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>

        {/* 최대 대여일 */}
        <Box mb={4}>
          <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.800" textAlign="left">
            최대 대여일
          </Text>
          <Box position="relative">
            <Input
              type="number"
              value={maxRentalDays}
              onChange={(e) =>
                setMaxRentalDays(e.target.value === '' ? '' : Number(e.target.value))
              }
              min={1}
              placeholder="최대 대여일을 입력해주세요"
              h="44px"
              pr="52px" // 단위 배지 공간
              textAlign="right" // 숫자 우측 정렬
              bg="white"
              borderRadius="xl"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #A4B8FB' }}
            />
            {/* 단위 배지 */}
            <Box
              position="absolute"
              right="8px"
              top="50%"
              transform="translateY(-50%)"
              px="2"
              py="1"
              fontSize="xs"
              color="gray.600"
              bg="gray.100"
              rounded="md"
              pointerEvents="none"
            >
              일
            </Box>
          </Box>
        </Box>

        {/* 보증금 */}
        <Box mb={4}>
          <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.800" textAlign="left">
            보증금
          </Text>
          <Box position="relative">
            <Input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              step={1000}
              placeholder="보증금을 입력해주세요"
              h="44px"
              pr="52px"
              textAlign="right"
              bg="white"
              borderRadius="xl"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #A4B8FB' }}
            />
            <Box
              position="absolute"
              right="8px"
              top="50%"
              transform="translateY(-50%)"
              px="2"
              py="1"
              fontSize="xs"
              color="gray.600"
              bg="gray.100"
              rounded="md"
              pointerEvents="none"
            >
              원
            </Box>
          </Box>
        </Box>

        {/* 설명 */}
        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.800" textAlign="left">
            설명
          </Text>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="물품에 대한 설명을 입력해주세요"
            minH="160px"
            bg="white"
            borderRadius="xl"
            borderColor="gray.300"
            _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #A4B8FB' }}
          />
        </Box>
        {/* </Box> */}
      </VStack>
      {/* 하단 버튼 */}
      <Box px={4} pb={6}>
        <Button w="full" label="다음" onClick={handleSubmit} />
      </Box>
    </Box>
  );
}
