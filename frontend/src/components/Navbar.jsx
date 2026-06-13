import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Bell, LogOut, ChevronDown, Briefcase } from 'lucide-react';
import useNotificationStore from '@/store/useNotificationStore';
import NotificationDrawer from './NotificationDrawer';
import { useEffect, useState, useRef } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { unreadCount, fetch: fetchNotifications, open, setOpen } = useNotificationStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const role = user?.publicMetadata?.role;

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => signOut(() => navigate('/'));

  const navLinks =
    role === 'recruiter'
      ? [
          { to: '/recruiter/dashboard', label: 'Dashboard' },
          { to: '/recruiter/post', label: 'Post Job' },
          { to: '/recruiter/profile', label: 'Profile' },
        ]
      : role === 'candidate'
      ? [
          { to: '/candidate/feed', label: 'Find Jobs' },
          { to: '/candidate/saved', label: 'Saved' },
          { to: '/candidate/applications', label: 'Applications' },
          { to: '/candidate/profile', label: 'Profile' },
        ]
      : [
          { to: '/employers', label: 'For Employers' },
          { to: '/candidates', label: 'For Candidates' },
        ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <Briefcase size={22} />
            <span>TalentBridge</span>
          </Link>

          {/* Nav links */}
          {navLinks.length > 0 && (
            <ul className="navbar-links">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          {/* Right side */}
          <div className="navbar-right">
            {isLoaded && user ? (
              <>
                {/* Notification bell */}
                <button
                  className="btn btn-ghost btn-icon navbar-bell"
                  onClick={() => setOpen(true)}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="navbar-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>

                {/* User menu */}
                <div className="navbar-user" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img
                    src={user.imageUrl}
                    alt={user.fullName}
                    className="navbar-avatar"
                  />
                  <span className="navbar-username">{user.firstName}</span>
                  <ChevronDown size={14} className="navbar-chevron" />
                  <div className={`navbar-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                    <button className="navbar-dropdown-item" onClick={handleSignOut}>
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="navbar-auth-links">
                <Link to="/sign-in" className="btn btn-ghost btn-sm">Sign in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <NotificationDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
