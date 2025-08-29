import React from 'react';
import { Box, VStack, HStack, Image, Button, CloseButton, Portal } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

interface SideMenuProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean; // 외부에서 상태 제어
  onClose: () => void;
  // 필요한 props들을 여기에 추가
  logoSrc?: string;
  onLogoClick?: () => void;
  onLogout?: () => void;
  // 추가 메뉴 항목들
  menuItems?: Array<{
    label: string;
    onClick: () => void;
    color?: string;
  }>;
  // 하단 액션 버튼들
  bottomActions?: Array<{
    label: string;
    onClick: () => void;
    color?: string;
    condition?: boolean; // 조건부 렌더링을 위한 속성
  }>;
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
  //   const [isOpen, setIsOpen] = useState(false);

  const handleLogoClick = () => {
    onLogoClick?.();
    onClose();
  };

  const handleMenuClick = (onClick: () => void) => {
    onClick();
    onClose();
  };

  return (
    <>
      {/* 메뉴 열기 버튼 */}
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
              justifyContent="space-between"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.25 }}
            >
              {/* 상단 영역 */}
              <VStack align="stretch" gap={4} p={4}>
                {/* 헤더 */}
                <HStack justify="space-between">
                  <HStack gap={2}>
                    {logoSrc && (
                      <Box
                        as="button"
                        onClick={handleLogoClick}
                        cursor="pointer"
                        aria-label="메인으로 이동"
                      >
                        <Image src={logoSrc} alt="로고" h="40px" />
                      </Box>
                    )}
                    {!logoSrc && onLogoClick && (
                      <Button
                        variant="ghost"
                        onClick={handleLogoClick}
                        fontWeight="bold"
                        fontSize="lg"
                      >
                        홈
                      </Button>
                    )}
                  </HStack>
                  <CloseButton
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onClose();
                    }}
                  />
                </HStack>

                {/* 메뉴 항목들 */}
                <VStack align="stretch" gap={1}>
                  {menuItems.map((item, index) => (
                    <Button
                      key={index}
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
              </VStack>

              {/* 하단 액션 버튼 그룹 */}
              <VStack align="stretch" px={4} pb={6}>
                {/* 로그아웃 버튼 */}
                {onLogout && (
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    color="red.500"
                    onClick={() => handleMenuClick(onLogout)}
                  >
                    로그아웃
                  </Button>
                )}

                {/* 추가 하단 액션들 */}
                {bottomActions
                  .filter((action) => action.condition !== false) // condition이 false가 아닌 것만 표시
                  .map((action, index) => (
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
            </MotionBox>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideMenu;
