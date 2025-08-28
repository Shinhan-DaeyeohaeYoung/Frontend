import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import AppRoutes from './routes';
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
