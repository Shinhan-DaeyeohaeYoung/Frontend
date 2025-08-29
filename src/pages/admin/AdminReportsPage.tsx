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

const PERIODS = createListCollection({
  items: [
    { label: '1 month', value: '1m' },
    { label: '3 months', value: '3m' },
    { label: '6 months', value: '6m' },
    { label: '1 year', value: '1y' },
  ],
});

const AdminReportsPage = () => {
  // 기간 선택 상태 (Select는 배열 형태의 value를 사용)
  const [period, setPeriod] = React.useState<string[]>(['3m']);

  // 도넛 차트 데이터 (대여 현황)
  const rentalData = [
    { name: '충전기', value: 5000, color: 'purple.solid' },
    { name: '공학용계산기', value: 3000, color: 'pink.solid' },
    { name: '고데기', value: 2000, color: 'blue.solid' },
    { name: '우산', value: 1000, color: 'orange.solid' },
  ];

  // 바 차트 데이터 (월별 연체 현황)
  const overdueData = [
    { month: '4월', 충전기: 150, 공학용계산기: 100, 고데기: 450, 우산: 0 },
    { month: '5월', 충전기: 120, 공학용계산기: 80, 고데기: 450, 우산: 0 },
    { month: '6월', 충전기: 100, 공학용계산기: 60, 고데기: 400, 우산: 20 },
    { month: '7월', 충전기: 80, 공학용계산기: 50, 고데기: 350, 우산: 0 },
    { month: '8월', 충전기: 60, 공학용계산기: 40, 고데기: 300, 우산: 0 },
    { month: '9월', 충전기: 50, 공학용계산기: 30, 고데기: 220, 우산: 0 },
  ];

  const donutChart = useChart({
    data: rentalData,
  });

  const barChart = useChart({
    data: overdueData,
    series: [
      { name: '충전기', color: 'purple.solid', stackId: 'a' },
      { name: '공학용계산기', color: 'pink.solid', stackId: 'a' },
      { name: '고데기', color: 'blue.solid', stackId: 'a' },
      { name: '우산', color: 'orange.solid', stackId: 'a' },
    ],
  });

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" p={4}>
      <VStack gap={6} align="stretch" maxW="400px" mx="auto">
        {/* 헤더 */}
        <HStack justify="space-between" align="center" color="white" pt={4}>
          <Text fontSize="2xl" fontWeight="bold">
            참고해요
          </Text>
          <Box w="60px" h="40px" bg="white" rounded="md" opacity={0.3} />
        </HStack>

        {/* 대여 현황 도넛 차트 */}
        <Box bg="white" rounded="3xl" shadow="lg" p={4}>
          <Box pb={2}>
            <HStack justify="space-between" align="center">
              <Heading size="md" color="gray.800">
                대여
              </Heading>

              {/* ✅ Chakra v3 Select (공식문서 방식) */}
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

          <Box>
            <VStack gap={4}>
              {/* 날짜 범위 */}
              <Text fontSize="sm" color="gray.600" alignSelf="start">
                23.10 ~ 23.12
              </Text>

              {/* 도넛 차트 */}
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
                        <Chart.RadialText viewBox={viewBox} title="10,000원" description="총액" />
                      )}
                    />
                    {donutChart.data.map((item) => (
                      <Cell key={item.name} fill={donutChart.color(item.color)} />
                    ))}
                  </Pie>
                </PieChart>
              </Chart.Root>

              {/* 범례와 수치 */}
              <VStack gap={2} w="full">
                {rentalData.map((item, index) => (
                  <HStack key={item.name} justify="space-between" w="full">
                    <HStack gap={2}>
                      <Box
                        w={3}
                        h={3}
                        rounded="full"
                        bg={['#9F7AEA', '#ED64A6', '#3182CE', '#DD6B20'][index]}
                      />
                      <Text fontSize="sm" color="gray.600">
                        {item.name}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="medium" color="gray.800">
                      {item.value.toLocaleString()}원
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Box>
        </Box>

        {/* 연체 현황 바 차트 */}
        <Box bg="white" rounded="3xl" shadow="lg" p={4}>
          <Box pb={2}>
            <HStack justify="space-between" align="center">
              <Heading size="md" color="gray.800">
                연체
              </Heading>

              {/* ✅ 같은 Select 컴포지션 재사용 */}
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

          <Box>
            <Chart.Root height="300px" chart={barChart}>
              <BarChart data={barChart.data}>
                <CartesianGrid stroke={barChart.color('border.muted')} vertical={false} />
                <XAxis
                  axisLine={false}
                  tickLine={false}
                  dataKey={barChart.key('month')}
                  fontSize={12}
                />
                <YAxis axisLine={false} tickLine={false} fontSize={12} domain={[0, 1000]} />
                <Tooltip cursor={false} animationDuration={100} content={<Chart.Tooltip />} />
                {barChart.series.map((item) => (
                  <Bar
                    isAnimationActive={false}
                    key={item.name}
                    dataKey={barChart.key(item.name)}
                    fill={barChart.color(item.color)}
                    stackId={item.stackId}
                    radius={[0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            </Chart.Root>

            {/* 바 차트 범례 */}
            <HStack justify="center" gap={4} mt={4} flexWrap="wrap">
              {barChart.series.map((item) => (
                <HStack key={item.name} gap={1}>
                  <Box
                    w={3}
                    h={3}
                    rounded="full"
                    bg={
                      item.color === 'purple.solid'
                        ? 'purple.400'
                        : item.color === 'pink.solid'
                        ? 'pink.400'
                        : item.color === 'blue.solid'
                        ? 'blue.400'
                        : 'orange.400'
                    }
                  />
                  <Text fontSize="xs" color="gray.600">
                    {item.name}
                  </Text>
                </HStack>
              ))}
            </HStack>
          </Box>
        </Box>

        {/* 하단 네비게이션 표시 영역 */}
        <Box h={20} />
      </VStack>
    </Box>
  );
};

export default AdminReportsPage;
