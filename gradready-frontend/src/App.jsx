import React, { useState, useEffect, useMemo } from 'react';
import { Building2, MapPin, GraduationCap, LogOut } from 'lucide-react';
import StudentHeader from './components/layout/StudentHeader';
import DepartmentCard from './components/common/DepartmentCard';
import ProgressOverview from './components/common/ProgressOverview';
import InfoDirectory from './components/common/InfoDirectory';
import UploadModal from './components/common/UploadModal';
import { authService } from './services/authService';
import { clearanceService } from './services/clearanceService';
import { storageService } from './services/storageService';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  const [studentData, setStudentData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [showDirectory, setShowDirectory] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [notification, setNotification] = useState(null);

  // Auth Forms State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    authService.getSession().then((session) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    try {
      setLoading(true);
      await clearanceService.initializeStudentRequirements();
      const profile = await clearanceService.fetchStudentProfile();
      setStudentData(profile);
      
      const depts = await clearanceService.fetchClearanceData();
      setDepartments(depts);
    } catch (error) {
      console.error(error);
      showNotification("Error loading data: " + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authMode === 'login') {
        await authService.signIn(email, password);
      } else {
        await authService.signUp(email, password, {
          name, 
          student_id: studentId,
          program: 'BS Information Technology', // Default for demo
          college: 'College of Information Technology Education',
          year_level: '4th Year',
          semester: '2nd Semester, A.Y. 2024-2025'
        });
      }
    } catch (error) {
      showNotification(error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setStudentData(null);
    setDepartments([]);
  };

  const stats = useMemo(() => {
    const totalReqs = departments.reduce((acc, d) => acc + d.requirements.length, 0);
    const clearedReqs = departments.reduce((acc, d) => acc + d.requirements.filter((r) => r.status === 'cleared').length, 0);
    const submittedReqs = departments.reduce((acc, d) => acc + d.requirements.filter((r) => r.status === 'submitted').length, 0);
    const pendingReqs = departments.reduce((acc, d) => acc + d.requirements.filter((r) => r.status === 'pending').length, 0);
    const missingReqs = departments.reduce((acc, d) => acc + d.requirements.filter((r) => r.status === 'missing').length, 0);
    const revisionReqs = departments.reduce((acc, d) => acc + d.requirements.filter((r) => r.status === 'needs_revision').length, 0);
    const progress = totalReqs > 0 ? Math.round((clearedReqs / totalReqs) * 100) : 0;

    return { totalReqs, clearedReqs, submittedReqs, pendingReqs, missingReqs, revisionReqs, progress };
  }, [departments]);

  const handleRequirementClick = (department, requirement) => {
    if (['missing', 'needs_revision', 'pending'].includes(requirement.status)) {
      setSelectedRequirement({ department, requirement });
    }
  };

  const handleUpload = async (departmentId, requirementId, file) => {
    try {
      setLoading(true);
      // Upload to storage
      const fileUrl = await storageService.uploadDocument(file, departmentId, requirementId);
      // Update DB
      await clearanceService.updateRequirementStatus(requirementId, 'submitted', fileUrl);
      // Refresh UI data
      await loadData();
      
      setSelectedRequirement(null);
      showNotification(`"${file.name}" uploaded successfully`);
    } catch (error) {
      console.error(error);
      showNotification("Upload failed: " + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, isError = false) => {
    setNotification({ text: message, isError });
    setTimeout(() => setNotification(null), 4000);
  };

  if (loading && !session && !departments.length) {
    return <div className="min-h-screen bg-[#111114] flex items-center justify-center text-white">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#111114] flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-maroon rounded-xl flex items-center justify-center mb-6">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">GradReady Portal</h1>
        <p className="text-zinc-500 text-sm mb-8">Sign in or create an account to view your clearance matrix</p>
        
        <form onSubmit={handleAuth} className="w-full max-w-sm bg-[#18181b] p-6 rounded-xl border border-[#27272a] shadow-xl">
          {authMode === 'signup' && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Full Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#111114] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Student ID</label>
                <input required type="text" value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full bg-[#111114] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white" />
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#111114] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Password</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#111114] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-maroon text-white font-medium py-2.5 rounded-lg text-sm mt-6 hover:bg-maroon-light transition-colors">
            {loading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
          
          <div className="mt-4 text-center">
            <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-xs text-zinc-400 hover:text-white transition-colors">
              {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </form>
        {notification && (
           <div className={`mt-6 px-4 py-3 rounded-lg text-sm border flex items-center gap-2 ${notification.isError ? 'bg-status-missing/10 border-status-missing/20 text-status-missing' : 'bg-status-cleared/10 border-status-cleared/20 text-status-cleared'}`}>
            {notification.text}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111114]">
      {/* Header */}
      <header className="bg-[#18181b] border-b border-[#27272a] sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-maroon rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white leading-none">GradReady</h1>
                <p className="text-zinc-500 text-xs mt-0.5">University of San Agustin</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDirectory(!showDirectory)}
                className="flex items-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {showDirectory ? (
                  <><Building2 className="w-4 h-4" /><span className="hidden sm:inline">Clearance Matrix</span></>
                ) : (
                  <><MapPin className="w-4 h-4" /><span className="hidden sm:inline">Office Directory</span></>
                )}
              </button>
              <button onClick={handleSignOut} className="p-2 text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors" title="Sign Out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-10 py-6">
        {loading && !departments.length ? (
           <div className="text-center py-20 text-zinc-500">Loading your structured clearance data...</div>
        ) : showDirectory ? (
          <div className="animate-fade-in">
            <InfoDirectory />
          </div>
        ) : studentData ? (
          <>
            <div className="animate-fade-in">
              <StudentHeader student={studentData} stats={stats} />
            </div>

            <div className="mt-6 animate-fade-in">
              <ProgressOverview stats={stats} />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Clearance Matrix</h2>
                <span className="text-xs text-zinc-500">
                  {stats.clearedReqs}/{stats.totalReqs} requirements cleared
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept, index) => (
                  <div key={dept.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <DepartmentCard department={dept} onRequirementClick={(req) => handleRequirementClick(dept, req)} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </main>

      {/* Upload Modal */}
      {selectedRequirement && (
        <UploadModal
          department={selectedRequirement.department}
          requirement={selectedRequirement.requirement}
          onClose={() => setSelectedRequirement(null)}
          onUpload={handleUpload}
          uploading={loading}
        />
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 border bg-[#18181b] 
            ${notification.isError ? 'border-status-missing/50 text-status-missing' : 'border-[#27272a] text-status-cleared'}`}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {notification.isError ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              )}
            </svg>
            {notification.text}
          </div>
        </div>
      )}
    </div>
  );
}
