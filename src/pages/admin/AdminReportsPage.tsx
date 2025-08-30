import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { Chart, useChart } from '@chakra-ui/charts';
import {
  Cell,
  Pie,
  PieChart,
  Tooltip,
  Label,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

// ✅ 여기서 색만 바꾸면 두 차트가 같이 바뀝니다.
const CHART_COLORS = {
  charger: '#7A6FFB', // 충전기
  calculator: '#FF6FAE', // 공학용계산기
  iron: '#4BA3FF', // 고데기
  umbrella: '#FF9D3C', // 우산
  grid: '#E5E7EB', // 그리드/보더
};

const PERIODS = createListCollection({
  items: [
    { label: '1개월', value: '1m' },
    { label: '3개월', value: '3m' },
    { label: '6개월', value: '6m' },
    { label: '1년', value: '1y' },
  ],
});

// 더미 데이터 생성 유틸
type Period = '1m' | '3m' | '6m' | '1y';

function getRentalDummy(period: Period) {
  // 대여 “횟수” 데이터
  const base = {
    '1m': { charger: 120, calculator: 80, iron: 60, umbrella: 10 },
    '3m': { charger: 320, calculator: 210, iron: 180, umbrella: 40 },
    '6m': { charger: 620, calculator: 420, iron: 360, umbrella: 70 },
    '1y': { charger: 1200, calculator: 880, iron: 760, umbrella: 120 },
  }[period];
  return [
    { name: '충전기', key: 'charger', value: base.charger, color: CHART_COLORS.charger },
    {
      name: '공학용계산기',
      key: 'calculator',
      value: base.calculator,
      color: CHART_COLORS.calculator,
    },
    { name: '고데기', key: 'iron', value: base.iron, color: CHART_COLORS.iron },
    { name: '우산', key: 'umbrella', value: base.umbrella, color: CHART_COLORS.umbrella },
  ];
}

function getOverdueDummy(period: Period) {
  // 월별 “연체 횟수” 데이터
  const months = {
    '1m': ['9월'],
    '3m': ['7월', '8월', '9월'],
    '6m': ['4월', '5월', '6월', '7월', '8월', '9월'],
    '1y': ['10월', '11월', '12월', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월'],
  }[period];

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  return months.map((m) => ({
    month: m,
    충전기: rand(5, 40),
    공학용계산기: rand(3, 35),
    고데기: rand(10, 60),
    우산: rand(0, 25),
  }));
}

function periodLabel(period: Period) {
  return {
    '1m': '최근 1개월',
    '3m': '최근 3개월',
    '6m': '최근 6개월',
    '1y': '최근 1년',
  }[period];
}

const AdminReportsPage = () => {
  // Chakra v3 Select는 배열 값을 사용
  const [period, setPeriod] = React.useState<string[]>(['1y']);

  // 더미 데이터 메모
  const rentalData = React.useMemo(() => getRentalDummy((period[0] as Period) ?? '3m'), [period]);
  const overdueData = React.useMemo(() => getOverdueDummy((period[0] as Period) ?? '3m'), [period]);

  // 총합(횟수)
  const totalRentals = React.useMemo(
    () => rentalData.reduce((s, d) => s + d.value, 0),
    [rentalData]
  );

  // 차트 훅
  const donutChart = useChart({ data: rentalData });
  const barChart = useChart({
    data: overdueData,
    series: [
      { name: '충전기', color: CHART_COLORS.charger, stackId: 'a' },
      { name: '공학용계산기', color: CHART_COLORS.calculator, stackId: 'a' },
      { name: '고데기', color: CHART_COLORS.iron, stackId: 'a' },
      { name: '우산', color: CHART_COLORS.umbrella, stackId: 'a' },
    ],
  });

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #6841EA 0%, #A58BFF 100%)" p={8}>
      {/* <Box minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" p={4}> */}{' '}
      <VStack gap={6} align="stretch" mx="auto">
        {/* 헤더 */}
        {/* <HStack justify="space-between" align="center" color="white" pt={4}>
          <Text fontSize="2xl" fontWeight="bold">
            참고해요
          </Text>
          <Image src={logo} w="40px" h="40px" alt="로고" />
        </HStack> */}

        <HStack justify="space-between" align="center" color="white" pt={4} pb={10}>
          <Text fontSize="4xl" fontWeight="bold" fontFamily={'jalnan'}>
            참고해요
          </Text>
        </HStack>

        {/* 대여 현황 도넛 차트 */}
        <Box bg="white" rounded="3xl" shadow="lg" p={4}>
          <Box pb={2}>
            <HStack justify="space-between" align="center">
              <Heading size="md" color="gray.800">
                대여 통계
              </Heading>

              <Select.Root
                size="sm"
                variant="outline"
                width="120px"
                collection={PERIODS}
                value={period}
                onValueChange={(e) => setPeriod(e.value)}
                positioning={{ sameWidth: true }}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="기간" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {PERIODS.items.map((opt) => (
                        <Select.Item item={opt} key={opt.value}>
                          {opt.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </HStack>
          </Box>

          <VStack gap={4}>
            <Text fontSize="sm" color="gray.600" alignSelf="start">
              {periodLabel((period[0] as Period) ?? '3m')}
            </Text>

            {/* 도넛 */}
            <Chart.Root boxSize="200px" chart={donutChart}>
              <PieChart>
                <Tooltip
                  cursor={false}
                  animationDuration={100}
                  content={<Chart.Tooltip hideLabel />}
                />
                <Pie
                  innerRadius={60}
                  outerRadius={90}
                  isAnimationActive={false}
                  data={donutChart.data}
                  dataKey={donutChart.key('value')}
                  nameKey="name"
                >
                  <Label
                    content={({ viewBox }) => (
                      // ✅ 총 "횟수" 표시
                      <Chart.RadialText
                        viewBox={viewBox}
                        title={`${totalRentals.toLocaleString()}회`}
                        description="총 대여"
                      />
                    )}
                  />
                  {donutChart.data.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </Chart.Root>

            {/* 범례 */}
            <VStack gap={2} w="full">
              {rentalData.map((item) => (
                <HStack key={item.name} justify="space-between" w="full">
                  <HStack gap={2}>
                    <Box w={3} h={3} rounded="full" bg={item.color} />
                    <Text fontSize="sm" color="gray.600">
                      {item.name}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="medium" color="gray.800">
                    {item.value.toLocaleString()}회
                  </Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Box>

        {/* 연체 현황 바 차트 */}
        <Box bg="white" rounded="3xl" shadow="lg" p={4}>
          <Box pb={2}>
            <HStack justify="space-between" align="center">
              <Heading size="md" color="gray.800">
                연체 통계
              </Heading>

              <Select.Root
                size="sm"
                variant="outline"
                width="120px"
                collection={PERIODS}
                value={period}
                onValueChange={(e) => setPeriod(e.value)}
                positioning={{ sameWidth: true }}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="기간" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {PERIODS.items.map((opt) => (
                        <Select.Item item={opt} key={opt.value}>
                          {opt.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </HStack>
          </Box>

          <Chart.Root height="300px" chart={barChart}>
            <BarChart data={barChart.data}>
              <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis
                axisLine={false}
                tickLine={false}
                dataKey={barChart.key('month')}
                fontSize={12}
              />
              {/* Y축은 횟수이므로 자동 스케일 */}
              <YAxis axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip cursor={false} animationDuration={100} content={<Chart.Tooltip />} />
              {barChart.series.map((s) => (
                <Bar
                  isAnimationActive={false}
                  key={s.name}
                  dataKey={barChart.key(s.name)}
                  fill={s.color}
                  stackId={s.stackId}
                  radius={[0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </Chart.Root>

          {/* 범례 */}
          <HStack justify="center" gap={4} mt={4} flexWrap="wrap">
            {barChart.series.map((s) => (
              <HStack key={s.name} gap={1}>
                <Box w={3} h={3} rounded="full" bg={s.color} />
                <Text fontSize="xs" color="gray.600">
                  {s.name}
                </Text>
              </HStack>
            ))}
          </HStack>
        </Box>

        <Box h={20} />
      </VStack>
    </Box>
  );
};

export default AdminReportsPage;
