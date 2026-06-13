import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function RecruiterLayout() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-enter">
        <Outlet />
      </main>
    </div>
  );
}
