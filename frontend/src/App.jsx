import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Home } from '@/pages/Home';
import { SignIn } from '@/pages/SignIn';
import Register from '@/pages/Register';
import { NotFound } from '@/pages/NotFound';
import { CandidateLayout } from '@/layouts/CandidateLayout';
import { RecruiterLayout } from '@/layouts/RecruiterLayout';
import JobFeed from '@/pages/JobFeed';
import JobPost from '@/pages/JobPost';
import KanbanBoard from '@/pages/KanbanBoard';
import RecruiterDashboard from '@/pages/RecruiterDashboard';

/* Protected Route – renders children only when signed in */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // or a spinner
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  return children;
}

/* Role based route – checks user role */
function RoleBasedRoute({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/sign-in" replace />;
  if (user.role === role) return children;
  // fallback – redirect based on actual role
  return <Navigate to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/feed'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* Candidate area */}
        <Route
          path="/candidate/*"
          element={
            <ProtectedRoute>
              <RoleBasedRoute role="candidate">
                <CandidateLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route path="feed" element={<JobFeed />} />
        </Route>

        {/* Recruiter area */}
        <Route
          path="/recruiter/*"
          element={
            <ProtectedRoute>
              <RoleBasedRoute role="recruiter">
                <RecruiterLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="post" element={<JobPost />} />
          <Route path="kanban/:jobId" element={<KanbanBoard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
