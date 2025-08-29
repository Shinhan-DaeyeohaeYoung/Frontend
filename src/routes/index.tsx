import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import MainPage from '@/pages/MainPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import RequestsPage from '@/pages/RequestsPage';
import QrScanPage from '@/pages/qr/QrScanPage';
import NotificationsPage from '@/pages/NotificationsPage';
import RankingPage from '@/pages/RankingPage';
import AccountPage from '@/pages/mypage/AccountPage';
import AdminMainPage from '@/pages/admin/AdminMainPage';
import AdminOverviewPage from '@/pages/admin/AdminOverviewPage';
import AdminQrPage from '@/pages/admin/AdminQrPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminAccountPage from '@/pages/admin/AdminAccountPage';
import AdminItemCreatePage from '@/pages/admin/AdminItemCreatePage';
import RentPage from '@/pages/rent/RentPage';
import ReturnListPage from '@/pages/return/ReturnListPage';
import ReturnPhotoPage from '@/pages/return/ReturnPhotoPage';
import AdminItemOverviewPage from '@/pages/admin/AdminUnitOverviewPage';
import ReservationQueuePage from '@/pages/mypage/ReservationQueuePage';
import RentHistoryPage from '@/pages/mypage/RentHistoryPage';
import UniversityPage from '@/pages/mypage/UniversityPage';
import AdminUnitCreatePage from '@/pages/admin/AdminUnitCreatePage';
import QrRentPage from '@/pages/qr/QrRentPage';
import QrReturnPage from '@/pages/qr/QrReturnPage';

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
      <Route path="/qr/rent" element={<QrRentPage />} />
      <Route path="/qr/return" element={<QrReturnPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/return" element={<ReturnListPage />} />
      <Route path="/return/:itemId/photo" element={<ReturnPhotoPage />} />
      <Route path="/mypage/account" element={<AccountPage />} />
      <Route path="/mypage/rent-history" element={<RentHistoryPage />} />
      <Route path="/mypage/reservation-queue" element={<ReservationQueuePage />} />
      <Route path="/mypage/university" element={<UniversityPage />} />

      {/* 관리자 페이지 */}
      <Route path="/admin" element={<AdminMainPage />} />
      <Route path="/admin/overview" element={<AdminOverviewPage />} />
      <Route path="/admin/overview/:itemId" element={<AdminItemOverviewPage />} />
      <Route path="/admin/items/create" element={<AdminItemCreatePage />} />
      <Route path="/admin/qr" element={<AdminQrPage />} />
      <Route path="/admin/reports" element={<AdminReportsPage />} />
      <Route path="/admin/account" element={<AdminAccountPage />} />
      <Route path="/admin/units/create" element={<AdminUnitCreatePage />} />
    </Routes>
  );
}
