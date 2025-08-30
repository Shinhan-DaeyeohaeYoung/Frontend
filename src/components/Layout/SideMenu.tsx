// SideMenu.tsx
import React from 'react';
import { Box, VStack, HStack, Image, Button, CloseButton, Portal, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

const MotionBox = motion(Box);

interface MenuItem {
  label: string;
  onClick: () => void;
  color?: string;
  category?: string; // '서비스' | '마이페이지' | '관리자' | ...
}

interface BottomAction {
  label: string;
  onClick: () => void;
  color?: string;
  condition?: boolean;
  category?: string; // 선택: 관리자 전용 표시 등에 활용 가능
}

interface SideMenuProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onClose: () => void;

  logoSrc?: string;
  onLogoClick?: () => void;
  onLogout?: () => void;

  menuItems?: MenuItem[];
  bottomActions?: BottomAction[];
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  containerRef,
  logoSrc,
  onLogoClick,
  onLogout,
  menuItems = [],
  bottomActions = [],
}) => {
  const { user } = useAuthStore();
  const isAdmin = !!user && user.admin !== 'none';

  const handleLogoClick = () => {
    onLogoClick?.();
    onClose();
  };

  const handleMenuClick = (onClick: () => void) => {
    onClick();
    onClose();
  };

  // 1) 관리자 여부에 따라 메뉴 필터
  const filteredMenuItems = React.useMemo(() => {
    return (menuItems ?? []).filter((item) => {
      if (item.category === '관리자' && !isAdmin) return false;
      return true;
    });
  }, [menuItems, isAdmin]);

  // (선택) 하단 액션도 관리자 전용이 있다면 동일하게 필터
  const filteredBottomActions = React.useMemo(() => {
    return (bottomActions ?? []).filter((action) => {
      if (action.condition === false) return false;
      // 카테고리로 관리자 제한을 두고 싶다면:
      if (action.category === '관리자' && !isAdmin) return false;
      return true;
    });
  }, [bottomActions, isAdmin]);

  // 2) 필터된 메뉴를 카테고리별로 그룹핑
  const grouped = React.useMemo(() => {
    return filteredMenuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      const cat = item.category || '기타';
      (acc[cat] ||= []).push(item);
      return acc;
    }, {});
  }, [filteredMenuItems]);

  return (
    <>
      <AnimatePresence>
        {isOpen && containerRef.current && (
          <Portal container={containerRef}>
            {/* 백드롭 */}
            <MotionBox
              bg="blackAlpha.400"
              position="absolute"
              inset={0}
              zIndex="overlay"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* 드로어 */}
            <MotionBox
              position="absolute"
              top={0}
              right={0}
              w="280px"
              h="100dvh"
              bg="white"
              zIndex="modal"
              boxShadow="lg"
              display="flex"
              flexDirection="column"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.25 }}
            >
              {/* 상단/메뉴 스크롤 영역 */}
              <VStack align="stretch" gap={4} p={4} flex="1" overflowY="auto">
                {/* 헤더 */}
                <HStack justify="space-between">
                  <HStack gap={2}>
                    {logoSrc ? (
                      <Box
                        as="button"
                        onClick={handleLogoClick}
                        cursor="pointer"
                        aria-label="메인으로 이동"
                      >
                        <Image src={logoSrc} alt="로고" h="40px" />
                      </Box>
                    ) : (
                      onLogoClick && (
                        <Button
                          variant="ghost"
                          onClick={handleLogoClick}
                          fontWeight="bold"
                          fontSize="lg"
                        ></Button>
                      )
                    )}
                  </HStack>
                  <CloseButton variant="ghost" size="sm" onClick={onClose} />
                </HStack>

                {/* 카테고리 그룹 */}
                <VStack align="stretch" gap={4}>
                  {Object.entries(grouped).map(([category, items]) => (
                    <Box key={category}>
                      {/* 카테고리 헤더: 회색 배경 + 패딩 */}
                      <Box bg="gray.100" px={3} py={1} rounded="md" mb={2}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.600">
                          {category}
                        </Text>
                      </Box>

                      {/* 항목 리스트 */}
                      <VStack align="stretch" gap={1}>
                        {items.map((item, idx) => (
                          <Button
                            key={`${category}-${idx}`}
                            variant="ghost"
                            justifyContent="flex-start"
                            py={6}
                            color={item.color || 'gray.700'}
                            onClick={() => handleMenuClick(item.onClick)}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </VStack>

              {/* 하단 고정 영역: 구분선 + 우측 정렬 로그아웃 + 추가 액션 */}
              <Box borderTop="1px solid" borderColor="gray.200" px={4} py={3}>
                <HStack justify="flex-end">
                  {onLogout && (
                    <Button
                      variant="ghost"
                      color="gray.500"
                      onClick={() => handleMenuClick(onLogout)}
                    >
                      로그아웃
                    </Button>
                  )}
                </HStack>

                {filteredBottomActions.length > 0 && (
                  <VStack align="stretch" mt={2}>
                    {filteredBottomActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        justifyContent="flex-start"
                        py={6}
                        color={action.color || 'red.500'}
                        onClick={() => handleMenuClick(action.onClick)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </VStack>
                )}
              </Box>
            </MotionBox>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideMenu;
