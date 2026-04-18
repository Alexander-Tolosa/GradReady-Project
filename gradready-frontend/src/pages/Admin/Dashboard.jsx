import React, { useState, useEffect } from 'react';
import { Shield, Users, Layers, LogOut, Loader2 } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import AdminStatsOverview from '../../components/common/AdminStatsOverview';
import DepartmentCard from '../../components/common/DepartmentCard';
import StudentRoster from '../../components/common/StudentRoster';
import { authService } from '../../services/authService';
import { adminService } from '../../services/adminService';

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [systemData, setSystemData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'roster'
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const profile = await adminService.fetchAdminProfile();
      setAdminData(profile);

      const sysData = await adminService.fetchSystemData();
      setSystemData(sysData);
    } catch (error) {
      console.error(error);
      showNotification('Error loading data: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
  };

  const showNotification = (message, isError = false) => {
    setNotification({ text: message, isError });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#111114]">
      {/* Header */}
      <header className="bg-[#18181b] border-b border-[#27272a] sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-maroon rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white leading-none">GradReady System</h1>
                <p className="text-zinc-500 text-xs mt-0.5">Admin Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex bg-[#27272a] rounded-lg p-1 mr-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'overview' ? 'bg-[#3f3f46] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Layers className="w-4 h-4" /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('roster')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'roster' ? 'bg-[#3f3f46] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                   <Users className="w-4 h-4" /> Roster
                </button>
              </div>

              <button
                id="signout-btn"
                onClick={handleSignOut}
                className="p-2 text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Tab Navigation */}
      <div className="sm:hidden bg-[#18181b] border-b border-[#27272a] px-4 py-2 flex gap-2">
         <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-[#27272a] text-white' : 'text-zinc-400'
            }`}
          >
            <Layers className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'roster' ? 'bg-[#27272a] text-white' : 'text-zinc-400'
            }`}
          >
             <Users className="w-4 h-4" /> Roster
          </button>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-10 py-6">
        {loading && !systemData ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-maroon animate-spin" />
            <p className="text-zinc-500 text-sm">Loading system data...</p>
          </div>
        ) : !adminData ? (
           <div className="text-center py-20 text-zinc-500">
            <p>No admin profile found. Please contact support.</p>
          </div>
        ) : activeTab === 'roster' ? (
           <div className="animate-fade-in">
             <StudentRoster students={systemData?.mappedStudents} />
           </div>
        ) : (
          <>
            <div className="animate-fade-in">
              <AdminHeader admin={adminData} stats={systemData?.stats} />
            </div>

            <div className="mt-6 animate-fade-in">
              <AdminStatsOverview stats={systemData?.stats} />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Department Progress</h2>
                <span className="text-xs text-zinc-500">
                  {systemData?.departmentData?.length || 0} Departments Active
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemData?.departmentData?.map((dept, index) => (
                  <div key={dept.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <DepartmentCard department={dept} onRequirementClick={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

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

      {/* Footer */}
      <footer className="border-t border-[#27272a] mt-12">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <p>© 2026 GradReady — University of San Agustin, Iloilo City</p>
            <p>Admin Portal v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
