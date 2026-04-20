import React, { useState, useEffect } from 'react';
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

export default function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // ← NEW: surface errors to UI

  useEffect(() => {
    let cancelled = false;  // ← NEW: prevent stale state updates on unmount

    async function initializeSession() {
      try {
        const s = await authService.getSession();
        if (cancelled) return;

        setSession(s);

        if (s?.user?.id) {
          const role = await authService.getUserRole(s.user.id);
          if (cancelled) return;
          setUserRole(role);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to get session', err);
          setError('Failed to load session. Please refresh the page.');  // ← NEW
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initializeSession();

    const { data: { subscription } } = authService.onAuthStateChange(async (_event, s) => {
      if (cancelled) return;  // ← NEW: guard here too
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
      cancelled = true;       // ← NEW: cancel on unmount
      subscription.unsubscribe();
    };
  }, []);

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#111114] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-zinc-500 underline hover:text-zinc-300 transition-colors"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#111114] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-maroon border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Loading GradReady...</p>
        </div>
      </div>
    );
  }

  // ── Role-based dashboard redirect helper ──────────────────────────────────────
  const getDashboardPath = () => {
    if (!userRole) return '/';
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'faculty') return '/faculty/dashboard';
    return '/dashboard';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Role select / home */}
        <Route path="/" element={!session ? <RoleSelectPage /> : <Navigate to={getDashboardPath()} replace />} />

        {/* Student Auth */}
        <Route path="/login"  element={!session ? <LoginPage />  : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/signup" element={!session ? <SignUpPage /> : <Navigate to={getDashboardPath()} replace />} />

        {/* Admin Auth */}
        <Route path="/admin/login"  element={!session ? <AdminLoginPage />  : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/admin/signup" element={!session ? <AdminSignUpPage /> : <Navigate to={getDashboardPath()} replace />} />

        {/* Faculty Auth */}
        <Route path="/faculty/login"  element={!session ? <FacultyLoginPage />  : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/faculty/signup" element={!session ? <FacultySignUpPage /> : <Navigate to={getDashboardPath()} replace />} />

        {/* Dashboards — role-protected */}
        <Route
          path="/dashboard"
          element={
            session && userRole === 'student'
              ? <Dashboard session={session} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            session && userRole === 'admin'
              ? <AdminDashboard session={session} />
              : <Navigate to="/admin/login" replace />
          }
        />
        <Route
          path="/faculty/dashboard"
          element={
            session && userRole === 'faculty'
              ? <FacultyDashboard session={session} />
              : <Navigate to="/faculty/login" replace />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

