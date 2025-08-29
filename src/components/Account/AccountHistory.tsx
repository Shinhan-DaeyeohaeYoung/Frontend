import React from 'react';
import { Box, Flex, HStack, Stack, Text, Separator, Tag, type BoxProps } from '@chakra-ui/react';

export type TransactionType = 'deposit' | 'withdrawal';

export interface AccountTransaction {
  id: string;
  /** ISO string(2025-08-25) or any parsable date string; if already 'MM.DD' it will be used as-is */
  date: string;
  title: string;
  /** amount > 0 = 입금, amount < 0 = 출금 */
  amount: number;
  /** 거래 후 잔액 */
  balance: number;
  /** override type when amount sign is not enough (optional) */
  type?: TransactionType;
}

export interface AccountHistoryProps extends BoxProps {
  sectionLabel?: string;
  items: AccountTransaction[];
  /** 아이템 클릭 핸들러 (옵션) */
  onItemClick?: (tx: AccountTransaction) => void;
  /** 항목 사이 구분선 표시 여부 */
  showDividers?: boolean;
}

const formatDayMonth = (date: string): string => {
  // already formatted like '01.27'
  if (/^\d{2}\.\d{2}$/.test(date)) return date;

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;

  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}.${dd}`;
};

const formatKRW = (value: number) => `${new Intl.NumberFormat('ko-KR').format(value)}원`;

const AmountText: React.FC<{ amount: number }> = ({ amount }) => {
  const isMinus = amount < 0;
  const color = isMinus ? 'gray.800' : 'blue.500';

  return (
    <Text fontWeight="bold" fontSize="md" color={color}>
      {isMinus && '-'}
      {formatKRW(Math.abs(amount))}
    </Text>
  );
};

const DateBadge: React.FC<{ date: string }> = ({ date }) => {
  return (
    <Box px={1} textAlign="center" fontSize="xs" color="gray.500">
      {formatDayMonth(date)}
    </Box>
  );
};

const HistoryRow: React.FC<{
  item: AccountTransaction;
  onClick?: (tx: AccountTransaction) => void;
}> = ({ item, onClick }) => {
  return (
    <HStack
      align="flex-start"
      gap={4}
      py={4}
      cursor={onClick ? 'pointer' : 'default'}
      onClick={() => onClick?.(item)}
      _hover={
        onClick
          ? {
              bg: 'gray.50',
            }
          : undefined
      }
      rounded="md"
      px={1}
    >
      <DateBadge date={item.date} />

      <Text fontSize="sm">{item.title}</Text>
      <Stack gap={0} flex="1" textAlign={'right'}>
        <AmountText amount={item.amount} />
        <Text fontSize="xs" color="gray.400">
          총 잔액 {formatKRW(item.balance)}
        </Text>
      </Stack>
    </HStack>
  );
};

export const AccountHistory: React.FC<AccountHistoryProps> = ({
  sectionLabel,
  items,
  onItemClick,
  showDividers = false,
  ...rest
}) => {
  return (
    <Box
      // bg="white" border="1px solid" borderColor="gray.200"
      // rounded="xl"
      px={4}
      py={4}
      w="100%"
      {...rest}
    >
      {sectionLabel && (
        <Tag.Root size="md" variant="subtle" rounded="md" mb={3} px={3} py={1.5} bg="gray.100">
          {sectionLabel}
        </Tag.Root>
      )}

      <Stack gap={showDividers ? 0 : 2} minW={'360px'}>
        {items.map((item, idx) => (
          <React.Fragment key={item.id}>
            <HistoryRow item={item} onClick={onItemClick} />
            {showDividers && idx < items.length - 1 && <Separator opacity={0.6} />}
          </React.Fragment>
        ))}
        {items.length === 0 && (
          <Flex py={6} justify="center">
            <Text color="gray.500" fontSize="sm" _dark={{ color: 'gray.400' }}>
              표시할 내역이 없습니다.
            </Text>
          </Flex>
        )}
      </Stack>
    </Box>
  );
};

export default AccountHistory;
