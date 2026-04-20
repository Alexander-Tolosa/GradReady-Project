import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignUpPage from './pages/Auth/SignUpPage';
import RoleSelectPage from './pages/Auth/RoleSelectPage';
import AdminLoginPage from './pages/Auth/AdminLoginPage';
import AdminSignUpPage from './pages/Auth/AdminSignUpPage';
import FacultyLoginPage from './pages/Auth/FacultyLoginPage';
import FacultySignUpPage from './pages/Auth/FacultySignUpPage';
import Dashboard from './pages/Student/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import FacultyDashboard from './pages/Faculty/Dashboard';
import { authService } from './services/authService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', backgroundColor: 'black', height: '100vh' }}>
          <h2>React Render Crash:</h2>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [session, setSession] = useState(undefined);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const currentUserId = useRef(null);



  useEffect(() => {
    let cancelled = false;

    async function initializeSession() {
      try {
        const s = await authService.getSession();
        if (cancelled) return;
        setSession(s);
        currentUserId.current = s?.user?.id || null;

        if (s?.user?.id) {
          const role = await authService.getUserRole(s.user.id);
          if (cancelled) return;
          setUserRole(role);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to get session', err);
          setError('Failed to load session. Please refresh the page.');
          setSession(null);
        }
      }
    }

    initializeSession();

    const { data: { subscription } } = authService.onAuthStateChange(async (_event, s) => {
      if (cancelled) return;

      const newUserId = s?.user?.id || null;

      // Skip re-fetching role if same user — prevents flash when switching tabs
      if (newUserId === currentUserId.current) return;

      currentUserId.current = newUserId;
      setSession(s);

      if (s?.user?.id) {
        try {
          const role = await authService.getUserRole(s.user.id);
          if (!cancelled) setUserRole(role);
        } catch (err) {
          console.error('Failed to fetch role on auth change:', err);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);



  if (error) {
    return (
      <div className="min-h-screen bg-[#111114] flex flex-col items-center justify-center p-6" style={{ color: 'red' }}>
        <p className="text-red-400 font-mono mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white text-black rounded">Refresh</button>
      </div>
    );
  }

  if (session === undefined) {
    return <div className="min-h-screen bg-[#111114]" />;
  }

  const getDashboardPath = () => {
    if (!userRole) return '/';
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'faculty') return '/faculty/dashboard';
    return '/dashboard';
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!session ? <RoleSelectPage /> : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/login" element={!session ? <LoginPage /> : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/signup" element={!session ? <SignUpPage /> : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/admin/login" element={!session ? <AdminLoginPage /> : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/admin/signup" element={!session ? <AdminSignUpPage /> : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/faculty/login" element={!session ? <FacultyLoginPage /> : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/faculty/signup" element={!session ? <FacultySignUpPage /> : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/dashboard" element={session && userRole === 'student' ? <Dashboard session={session} /> : <Navigate to="/login" replace />} />
        <Route path="/admin/dashboard" element={session && userRole === 'admin' ? <AdminDashboard session={session} /> : <Navigate to="/admin/login" replace />} />
        <Route path="/faculty/dashboard" element={session && userRole === 'faculty' ? <FacultyDashboard session={session} /> : <Navigate to="/faculty/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

