import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';
import AppHeader from './AppHeader';

const meta: Meta<typeof AppHeader> = {
  title: 'Layout/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '앱의 상단 헤더 컴포넌트입니다. 일반 사용자와 관리자를 위한 다양한 버전을 제공합니다.',
      },
    },
  },
  argTypes: {
    frame: {
      control: { type: 'select' },
      options: ['user', 'user-back', 'admin', 'admin-back'],
      description: '헤더의 버전을 결정합니다',
    },
    onMenuClick: {
      action: '메뉴 클릭됨',
      description: '햄버거 메뉴 버튼 클릭 시 호출되는 콜백 함수',
    },
    onBackClick: {
      action: '뒤로가기 클릭됨',
      description: '뒤로가기 버튼 클릭 시 호출되는 콜백 함수',
    },
    onQRClick: {
      action: 'QR 클릭됨',
      description: 'QR 스캔 버튼 클릭 시 호출되는 콜백 함수',
    },
    onHomeClick: {
      action: '홈 클릭됨',
      description: '홈 버튼 클릭 시 호출되는 콜백 함수',
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppHeader>;

// user: 일반 사용자 - 오른쪽에 홈과 햄버거 버튼
export const User: Story = {
  args: {
    frame: 'user',
  },
  parameters: {
    docs: {
      description: {
        story: '일반 사용자용 헤더입니다. 오른쪽에 홈 버튼과 햄버거 메뉴 버튼이 표시됩니다.',
      },
    },
  },
};

// user-back: 일반 사용자 + 뒤로가기 - 왼쪽에 뒤로가기, 오른쪽에 홈과 햄버거
export const UserBack: Story = {
  args: {
    frame: 'user-back',
  },
  parameters: {
    docs: {
      description: {
        story:
          '일반 사용자용 헤더입니다. 왼쪽에 뒤로가기 버튼, 오른쪽에 홈 버튼과 햄버거 메뉴 버튼이 표시됩니다.',
      },
    },
  },
};

// admin: 관리자 - 오른쪽에 홈, 햄버거, QR 코드
export const Admin: Story = {
  args: {
    frame: 'admin',
  },
  parameters: {
    docs: {
      description: {
        story:
          '관리자용 헤더입니다. 오른쪽에 홈 버튼, 햄버거 메뉴 버튼, QR 스캔 버튼이 표시됩니다.',
      },
    },
  },
};

// admin-back: 관리자 + 뒤로가기 - 왼쪽에 뒤로가기, 오른쪽에 홈, 햄버거, QR 코드
export const AdminBack: Story = {
  args: {
    frame: 'admin-back',
  },
  parameters: {
    docs: {
      description: {
        story:
          '관리자용 헤더입니다. 왼쪽에 뒤로가기 버튼, 오른쪽에 홈 버튼, 햄버거 메뉴 버튼, QR 스캔 버튼이 표시됩니다.',
      },
    },
  },
};

// 모든 버전을 한 번에 보여주는 스토리
export const AllVersions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3>User - 일반 사용자</h3>
        <AppHeader frame="user" />
      </div>
      <div>
        <h3>User-Back - 일반 사용자 + 뒤로가기</h3>
        <AppHeader frame="user-back" />
      </div>
      <div>
        <h3>Admin - 관리자</h3>
        <AppHeader frame="admin" />
      </div>
      <div>
        <h3>Admin-Back - 관리자 + 뒤로가기</h3>
        <AppHeader frame="admin-back" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 버전의 헤더를 한 번에 비교해볼 수 있습니다.',
      },
    },
  },
};

// 인터랙티브한 예제
export const Interactive: Story = {
  args: {
    frame: 'admin-back',
  },
  parameters: {
    docs: {
      description: {
        story: '버튼 클릭 시 콘솔에 로그가 출력되고 Actions 패널에서 이벤트를 확인할 수 있습니다.',
      },
    },
  },
};
