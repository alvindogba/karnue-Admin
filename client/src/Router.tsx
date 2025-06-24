import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/dashboard';
import Login from './Pages/login';
import ResetPassword from './Pages/resetPassword';
import ProtectedRoute from './Components/ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRouter;
