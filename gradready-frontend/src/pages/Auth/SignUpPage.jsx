import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, Hash, BookOpen, Calendar, Users, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

const PROGRAMS = [
  'BS Information Technology',
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = account, 2 = profile
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Account fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Profile fields
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [program, setProgram] = useState(PROGRAMS[0]);
  const [yearLevel, setYearLevel] = useState('4th Year');
  const [section, setSection] = useState('A');
  const [college, setCollege] = useState('College of Information Technology Education');

  const handleStep1 = (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.signUp(email, password, {
        name,
        student_id: studentId,
        program,
        college,
        year_level: yearLevel,
        section,
        semester: '2nd Semester, A.Y. 2024-2025',
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    if (password.length === 0) return { level: 0, label: '', color: '' };
    if (password.length < 6) return { level: 1, label: 'Weak', color: 'bg-status-missing' };
    if (password.length < 10) return { level: 2, label: 'Fair', color: 'bg-status-revision' };
    return { level: 3, label: 'Strong', color: 'bg-status-cleared' };
  })();

  return (
    <div className="min-h-screen bg-[#111114] flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-dark via-[#111114] to-[#18181b]" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-maroon/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-1/3 left-10 w-72 h-72 bg-maroon/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
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

          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
              Start your<br />
              clearance journey<br />
              <span className="bg-gradient-to-r from-red-400 to-amber-300 bg-clip-text text-transparent">today.</span>
            </h1>
            <p className="text-zinc-400 mt-6 text-base leading-relaxed max-w-md">
              Create your account to begin tracking your graduation requirements across all university departments.
            </p>

            {/* Steps indicator */}
            <div className="flex items-center gap-4 mt-10">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${step >= 1 ? 'bg-maroon text-white' : 'bg-[#27272a] text-zinc-500'}`}>1</div>
                <span className={`text-sm ${step >= 1 ? 'text-white' : 'text-zinc-500'}`}>Account</span>
              </div>
              <div className="w-8 h-px bg-[#27272a]" />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${step >= 2 ? 'bg-maroon text-white' : 'bg-[#27272a] text-zinc-500'}`}>2</div>
                <span className={`text-sm ${step >= 2 ? 'text-white' : 'text-zinc-500'}`}>Profile</span>
              </div>
            </div>
          </div>

          <p className="text-zinc-600 text-xs">
            © 2026 University of San Agustin - GradReady. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
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

          {/* Step indicator (mobile) */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className={`h-1 rounded-full flex-1 transition-colors ${step >= 1 ? 'bg-maroon' : 'bg-[#27272a]'}`} />
            <div className={`h-1 rounded-full flex-1 transition-colors ${step >= 2 ? 'bg-maroon' : 'bg-[#27272a]'}`} />
          </div>

          {/* STEP 1 — Account Details */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Create your account</h2>
                <p className="text-zinc-500 text-sm mt-1.5">Step 1 of 2 — Set up your login credentials</p>
              </div>

              <form onSubmit={handleStep1} className="space-y-5" id="signup-step1-form">
                <div>
                  <label htmlFor="signup-email" className="block text-xs font-medium text-zinc-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@usa.edu.ph"
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-maroon focus:ring-1 focus:ring-maroon/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-xs font-medium text-zinc-400 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-maroon focus:ring-1 focus:ring-maroon/50 outline-none transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength.level ? passwordStrength.color : 'bg-[#27272a]'}`} />
                        ))}
                      </div>
                      <span className="text-[11px] text-zinc-500">{passwordStrength.label}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="signup-confirm" className="block text-xs font-medium text-zinc-400 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      id="signup-confirm"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-maroon focus:ring-1 focus:ring-maroon/50 outline-none transition-all"
                    />
                    {confirmPassword && confirmPassword === password && (
                      <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-status-cleared" />
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-status-missing/10 border border-status-missing/20 rounded-xl px-4 py-3 text-sm text-status-missing animate-fade-in">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-maroon hover:bg-maroon-light text-white font-medium py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 group"
                  id="signup-next-btn"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2 — Student Profile */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Student profile</h2>
                <p className="text-zinc-500 text-sm mt-1.5">Step 2 of 2 — Tell us about yourself</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" id="signup-step2-form">
                <div>
                  <label htmlFor="signup-name" className="block text-xs font-medium text-zinc-400 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      id="signup-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-maroon focus:ring-1 focus:ring-maroon/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-student-id" className="block text-xs font-medium text-zinc-400 mb-2">Student ID</label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      id="signup-student-id"
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="2021-00123"
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-maroon focus:ring-1 focus:ring-maroon/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-program" className="block text-xs font-medium text-zinc-400 mb-2">Program</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <select
                      id="signup-program"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-maroon focus:ring-1 focus:ring-maroon/50 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {PROGRAMS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-year" className="block text-xs font-medium text-zinc-400 mb-2">Year Level</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <select
                      id="signup-year"
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-maroon focus:ring-1 focus:ring-maroon/50 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-section" className="block text-xs font-medium text-zinc-400 mb-2">Section</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <select
                      id="signup-section"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-maroon focus:ring-1 focus:ring-maroon/50 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {['A', 'B', 'C'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="bg-status-missing/10 border border-status-missing/20 rounded-xl px-4 py-3 text-sm text-status-missing animate-fade-in">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(null); }}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#27272a] text-zinc-400 hover:text-white hover:border-[#3f3f46] text-sm font-medium transition-all"
                    id="signup-back-btn"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-maroon hover:bg-maroon-light text-white font-medium py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    id="signup-submit-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#27272a]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#111114] text-zinc-600">Already registered?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#27272a] text-zinc-400 hover:text-white hover:border-[#3f3f46] text-sm font-medium transition-all"
            id="goto-login-link"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
