import { Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import ResetPassword from './Pages/resetPassword';
import AdminDashboard from './Pages/AdminDashboard';
import Riders from './Pages/Riders';
import Drivers from './Pages/Drivers';
import {Reservations} from './Pages/Reservations';
import Payments from './Pages/Payments';
import Reports from './Pages/Reports';
import Rides from './Pages/Rides';
import Settings from './Pages/Settings';
import FeedBack from './Pages/FeedBack';
import AdminLayout from './Components/AdminLayout';
import Waitlist from './Pages/waitlist';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin-dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/drivers" element={<AdminLayout><Drivers /></AdminLayout>} />
      <Route path="/riders" element={<AdminLayout><Riders /></AdminLayout>} />
      <Route path="/reservations" element={<AdminLayout><Reservations /></AdminLayout>} />
      <Route path="/payments" element={<AdminLayout><Payments /></AdminLayout>} />
      <Route path="/reports" element={<AdminLayout><Reports /></AdminLayout>} />
      <Route path="/rides" element={<AdminLayout><Rides /></AdminLayout>} />
      <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
      <Route path="/waitlist" element={<AdminLayout><Waitlist /></AdminLayout>} />
      <Route path="/feedback" element={<AdminLayout><FeedBack /></AdminLayout>} />
    </Routes>
  );
};

export default AppRouter;
