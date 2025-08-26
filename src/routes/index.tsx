import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import MainPage from '@/pages/MainPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import RequestsPage from '@/pages/RequestsPage';
import QrScanPage from '@/pages/qr/QrScanPage';
import NotificationsPage from '@/pages/NotificationsPage';
import RankingPage from '@/pages/RankingPage';
import AccountPage from '@/pages/AccountPage';
import AdminMainPage from '@/pages/admin/AdminMainPage';
import AdminOverviewPage from '@/pages/admin/AdminOverviewPage';
import AdminQrPage from '@/pages/admin/AdminQrPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminAccountPage from '@/pages/admin/AdminAccountPage';
import RentPage from '@/pages/rent/RentPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 공개 페이지 */}
      <Route path="/" element={<HomePage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 사용자 페이지 */}
      <Route path="/rent" element={<RentPage />} />
      <Route path="/requests" element={<RequestsPage />} />
      <Route path="/qr/scan" element={<QrScanPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/account" element={<AccountPage />} />

      {/* 관리자 페이지 */}
      <Route path="/admin" element={<AdminMainPage />} />
      <Route path="/admin/overview" element={<AdminOverviewPage />} />
      <Route path="/admin/qr" element={<AdminQrPage />} />
      <Route path="/admin/reports" element={<AdminReportsPage />} />
      <Route path="/admin/account" element={<AdminAccountPage />} />
    </Routes>
  );
}
