// src/components/layout/AppHeader.tsx
import { Flex, IconButton, Box } from '@chakra-ui/react';
import { BiMenu, BiArrowBack, BiQr, BiHome } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

// HeaderFrame 타입 - 사용자 요구사항에 맞게 수정
type HeaderFrame = 'user' | 'user-back' | 'admin' | 'admin-back';

interface AppHeaderProps {
  frame: HeaderFrame;
  onMenuClick?: () => void;
  onBackClick?: () => void;
  onQRClick?: () => void;
  onHomeClick?: () => void;
}

export default function AppHeader({
  frame,
  onMenuClick,
  onBackClick,
  onQRClick,
  onHomeClick,
}: AppHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      console.log('메뉴 클릭');
    }
  };

  const handleQRClick = () => {
    if (onQRClick) {
      onQRClick();
    } else {
      navigate('/admin/qr');
    }
  };

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      navigate('/rent');
    }
  };

  return (
    <Flex
      as="header"
      align="center"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      bg="white/80"
      position="sticky"
      p={2}
      zIndex={10}
      backdropFilter="blur(8px)"
      transition="all 0.2s"
      _dark={{
        bg: 'blackAlpha.700',
        borderBottomColor: 'gray.700',
      }}
    >
      {/* 왼쪽 버튼 */}
      <Box w="40px" display="flex" justifyContent="flex-start">
        {frame === 'user-back' && (
          <IconButton
            aria-label="뒤로가기"
            variant="ghost"
            size="sm"
            colorScheme="gray"
            onClick={handleBackClick}
          >
            <BiArrowBack size={20} />
          </IconButton>
        )}
        {frame === 'admin-back' && (
          <IconButton
            aria-label="뒤로가기"
            variant="ghost"
            size="sm"
            colorScheme="gray"
            onClick={handleBackClick}
          >
            <BiArrowBack size={20} />
          </IconButton>
        )}
      </Box>

      {/* 중앙 여백 */}
      <Box flex={1} />

      {/* 오른쪽 버튼들 */}
      <Box display="flex" gap={2}>
        {/* QR 코드 버튼 - 관리자 버전에만 표시 */}
        {(frame === 'admin' || frame === 'admin-back') && (
          <IconButton
            aria-label="QR 스캔"
            variant="ghost"
            size="sm"
            colorScheme="gray"
            onClick={handleQRClick}
          >
            <BiQr size={20} />
          </IconButton>
        )}
        {/* 홈 버튼 - 모든 버전에 표시 */}
        <IconButton
          aria-label="홈"
          variant="ghost"
          size="sm"
          colorScheme="gray"
          onClick={handleHomeClick}
        >
          <BiHome size={20} />
        </IconButton>

        {/* 햄버거 메뉴 버튼 - 모든 버전에 표시 */}
        <IconButton
          aria-label="메뉴"
          variant="ghost"
          size="sm"
          colorScheme="gray"
          onClick={handleMenuClick}
        >
          <BiMenu size={20} />
        </IconButton>
      </Box>
    </Flex>
  );
}
