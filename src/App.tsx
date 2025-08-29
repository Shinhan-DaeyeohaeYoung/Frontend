import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from '@/components/Layout/AppLayout'; // ✅ @/ 경로 사용
import AppRoutes from '@/routes';
import './App.css';

function App() {
  return (
    <Router>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </Router>
  );
}

export default App;
