import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircleIcon, UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export function RecruiterLayout() {
  const { logout } = useAuth();
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <nav className="w-64 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-primary">Recruiter</h2>
        <ul className="space-y-2">
          <li>
            <Link
              to="/recruiter/dashboard"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/recruiter/post"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <PlusCircleIcon size={18} />
              Post a Job
            </Link>
          </li>
        </ul>
        {/* Sign‑out button – replace with Clerk <SignOut/> later */}
        <div className="mt-auto pt-4">
          <Button variant="outline" className="w-full" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main content area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
