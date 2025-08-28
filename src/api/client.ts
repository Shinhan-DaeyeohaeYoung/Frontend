import axios from 'axios';
// import { useAuth } from '@/stores/authStore';
/**
 * src/api/client.ts
 * axios 인스턴스 생성
 */

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  setAccessToken: (token: string) => localStorage.setItem('accessToken', token),
  removeAccessToken: () => localStorage.removeItem('accessToken'),
  clearTokens: () => localStorage.removeItem('accessToken'),
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '/api',
  timeout: 10000,
  withCredentials: true,
});

// 요청 인터셉터 (개발 모드에서만 콘솔 로그)
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken(); // [todo] 로그인시 토큰 처리 필요
  //   const token = useAuth.getState().tokens.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.log('[API REQUEST]', config.method?.toUpperCase(), config.url, config.data || '');
  }

  return config;
});

// 응답 인터셉터 (개발 모드 + 에러 핸들링)
api.interceptors.response.use(
  (res) => {
    if (import.meta.env.DEV) {
      console.log('[API RESPONSE]', res.config.url, res.data);
    }
    return res;
  },
  async (error) => {
    const { response } = error;
    // const originalRequest = error.config;

    // if (response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     // ✅ refresh 요청 (refreshToken은 HttpOnly 쿠키에서 자동 전송됨)
    //     const refreshRes = await api.post('/auth/refresh', {});
    //     const newAccessToken = refreshRes.data.accessToken;

    //     // ✅ Zustand에 저장
    //     useAuth.getState().setTokens({ accessToken: newAccessToken, refreshToken: null });

    //     // ✅ 실패했던 요청 재시도
    //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    //     return api(originalRequest);
    //   } catch (err) {
    //     // ✅ refresh 실패 → 로그아웃 후 로그인 페이지로 이동
    //     useAuth.getState().logout();
    //     window.location.href = '/login';
    //     return Promise.reject(err);
    //   }
    // }

    if (import.meta.env.DEV) {
      console.error('[API ERROR]', response?.config?.url, response?.data || error.message);
    }
    if (response?.status === 401) {
      tokenStorage.clearTokens();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 로그아웃 함수
export const logout = () => {
  tokenStorage.clearTokens();
  // 로그인 페이지로 리다이렉트
  window.location.href = '/login';
};
