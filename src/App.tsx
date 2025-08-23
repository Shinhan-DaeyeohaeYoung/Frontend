import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

// ▼ 추가
import { Box, Grid, Text, Button, Stack, useBreakpointValue, Badge } from '@chakra-ui/react';

const AccentAndBreakpointTest = () => {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  const bp = useBreakpointValue({
    base: 'base (<375px)',
    xs: 'xs (≥375px)',
    mobile: 'mobile (≥520px)',
    md: 'md (≥768px)',
  });

  return (
    <Box mt={8} p={4} border="1px solid" borderColor="gray.200" rounded="2xl">
      <Stack direction="row" align="center" justify="space-between" mb={3}>
        <Text fontSize="xl" fontWeight="bold">
          Accent & Breakpoints Test
        </Text>
        <Badge variant="solid" colorPalette="accent">
          {bp}
        </Badge>
      </Stack>

      <Text fontSize="sm" color="fg.muted" mb={2}>
        아래 그리드는 <code>templateColumns</code>가 반응형으로 변합니다:
        <br />
        base=1열 → mobile=2열 → md=3열
      </Text>

      {/* 그리드: 반응형 브레이크포인트 테스트 */}
      <Grid
        templateColumns={{ base: '1fr', mobile: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
        gap={3}
        mb={4}
      >
        {shades.map((s) => (
          <Box
            key={s}
            bg={`accent.${s}`}
            color={s >= 500 ? 'white' : 'black'}
            rounded="xl"
            p={{ base: 3, mobile: 4, md: 5 }} // 패딩도 반응형
            border="1px solid"
            borderColor="blackAlpha.200"
          >
            <Text fontWeight="bold">accent.{s}</Text>
            <Text fontSize="sm" opacity={0.85}>
              bg="accent.{s}"
            </Text>
          </Box>
        ))}
      </Grid>

      <Stack direction={{ base: 'column', mobile: 'row' }} gap={3}>
        {/* v3: colorPalette로 스킴 지정 */}
        <Button colorPalette="accent" variant="solid">
          Button (solid)
        </Button>
        <Button colorPalette="accent" variant="outline">
          Button (outline)
        </Button>
        <Button colorPalette="accent" variant="ghost">
          Button (ghost)
        </Button>
      </Stack>
    </Box>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>

      {/* ▼ 여기 추가 */}
      <AccentAndBreakpointTest />
      {/* ---- Pretendard Variable 테스트 블록 ---- */}
      <hr style={{ margin: '24px 0' }} />
      <section
        style={{
          padding: 16,
          border: '1px solid #eee',
          borderRadius: 12,
          fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Pretendard Variable 테스트</h2>
        <p>가나다 ABC 123 — 아래 줄에서 굵기가 바뀌면 Variable 폰트 적용 OK</p>
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ fontWeight: 300 }}>weight 300</div>
          <div style={{ fontWeight: 400 }}>weight 400</div>
          <div style={{ fontWeight: 500 }}>weight 500</div>
          <div style={{ fontWeight: 700 }}>weight 700</div>
          <div style={{ fontWeight: 900 }}>weight 900</div>
        </div>
      </section>
      {/* -------------------------------------- */}
    </>
  );
}

export default App;
