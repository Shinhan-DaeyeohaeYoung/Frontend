import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import './App.css';

// 임시 페이지 컴포넌트들
const HomePage = () => (
  <div style={{ padding: '20px' }}>
    <h1>홈페이지</h1>
    <p>AppLayout이 적용된 페이지입니다.</p>
  </div>
);

const AboutPage = () => (
  <div style={{ padding: '20px' }}>
    <h1>소개 페이지</h1>
    <p>다른 페이지도 동일한 레이아웃이 적용됩니다.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
