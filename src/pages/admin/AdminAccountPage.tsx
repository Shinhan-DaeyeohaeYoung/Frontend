import React, { useEffect, useMemo, useState } from 'react';
import { Box, Stack, Text, Flex, Image } from '@chakra-ui/react';
import AccountHistory, { type AccountTransaction } from '@/components/Account/AccountHistory';
import { PageHeader } from '@/components/PageHeader';
import sinhan from '@/assets/imgs/shinhan_logo.png';
import { getRequest } from '@/api/requests';
// import logo_02 from '@/assets/imgs/logo_02.png';
import logo_07 from '@/assets/imgs/logo_07.png';
import { Tag } from '@/components/Tag';
import { useAuthStore } from '@/stores/authStore';

// ====== API 타입 ======
type DepositEventStatusKo = '예치' | '환불' | '몰수';
type DepositEventStatusEn = 'CREATED' | 'REFUNDED' | 'FORFEITED';

type DepositEvent = {
  id: number;
  amount: number;
  status: DepositEventStatusKo | DepositEventStatusEn;
  created_updated_at: string;
  organization_name: string;
};

type BankAccount = {
  id: number;
  bankCode: string;
  bankName: string;
  accountHolderName: string;
  accountNoMasked: string;
  primary: boolean;
  verified: boolean;
  createdAt: string;
};

// ====== 유틸 ======
function toMMDD(dateIso: string) {
  const d = new Date(dateIso);
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${mm}.${dd}`;
}
function normalizeStatus(s: DepositEvent['status']): 'DEPOSIT' | 'WITHDRAW' | 'FORFEIT' {
  if (s === '환불' || s === 'REFUNDED') return 'DEPOSIT';
  if (s === '몰수' || s === 'FORFEITED') return 'FORFEIT';
  return 'WITHDRAW';
}
function signedAmountByStatus(evt: DepositEvent): number {
  const kind = normalizeStatus(evt.status);
  if (kind === 'DEPOSIT') return Math.abs(evt.amount);
  return -Math.abs(evt.amount);
}
const currencyKRW = (n: number) =>
  new Intl.NumberFormat('ko-KR', {
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(n);

const AdminQrPage: React.FC = () => {
  const { user } = useAuthStore();
  // const { user } = useAuthStore.getState();
  const { admin, organizationInfo } = user ?? {};
  if (!admin || !organizationInfo) return null;

  // 인덱싱으로 접근해도 되지만 null 가능성 처리 필수
  const org = (organizationInfo as any)[admin] as { id: number } | null | undefined;
  // return org?.id ?? null;

  const orgId = org?.id; // ✅ 조직 ID 가져오기 (구현에 맞게 수정)
  // console.log(orgId);
  // const orgId = user?.organizationInfo?.id; // ✅ 조직 ID 가져오기 (구현에 맞게 수정)

  // 이벤트(이체내역)
  const [events, setEvents] = useState<DepositEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 내 계좌 (첫 번째/primary)
  const [myAccount, setMyAccount] = useState<BankAccount | null>(null);
  const [accError, setAccError] = useState<string | null>(null);

  // --- 이체내역 불러오기 ---
  const fetchEvents = async () => {
    if (!orgId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getRequest<DepositEvent[]>(`/deposits/organizations/${orgId}`);
      setEvents(Array.isArray(res) ? res : []);
    } catch (e: any) {
      setError(e?.message ?? '계좌 내역을 불러오는 중 오류가 발생했습니다.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 조직 계좌 불러오기 ---
  const fetchMyAccount = async () => {
    if (!orgId) return;
    try {
      setAccError(null);
      const list = await getRequest<BankAccount[]>(`/organizations/${orgId}/bank-accounts`);
      if (Array.isArray(list) && list.length > 0) {
        const primary = list.find((a) => a.primary) ?? list[0];
        setMyAccount(primary);
      } else {
        setMyAccount(null);
      }
    } catch (e: any) {
      setAccError(e?.message ?? '계좌 정보를 불러오는 중 오류가 발생했습니다.');
      setMyAccount(null);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchMyAccount();
  }, [orgId]);

  // 누적 잔액 + 컴포넌트 매핑
  const { transactions, currentBalance } = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) => new Date(a.created_updated_at).getTime() - new Date(b.created_updated_at).getTime()
    );
    let balance = 0;
    const txs: AccountTransaction[] = sorted.map((evt) => {
      const signed = signedAmountByStatus(evt);
      balance += signed;
      const kind = normalizeStatus(evt.status);
      const titlePostfix =
        kind === 'DEPOSIT' ? '보증금 환불' : kind === 'FORFEIT' ? '보증금 몰수' : '보증금 예치';

      return {
        id: String(evt.id),
        date: toMMDD(evt.created_updated_at),
        title: `(${evt.organization_name}) ${titlePostfix}`,
        amount: signed,
        balance,
        type: signed >= 0 ? 'deposit' : 'withdrawal',
      };
    });

    return { transactions: txs.reverse(), currentBalance: balance };
  }, [events]);

  const handleTransactionClick = (t: AccountTransaction) => {
    // console.log('거래 내역 클릭:', t);
  };

  return (
    <Box position="relative">
      <PageHeader
        title="운영 계좌 내역"
        subtitle={`운영 계좌의 입출금 내역을 한눈에 확인하세요!
보증금의 흐름을 투명하게 관리할 수 있어요`}
        bgColor="#AEB7C1"
        imageSrc={logo_07}
        imageBottom={-10}
        minH={280}
        imageSize={'240px'}
      />
      <Box px={6}>
        <Text textAlign="left" pt={6} pb={4} fontWeight="500">
          My 조직 계좌
        </Text>
        <Flex
          bg="new_white.500"
          border="1px solid"
          borderColor="gray.200"
          rounded="xl"
          p={4}
          flexDir="column"
        >
          <Image src={sinhan} htmlWidth="40px" htmlHeight="40px" alt="신한은행" />
          <Flex wrap="wrap" align="baseline" gap={2}>
            <Text fontSize="md" color="gray.600" mb={2}>
              신한은행
            </Text>
            <Text fontSize="sm" color="gray.600" mb={2}>
              {myAccount ? myAccount.accountNoMasked : '계좌번호 없음'}
            </Text>
            {<Tag label="모임 통장"></Tag>}
          </Flex>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" textAlign="right">
              {currencyKRW(currentBalance)}원
            </Text>
          </Box>
          {accError && (
            <Text mt={2} color="red.500" fontSize="sm">
              {accError}
            </Text>
          )}
        </Flex>
      </Box>
      <Stack p={4} gap={4}>
        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}
      </Stack>
      <Box h="1px" bgColor="gray.200"></Box>

      <Text textAlign="left" pt={6} pb={4} px={6} fontWeight="500">
        최근 거래 내역
      </Text>
      {!loading && !error && transactions.length === 0 && (
        <Text color="gray.500" fontSize="sm" px={6}>
          거래 내역이 없습니다.
        </Text>
      )}
      {!loading && !error && transactions.length > 0 && (
        <Box>
          <AccountHistory items={transactions} onItemClick={handleTransactionClick} showDividers />
        </Box>
      )}
    </Box>
  );
};

export default AdminQrPage;
