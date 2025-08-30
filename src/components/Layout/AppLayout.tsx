import type { PropsWithChildren } from 'react';
import { Box, Grid, GridItem, Text, Container, Portal } from '@chakra-ui/react';
import { Outlet, useLocation, matchPath, useNavigate } from 'react-router-dom';
import bgImage from '@/assets/imgs/profile_bg.png';
import { useRef, useState } from 'react';
import { useModalStore } from '@/stores/modalStore';
import { useAuthStore } from '@/stores/authStore';
import Modal from '@/components/Modal/Modal';
import AppHeader from '@/components/Layout/AppHeader';
import SideMenu from '@/components/Layout/SideMenu';
import main_logo_sm from '@/assets/imgs/main_logo_sm.png';

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
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const {
    isModalOpen,
    modalTitle,
    modalCaption,
    modalBody,
    modalFooter,
    modalFullscreen,
    closeModal,
  } = useModalStore();

  // 인증 상태 가져오기
  const { user } = useAuthStore();

  // 사이드메뉴 상태
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  // 현재 경로에 따른 헤더 프레임 결정
  const headerFrame = getHeaderFrame(pathname);

  // SideMenu 메뉴 항목들 정의
  const userMenuItems = [
    {
      label: '대여해요',
      onClick: () => navigate('/rent'),
      category: '서비스',
      color: 'accent.500',
    },
    {
      label: 'QR 스캔',
      onClick: () => navigate('/qr/scan'),
      category: '서비스',
      color: 'blue.500',
    },

    // { label: 'My 대학교 랭킹', onClick: () => navigate('/ranking'), category: '마이페이지' },
    {
      label: '계좌 이체 내역',
      onClick: () => navigate('/mypage/account'),
      category: '마이페이지',
    },
    { label: '대여 내역', onClick: () => navigate('/mypage/rent-history'), category: '마이페이지' },
    {
      label: '예약 내역',
      onClick: () => navigate('/mypage/reservation-queue'),
      category: '마이페이지',
    },
    {
      label: '전국 학교 랭킹',
      onClick: () => navigate('/mypage/university'),
      category: '마이페이지',
    },

    { label: '반납 승인', onClick: () => navigate('/admin'), category: '관리자' },
    { label: '물품 등록', onClick: () => navigate('/admin/overview'), category: '관리자' },
    { label: '운영 계좌 관리', onClick: () => navigate('/admin/account'), category: '관리자' },
    { label: '물품 대여 보고서', onClick: () => navigate('/admin/reports'), category: '관리자' },
  ];

  // ❌ 하단 액션 제거 (관리자 모드 버튼 삭제)
  const bottomActions: Array<never> = [];

  const handleMenuClick = () => setIsSideMenuOpen(true);
  const handleLogoClick = () => navigate('/');
  const handleLogout = () => {
    // console.log('로그아웃');
    // authStore에서 로그아웃 처리
    useAuthStore.getState().logout();
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
            bg="white" // 미세한 흰색
            // bg="#fafaf8" // 미세한 흰색
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
              {/* 헤더 */}
              {headerFrame !== 'none' && (
                <AppHeader frame={headerFrame} onMenuClick={handleMenuClick} />
              )}

              {/* 사이드메뉴 */}
              <SideMenu
                containerRef={containerRef}
                isOpen={isSideMenuOpen}
                onClose={() => setIsSideMenuOpen(false)}
                onLogoClick={handleLogoClick}
                onLogout={handleLogout}
                menuItems={userMenuItems}
                bottomActions={bottomActions} // 빈 배열 전달
                logoSrc={main_logo_sm}
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
