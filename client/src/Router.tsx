import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/dashboard';
import Login from './Pages/login';
import ResetPassword from './Pages/resetPassword';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRouter;
