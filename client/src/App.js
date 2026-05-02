// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Navbar          from './components/Navbar';
// import Footer          from './components/Footer';
// import Home            from './pages/Home';
// import Careers         from './pages/Careers';
// import Login           from './pages/Login';
// import Register        from './pages/Register';
// import Profile         from './pages/Profile';
// import YouTube         from './pages/YouTube';
// import JoinCounselling from './pages/JoinCounselling';
// import AdminDashboard  from './pages/AdminDashboard';
// import UserDashboard   from './pages/UserDashboard';

// /* ── Loader ──────────────────────────────────────────────────────── */
// const Loader = () => (
//   <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
//     <div className="text-center">
//       <div className="spinner-custom mx-auto mb-3"></div>
//       <p className="text-muted">Loading...</p>
//     </div>
//   </div>
// );

// /* ── Protected: must be logged in ────────────────────────────────── */
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
//   if (loading) return <Loader />;
//   return user ? children : <Navigate to="/login" replace />;
// };

// /* ── Admin only ──────────────────────────────────────────────────── */
// const AdminRoute = ({ children }) => {
//   const { user, loading } = useAuth();
//   if (loading) return <Loader />;
//   if (!user)         return <Navigate to="/login"  replace />;
//   if (!user.isAdmin) return <Navigate to="/dashboard" replace />;
//   return children;
// };

// /* ── Guest only (redirect logged-in users away from auth pages) ──── */
// const GuestRoute = ({ children }) => {
//   const { user, loading } = useAuth();
//   if (loading) return <Loader />;
//   if (user) return <Navigate to={user.isAdmin ? '/admin' : '/dashboard'} replace />;
//   return children;
// };

// function AppContent() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         {/* Public pages */}
//         <Route path="/"                 element={<Home />} />
//         <Route path="/careers"          element={<Careers />} />
//         <Route path="/youtube"          element={<YouTube />} />
//         <Route path="/join-counselling" element={<JoinCounselling />} />

//         {/* Guest-only pages (redirect if logged in) */}
//         <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
//         <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

//         {/* User dashboard (logged-in, non-admin) */}
//         <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

//         {/* Profile (logged-in) */}
//         <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

//         {/* Admin dashboard */}
//         <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

//         {/* Catch-all */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// function App() {
//   return (
    
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }



// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar          from './components/Navbar';
import Footer          from './components/Footer';
import Home            from './pages/Home';
import Careers         from './pages/Careers';
import Login           from './pages/Login';
import Register        from './pages/Register';
import Profile         from './pages/Profile';
import YouTube         from './pages/YouTube';
import JoinCounselling from './pages/JoinCounselling';
import AdminDashboard  from './pages/AdminDashboard';
import UserDashboard   from './pages/UserDashboard';
import ResetPassword   from './pages/ResetPassword';

const Loader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
    <div className="text-center">
      <div className="spinner-border text-primary" style={{ width: 40, height: 40 }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted mt-3">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user)         return <Navigate to="/login"     replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to={user.isAdmin ? '/admin' : '/dashboard'} replace />;
  return children;
};

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"                          element={<Home />} />
        <Route path="/careers"                   element={<Careers />} />
        <Route path="/youtube"                   element={<YouTube />} />
        <Route path="/join-counselling"          element={<JoinCounselling />} />
        <Route path="/reset-password/:token"     element={<ResetPassword />} />

        {/* Guest-only */}
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

