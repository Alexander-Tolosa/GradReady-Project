import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignUpPage from './pages/Auth/SignUpPage';
import Dashboard from './pages/Student/Dashboard';
import { authService } from './services/authService';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });

    const { data: { subscription } } = authService.onAuthStateChange((_event, s) => {
      setSession(s);
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

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!session ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!session ? <SignUpPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={session ? <Dashboard session={session} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
