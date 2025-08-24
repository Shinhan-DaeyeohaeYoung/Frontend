import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthRoutes from './AuthRoutes';
import RentalRoutes from './RentalRoutes';
import ProfileRoutes from './ProfileRoutes';
import AdminRoutes from './AdminRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 홈 페이지 */}
      <Route path="/" element={<HomePage />} />
      
      {/* 인증 라우트 */}
      <Route path="/auth/*" element={<AuthRoutes />} />
      
      {/* 대여 서비스 라우트 */}
      <Route path="/rental/*" element={<RentalRoutes />} />
      
      {/* 프로필 라우트 */}
      <Route path="/profile/*" element={<ProfileRoutes />} />
      
      {/* 관리자 라우트 */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
