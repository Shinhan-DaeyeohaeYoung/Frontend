import type { PropsWithChildren } from 'react';
import { Box, Grid, GridItem, Text, Container, Portal } from '@chakra-ui/react';
import { Outlet, useLocation, matchPath } from 'react-router-dom';
import bgImage from '@/assets/imgs/profile_bg.png';
import { useRef, useState } from 'react';
import { useModalStore } from '@/stores/modalStore';
import Modal from '@/components/Modal/Modal';
import AppHeader from '@/components/layout/AppHeader';
import { useNavigate } from 'react-router-dom';
import SideMenu from '@/components/layout/SideMenu';

// 헤더 프레임 타입 정의
type HeaderFrame = 'none' | 'user' | 'user-back' | 'admin' | 'admin-back';

// 라우터별 헤더 프레임 규칙
const frameRules: Array<{ frame: HeaderFrame; patterns: string[] }> = [
  {
    // 헤더 없음 - 로그인/회원가입/메인 페이지
    frame: 'none',
    patterns: ['/login', '/signup'],
  },
  {
    // 사용자 헤더 (뒤로가기 없음) - 홈/메인 기능들
    frame: 'user',
    patterns: ['/', '/main', '/rent', '/ranking', '/account'],
  },
  {
    // 사용자 헤더 (뒤로가기 있음) - 서브 페이지들
    frame: 'user-back',
    patterns: ['/requests', '/qr/scan', '/notifications'],
  },
  {
    // 관리자 헤더 (뒤로가기 없음) - 관리자 메인
    frame: 'admin',
    patterns: ['/admin'],
  },
  {
    // 관리자 헤더 (뒤로가기 있음) - 관리자 서브 페이지들
    frame: 'admin-back',
    patterns: ['/admin/overview', '/admin/qr', '/admin/reports', '/admin/account'],
  },
];

// 현재 경로에 따른 헤더 프레임 결정
const getHeaderFrame = (pathname: string): HeaderFrame => {
  for (const { frame, patterns } of frameRules) {
    if (patterns.some((pattern) => matchPath({ path: pattern, end: true }, pathname))) {
      return frame;
    }
  }
  // 기본값은 사용자 헤더
  return 'user';
};

function PcMent() {
  return <Text color="gray.500">안녕하세요</Text>;
}

function BackgroundLayer() {
  return (
    <Box
      aria-hidden
      role="presentation"
      position="fixed"
      inset={0}
      zIndex={0}
      pointerEvents="none"
      bgImage={`url(${bgImage})`}
      bgRepeat="repeat"
      bgSize="auto"
    />
  );
}

export default function AppLayout({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    isModalOpen,
    modalTitle,
    modalCaption,
    modalBody,
    modalFooter,
    modalFullscreen,
    closeModal,
  } = useModalStore();

  // SideMenu 상태 관리
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  // 현재 경로에 따른 헤더 프레임 결정
  const headerFrame = getHeaderFrame(pathname);

  // SideMenu 메뉴 항목들 정의
  const menuItems = [
    {
      label: '대여해요',
      onClick: () => navigate('/rent'),
    },
    {
      label: '내 대여 현황',
      onClick: () => navigate('/requests'),
    },
    {
      label: '알림',
      onClick: () => navigate('/notifications'),
    },
    {
      label: '랭킹',
      onClick: () => navigate('/ranking'),
    },
    {
      label: '내 계정',
      onClick: () => navigate('/account'),
    },
    {
      label: 'QR 스캔',
      onClick: () => navigate('/qr/scan'),
      color: 'blue.500',
    },
    {
      label: '마이페이지/내 계좌내역',
      onClick: () => navigate('/mypage/account'),
    },
    {
      label: '마이페이지/대여 내역',
      onClick: () => navigate('/mypage/rent-history'),
    },
    {
      label: '마이페이지/예약 중인 물품 목록',
      onClick: () => navigate('/mypage/reservation-queue'),
    },
    {
      label: '마이페이지/대학교 리더보드',
      onClick: () => navigate('/mypage/university'),
    },
  ];

  // SideMenu 하단 액션들 - 관리자인 경우에만 표시할 수 있도록
  const bottomActions = [
    {
      label: '관리자 모드',
      onClick: () => navigate('/admin'),
      color: 'purple.500',
      condition: pathname.includes('/admin') || true, // 조건에 맞게 수정하세요
    },
  ];

  // 메뉴 버튼 클릭 핸들러
  const handleMenuClick = () => {
    setIsSideMenuOpen(true);
  };
  // 로고 클릭 핸들러
  const handleLogoClick = () => {
    navigate('/');
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    // 실제 로그아웃 로직 구현
    console.log('로그아웃');
    navigate('/login');
  };

  return (
    <Box minH="100dvh" position="relative">
      <BackgroundLayer />

      <Grid
        position="relative"
        zIndex={1}
        templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        w="100%"
        h="100dvh"
      >
        <GridItem
          display={{ base: 'none', lg: 'flex' }}
          alignItems="center"
          justifyContent="flex-start"
        >
          <PcMent />
        </GridItem>

        {/* 앱 스크린 영역 */}
        <GridItem display="flex" justifyContent="center" alignItems="center" position="relative">
          {/* Portal로 모달을 앱 스크린 내부에 렌더링 */}
          <Portal container={containerRef}>
            <Modal
              open={isModalOpen}
              onClose={closeModal}
              title={modalTitle}
              caption={modalCaption}
              body={modalBody}
              footer={modalFooter}
              fullscreen={modalFullscreen}
            />
          </Portal>

          <Box
            ref={containerRef}
            position="relative"
            w="100%"
            maxW="520px"
            minW="375px"
            h="100dvh"
            overflow="hidden"
            bg="white"
            boxShadow={{ base: 'none', lg: 'lg' }}
            rounded={{ base: 'none', lg: '2xl' }}
          >
            <Container
              maxW="560px"
              w="full"
              h="100dvh"
              overflowY="auto"
              style={{ overscrollBehavior: 'contain' }}
              p={0}
            >
              {/* 헤더 조건부 렌더링 */}
              {headerFrame !== 'none' && (
                <AppHeader
                  frame={headerFrame}
                  // 필요한 경우 콜백 함수들을 props로 전달
                  onMenuClick={() => handleMenuClick()}
                  onBackClick={() => console.log('뒤로가기 클릭')}
                  onQRClick={() => console.log('QR 스캔 클릭')}
                  onHomeClick={() => console.log('홈 클릭')}
                />
              )}
              {/* SideMenu 컴포넌트 */}
              <SideMenu
                containerRef={containerRef}
                isOpen={isSideMenuOpen}
                onClose={() => setIsSideMenuOpen(false)}
                onLogoClick={handleLogoClick}
                onLogout={handleLogout}
                menuItems={menuItems}
                bottomActions={bottomActions}
                // logoSrc="/path/to/logo.png" // 로고가 있다면 추가
              />

              {/* 메인 콘텐츠 */}
              {children || <Outlet />}
            </Container>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
