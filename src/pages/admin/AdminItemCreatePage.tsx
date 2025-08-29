// src/pages/admin/AdminItemCreatePage.tsx
import * as React from 'react';
import { Box, VStack, Textarea, Input } from '@chakra-ui/react';
import { Button } from '@/components/Button';
import TextInput from '@/components/Input/TextInput';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { useAuthStore } from '@/stores/authStore';
import { postRequest } from '@/api/requests'; // 추가

export default function ItemCreatePage() {
  const navigate = useNavigate();
  const { universityId, user } = useAuthStore(); // authStore에서 값들 가져오기

  const [name, setName] = React.useState('');
  const [maxRentalDays, setMaxRentalDays] = React.useState<number | ''>('');
  const [deposit, setDeposit] = React.useState<number | ''>('');
  const [description, setDescription] = React.useState('');

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
        organizationId: user?.organizationInfo?.university?.id || 2,
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
    <Box w="full" maxW="520px" mx="auto">
      {/* 상단 헤더 (PageHeader + 오버레이 아이콘 버튼) */}
      <PageHeader
        title="물품 등록"
        subtitle={'대여기간·보증금·설명을 입력하고'}
        // bgColor 생략 시 기본 gray.50, 필요하면 bgColor="transparent"로 바꿔서 배경 없는 헤더로 사용 가능
      />

      {/* 본문 폼 */}
      <VStack
        as="form"
        align="stretch"
        gap={3}
        px={4}
        py={4}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* 물품 명 */}
        <TextInput
          placeholder="물품 명을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 최대 대여일 */}
        <Input
          type="number"
          value={maxRentalDays}
          onChange={(e) => setMaxRentalDays(e.target.value === '' ? '' : Number(e.target.value))}
          min={1}
          placeholder="최대 대여일을 입력해주세요 (일 기준)"
          h="36px"
          bg="white"
          borderRadius="xl"
          borderColor="gray.300"
          _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #A4B8FB' }}
        />

        {/* 보증금 */}
        <Input
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value === '' ? '' : Number(e.target.value))}
          min={0}
          step={1000}
          placeholder="보증금을 입력해주세요"
          h="36px"
          bg="white"
          borderRadius="xl"
          borderColor="gray.300"
          _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #A4B8FB' }}
        />

        {/* 설명 */}
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="물품에 대한 설명을 입력해주세요"
          minH="120px"
          bg="white"
          borderRadius="xl"
          borderColor="gray.300"
          _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #A4B8FB' }}
        />

        {/* 활성 여부 필드 제거 - 무조건 true이므로 UI에서 보여줄 필요 없음 */}

        {/* 제출 */}
        <Button label="다음" onClick={handleSubmit} />
      </VStack>
    </Box>
  );
}
