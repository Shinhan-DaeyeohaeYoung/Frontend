import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  university: string;
  studentId: string;
  email: string;

  // 조직 이름 (기존 isAdmin 대신)
  admin: 'university' | 'college' | 'department' | 'none';

  // 상세 조직 정보
  info: {
    university: {
      id: number;
      name: string;
    } | null;
    college: {
      id: number;
      name: string;
    } | null;
    department: {
      id: number;
      name: string;
    } | null;
  };
}

interface AuthState {
  // 사용자 정보
  user: User | null;
  // 인증 상태
  isAuthenticated: boolean;
  // 로딩 상태
  isLoading: boolean;

  // 액션들
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // 사용자 정보 설정
      setUser: (user: User) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      // 사용자 정보 초기화
      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      // 로딩 상태 설정
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // 로그아웃
      logout: () => {
        // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem('accessToken');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage', // 로컬 스토리지 키
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // user와 isAuthenticated만 저장
    }
  )
);
