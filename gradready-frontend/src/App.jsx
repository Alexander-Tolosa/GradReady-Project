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
import { authService } from './services/authService';

export default function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeSession() {
      try {
        const s = await authService.getSession();
        setSession(s);
        if (s?.user) {
          const role = await authService.getUserRole(s.user.id);
          setUserRole(role);
        }
      } catch (err) {
        console.error('Failed to get session', err);
      } finally {
        setLoading(false);
      }
    }
    initializeSession();

    const { data: { subscription } } = authService.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s?.user) {
        const role = await authService.getUserRole(s.user.id);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  // Dashboard routing helper based on role
  const getDashboardPath = () => {
    if (!userRole) return '/';
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'faculty') return '/faculty/dashboard';
    return '/dashboard'; // student default
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={!session ? <RoleSelectPage /> : <Navigate to={getDashboardPath()} replace />} />
        
        {/* Student Auth */}
        <Route path="/login" element={!session ? <LoginPage /> : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/signup" element={!session ? <SignUpPage /> : <Navigate to={getDashboardPath()} replace />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={!session ? <AdminLoginPage /> : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/admin/signup" element={!session ? <AdminSignUpPage /> : <Navigate to={getDashboardPath()} replace />} />

        {/* Faculty Auth */}
        <Route path="/faculty/login" element={!session ? <FacultyLoginPage /> : <Navigate to={getDashboardPath()} replace />} />
        <Route path="/faculty/signup" element={!session ? <FacultySignUpPage /> : <Navigate to={getDashboardPath()} replace />} />

        {/* Dashboards (Role protected) */}
        <Route 
          path="/dashboard" 
          element={session && userRole === 'student' ? <Dashboard session={session} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/admin/dashboard" 
          element={session && userRole === 'admin' ? <div className="text-white p-10">Admin Dashboard (Coming Soon)</div> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/faculty/dashboard" 
          element={session && userRole === 'faculty' ? <div className="text-white p-10">Faculty Dashboard (Coming Soon)</div> : <Navigate to="/faculty/login" replace />} 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
