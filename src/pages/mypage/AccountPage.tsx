import React from 'react';
import { Box, Stack, Text, Flex, Image } from '@chakra-ui/react';
import AccountHistory, { type AccountTransaction } from '@/components/Account/AccountHistory'; // 기존 컴포넌트 임포트
import { PageHeader } from '@/components/PageHeader';
import sinhan from '@/assets/imgs/shinhan_logo.png';
const AccountPage: React.FC = () => {
  // 샘플 데이터
  const sampleTransactions: AccountTransaction[] = [
    {
      id: '1',
      date: '01.27',
      title: '(물품 관리차)',
      amount: -30000,
      balance: 50000,
      type: 'withdrawal',
    },
    {
      id: '2',
      date: '01.25',
      title: '(물품 관리차)',
      amount: -25000,
      balance: 80000,
      type: 'withdrawal',
    },
    {
      id: '3',
      date: '12.03',
      title: '(물품 관리차)',
      amount: -15000,
      balance: 105000,
      type: 'withdrawal',
    },
  ];

  const handleBack = () => {
    console.log('뒤로가기 클릭');
  };

  const handleTransactionClick = (transaction: AccountTransaction) => {
    console.log('거래 내역 클릭:', transaction);
  };

  return (
    <Box position="relative">
      {/* 헤더 */}
      <PageHeader
        bg={'transparent'}
        title="계좌 이체내역"
        subtitle="지금까지 입출금한 보증금 내역을 확인해보세요"
      />

      {/* 컨텐츠 */}
      <Stack p={4} gap={4}>
        {/* Section 5 - 신한은행 계좌 정보 */}
        <Flex
          bg="gray.100"
          border="1px solid"
          borderColor="gray.200"
          rounded="xl"
          p={4}
          flexDir="column"
        >
          <Image src={sinhan} htmlWidth="40px" htmlHeight="40px" />
          <Flex>
            <Text fontSize="md" color="gray.600" mb={2} mr={1}>
              신한은행
            </Text>
            <Text fontSize="sm" color="gray.600" mb={2}>
              100-23235435-245092345
            </Text>
          </Flex>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" textAlign={'right'}>
              30,000원
            </Text>
          </Box>
        </Flex>

        <AccountHistory
          items={[sampleTransactions[0]]}
          onItemClick={handleTransactionClick}
          showDividers={true}
        />

        {/* Section 8 거래 내역 */}
        <AccountHistory
          items={[sampleTransactions[1]]}
          onItemClick={handleTransactionClick}
          showDividers={true}
        />

        <AccountHistory
          items={[sampleTransactions[2]]}
          onItemClick={handleTransactionClick}
          showDividers={true}
        />
      </Stack>
    </Box>
  );
};

export default AccountPage;
