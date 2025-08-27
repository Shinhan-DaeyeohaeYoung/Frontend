import type { Meta, StoryObj } from '@storybook/react';
import { Flex, Text } from '@chakra-ui/react';
import SideMenu from './SideMenu';

/**
 * ## SideMenu 컴포넌트
 *
 * 앱의 주요 탐색을 담당하는 사이드 메뉴(Drawer) 컴포넌트입니다.
 * 햄버거 아이콘 버튼을 클릭하면 메뉴가 나타납니다.
 */
const meta: Meta<typeof SideMenu> = {
  title: 'Layout/SideMenu',
  component: SideMenu,
  tags: ['autodocs'],
  parameters: {
    // 실제 사용될 때처럼 페이지의 전체 화면에서 어떻게 보이는지 확인하기 좋습니다.
    layout: 'fullscreen',
  },
  decorators: [
    // (가장 중요) SideMenu는 Chakra UI에 의존하므로, ChakraProvider로 감싸주어야 합니다.
    // 이렇게 하지 않으면 스타일이 모두 깨져서 보입니다.
    (Story) => (
      <Flex as="header" align="center" justify="space-between" p={4} bg="gray.50" boxShadow="sm">
        {/* Story() 함수가 SideMenu 컴포넌트를 렌더링합니다. */}
        <Story />
        <Text fontWeight="bold">My Application</Text>
        {/* 오른쪽 공간을 맞추기 위한 빈 Box */}
        <Flex w="48px" />
      </Flex>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// SideMenu 컴포넌트의 기본 상태를 보여주는 스토리입니다.
export const Default: Story = {
  // SideMenu는 자체적으로 모든 상태를 관리하고 외부에서 받는 props가 없으므로
  // args는 비워둡니다.
  args: {},
};
