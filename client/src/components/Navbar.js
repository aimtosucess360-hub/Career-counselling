import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    close();
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand navbar-brand-custom" to="/" onClick={close}>
          <i className="bi bi-mortarboard-fill me-2"></i>AIM <span>360°</span>
        </Link>

        {/* Mobile Toggle */}
        <button className="navbar-toggler border-0" type="button"
          onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'} text-white fs-4`}></i>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">

            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/" onClick={close}>
                <i className="bi bi-house me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/careers')}`} to="/careers" onClick={close}>
                <i className="bi bi-briefcase me-1"></i>Careers
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/youtube')}`} to="/youtube" onClick={close}>
                <i className="bi bi-youtube me-1"></i>Videos
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/join-counselling')}`} to="/join-counselling" onClick={close}>
                <i className="bi bi-people me-1"></i>Counselling
              </Link>
            </li>

            {user ? (
              /* ── LOGGED-IN STATE ────────────────────────── */
              <>
                {/* Dashboard link — admin goes to /admin, user goes to /dashboard */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive(user.isAdmin ? '/admin' : '/dashboard')}`}
                    to={user.isAdmin ? '/admin' : '/dashboard'}
                    onClick={close}
                    style={user.isAdmin ? { color: '#f59e0b' } : {}}
                  >
                    <i className={`bi ${user.isAdmin ? 'bi-shield-fill-check' : 'bi-grid'} me-1`}
                      style={user.isAdmin ? { color: '#f59e0b' } : {}}></i>
                    <span style={user.isAdmin ? { color: '#f59e0b' } : {}}>
                      {user.isAdmin ? 'Admin' : 'Dashboard'}
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/profile')}`} to="/profile" onClick={close}>
                    <i className="bi bi-person-circle me-1"></i>{user.name.split(' ')[0]}
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <button className="btn btn-navbar-cta nav-link" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            ) : (
              /* ── GUEST STATE ─────────────────────────────── */
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/login')}`} to="/login" onClick={close}>
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-navbar-cta nav-link" to="/register" onClick={close}>
                    <i className="bi bi-person-plus me-1"></i>Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
