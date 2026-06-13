import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

// Layouts
import CandidateLayout from '@/layouts/CandidateLayout';
import RecruiterLayout from '@/layouts/RecruiterLayout';

// Public pages
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';

// Candidate pages
import JobFeed from '@/pages/JobFeed';
import SavedJobs from '@/pages/SavedJobs';
import MyApplications from '@/pages/MyApplications';
import CandidateProfile from '@/pages/CandidateProfile';

// Recruiter pages
import RecruiterDashboard from '@/pages/RecruiterDashboard';
import JobPost from '@/pages/JobPost';
import EditJob from '@/pages/EditJob';
import KanbanBoard from '@/pages/KanbanBoard';
import RecruiterProfile from '@/pages/RecruiterProfile';

/* ── Guards ────────────────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { isLoaded, userId } = useUser();
  if (!isLoaded) return <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner spinner-lg" /></div>;
  if (!userId) return <Navigate to="/sign-in" replace />;
  return children;
}

function RoleRoute({ role, children }) {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (!user) return <Navigate to="/sign-in" replace />;
  const userRole = user.publicMetadata?.role || '';
  if (!userRole) return <Navigate to="/register" replace />;
  if (userRole === role) return children;
  return <Navigate to={userRole === 'recruiter' ? '/recruiter/dashboard' : '/candidate/feed'} replace />;
}

/* ── App ───────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate area */}
        <Route
          path="/candidate"
          element={
            <ProtectedRoute>
              <RoleRoute role="candidate">
                <CandidateLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="feed" replace />} />
          <Route path="feed" element={<JobFeed />} />
          <Route path="saved" element={<SavedJobs />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="profile" element={<CandidateProfile />} />
        </Route>

        {/* Recruiter area */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <RecruiterLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="post" element={<JobPost />} />
          <Route path="jobs/:id/edit" element={<EditJob />} />
          <Route path="kanban/:jobId" element={<KanbanBoard />} />
          <Route path="profile" element={<RecruiterProfile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
