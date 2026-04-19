import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.signIn(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111114] flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-dark via-[#111114] to-[#18181b]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-maroon/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-maroon/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Top */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/images/usa-seal.png" alt="USA Seal" className="w-10 h-10 rounded-xl object-contain" />
              <span className="text-white font-semibold text-lg">GradReady</span>
            </div>

            <Link to="/" className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Change Role
            </Link>
          </div>

          {/* Center */}
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
              Your graduation<br />
              clearance,<br />
              <span className="bg-gradient-to-r from-red-400 to-amber-300 bg-clip-text text-transparent">simplified.</span>
            </h1>
            <p className="text-zinc-400 mt-6 text-base leading-relaxed max-w-md">
              Track requirements, upload documents, and get cleared across all departments — all in one place.
            </p>

            {/* Stats row */}
            <div className="flex gap-8 mt-10">
              <div>
                <p className="text-2xl font-bold text-white">6</p>
                <p className="text-xs text-zinc-500 mt-0.5">Departments</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-zinc-500 mt-0.5">Digital</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-zinc-500 mt-0.5">Access</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <p className="text-zinc-600 text-xs">
            © 2026 University of San Agustin - GradReady. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile branding */}
          <div className="flex items-center justify-between mb-10 lg:hidden">
            <div className="flex items-center gap-3">
              <img src="/images/usa-seal.png" alt="USA Seal" className="w-10 h-10 rounded-xl object-contain" />
              <span className="text-white font-semibold text-lg">GradReady</span>
            </div>
            <Link to="/" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-zinc-500 text-sm mt-1.5">Sign in to your student portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-zinc-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@usa.edu.ph"
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-maroon focus:ring-1 focus:ring-maroon/50 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-zinc-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-maroon focus:ring-1 focus:ring-maroon/50 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  id="toggle-password-visibility"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-status-missing/10 border border-status-missing/20 rounded-xl px-4 py-3 text-sm text-status-missing animate-fade-in" id="login-error">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-maroon hover:bg-maroon-light text-white font-medium py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              id="login-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#27272a]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#111114] text-zinc-600">New to GradReady?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/signup"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#27272a] text-zinc-400 hover:text-white hover:border-[#3f3f46] text-sm font-medium transition-all"
            id="goto-signup-link"
          >
            Create your account
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
