import React, { useState, useEffect, useMemo } from 'react';
import { Building2, MapPin, LogOut, Loader2, Bell, CheckCircle2, Upload, XCircle, AlertCircle, Clock, Search } from 'lucide-react';
import DepartmentCard from '../../components/common/DepartmentCard';
import InfoDirectory from '../../components/common/InfoDirectory';
import UploadModal from '../../components/common/UploadModal';
import NotificationsModal from '../../components/common/NotificationsModal';
import DashboardStatCard from '../../components/common/DashboardStatCard';
import { authService } from '../../services/authService';
import { clearanceService } from '../../services/clearanceService';
import { storageService } from '../../services/storageService';
import { notificationService } from '../../services/notificationService';

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await clearanceService.initializeStudentRequirements();
      const profile = await clearanceService.fetchStudentProfile();
      setStudentData(profile);

      const depts = await clearanceService.fetchClearanceData();
      setDepartments(depts);

      const notifs = await notificationService.fetchNotifications();
      setNotifications(notifs);
    } catch (error) {
      console.error(error);
      showToast('Error loading data: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
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

  const filteredDepartments = useMemo(() => {
    if (!search) return departments;
    return departments.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  }, [departments, search]);

  const handleRequirementClick = (department, requirement) => {
    if (['missing', 'needs_revision', 'pending'].includes(requirement.status)) {
      setSelectedRequirement({ department, requirement });
    }
  };

  const handleUpload = async (departmentId, requirementId, file) => {
    try {
      setLoading(true);
      const fileUrl = await storageService.uploadDocument(file, departmentId, requirementId);
      await clearanceService.updateRequirementStatus(requirementId, 'submitted', fileUrl);
      await loadData();

      setSelectedRequirement(null);
      showToast(`"${file.name}" uploaded successfully`);
    } catch (error) {
      console.error(error);
      showToast('Upload failed: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, isError = false) => {
    setToast({ text: message, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const handleMarkAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      const notifs = await notificationService.fetchNotifications();
      setNotifications(notifs);
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  const navigation = [
    { id: 'matrix', label: 'Clearance Matrix', icon: Building2 },
    { id: 'directory', label: 'Office Directory', icon: MapPin },
  ];

  return (
    <div className="h-screen bg-[#111114] flex overflow-hidden">
      {/* ─── Sidebar ─── */}
      <aside className="w-64 bg-[#18181b] border-r border-[#27272a] shrink-0 flex flex-col z-30 h-full">
        {/* Branding */}
        <button 
          onClick={() => { setActiveTab('matrix'); loadData(); }}
          className="p-6 flex items-center gap-4 border-b border-[#27272a]/50 text-left w-full hover:bg-[#27272a]/30 transition-colors"
        >
           <img src="/images/usa-seal.png" alt="USA Seal" className="w-10 h-10 rounded-xl object-contain bg-zinc-800" />
           <div>
             <h1 className="text-[17px] font-bold text-white tracking-widest leading-none">GRADREADY</h1>
             <p className="text-[11px] text-zinc-500 uppercase font-medium mt-1">Student Portal</p>
           </div>
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1.5">
          {navigation.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all border ${
                  isActive 
                  ? 'bg-[#111114] border-[#27272a] text-white shadow-sm' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#27272a]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </button>
            )
          })}
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-[#27272a]">
          <div className="flex items-center justify-between px-2 cursor-default relative group">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-maroon flex items-center justify-center font-bold text-lg text-white ring-2 ring-transparent group-hover:ring-maroon-light transition-all">
                  {(studentData?.name || 'Student').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-white leading-tight truncate max-w-[140px]">{studentData?.name || 'Student Name'}</p>
                  <p className="text-[11px] text-zinc-500 font-medium truncate max-w-[140px] uppercase">
                     {studentData?.student_id || 'ID N/A'}
                  </p>
                </div>
             </div>
             
             <button
               onClick={handleSignOut}
               className="p-2 -mr-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
               title="Sign Out"
             >
               <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#111114]">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-[#27272a] sticky top-0 bg-[#111114] z-20">
           {/* Search Placeholder */}
           <div className={`w-80 h-11 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center px-4 text-zinc-500 shadow-sm focus-within:border-maroon focus-within:ring-1 focus-within:ring-maroon transition-all ${activeTab !== 'matrix' ? 'opacity-0 pointer-events-none' : ''}`}>
             <Search className="w-4 h-4 mr-3" />
             <input 
               type="text" 
               placeholder="Search departments..." 
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-600"
             />
           </div>

           {/* Top Right Actions */}
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowNotificationsModal(true)}
                className="relative p-2.5 text-zinc-400 hover:text-white bg-[#18181b] border border-[#27272a] rounded-xl transition-colors shadow-sm"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <div className="absolute top-2 right-2.5 w-2 h-2 bg-maroon rounded-full ring-2 ring-[#111114]" />}
              </button>
           </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading && !departments.length ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-maroon animate-spin" />
              <p className="text-zinc-500 text-sm">Loading your clearance data...</p>
            </div>
          ) : activeTab === 'directory' ? (
            <div className="animate-fade-in max-w-7xl mx-auto">
              <InfoDirectory />
            </div>
          ) : studentData ? (
            <div className="animate-fade-in space-y-8 max-w-7xl mx-auto">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <DashboardStatCard label="Cleared" value={stats.clearedReqs} icon={CheckCircle2} valueColor="text-status-cleared" />
                <DashboardStatCard label="Submitted" value={stats.submittedReqs} icon={Upload} valueColor="text-status-submitted" />
                <DashboardStatCard label="Pending" value={stats.pendingReqs} icon={Clock} valueColor="text-zinc-400" />
                <DashboardStatCard label="Revision" value={stats.revisionReqs} icon={AlertCircle} valueColor="text-status-revision" />
                <DashboardStatCard label="Missing" value={stats.missingReqs} icon={XCircle} valueColor="text-status-missing" />
              </div>

              {/* Central Progress Banner */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                 <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Clearance Progress</h2>
                    <p className="text-zinc-500 text-sm mt-1">
                      {stats.clearedReqs} of {stats.totalReqs} requirements cleared. 
                      {stats.progress === 100 ? " You're all set!" : " Keep going!"}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs font-medium text-zinc-400">
                      <span className="bg-[#27272a] px-2.5 py-1 rounded-md">{studentData.program}</span>
                      <span className="bg-[#27272a] px-2.5 py-1 rounded-md">Year {studentData.year_level} — Sem {studentData.semester}</span>
                    </div>
                 </div>
                 {/* Progress Circle */}
                  <div className="flex-shrink-0 relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="#27272a" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="42" stroke="#7f1d1d" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${stats.progress * 2.64} ${264 - stats.progress * 2.64}`} className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white leading-none">{stats.progress}%</span>
                    </div>
                  </div>
              </div>

              {/* Department Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDepartments.length === 0 ? (
                  <div className="col-span-full py-10 text-center text-zinc-500">
                    No departments match your search.
                  </div>
                ) : (
                  filteredDepartments.map((dept, index) => (
                    <div key={dept.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <DepartmentCard department={dept} onRequirementClick={(req) => handleRequirementClick(dept, req)} />
                    </div>
                  ))
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-zinc-500">
              <p>No student profile found. Please contact the registrar.</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals and Toasts */}
      {selectedRequirement && (
        <UploadModal
          department={selectedRequirement.department}
          requirement={selectedRequirement.requirement}
          onClose={() => setSelectedRequirement(null)}
          onUpload={handleUpload}
          uploading={loading}
        />
      )}

      {showNotificationsModal && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotificationsModal(false)}
          onMarkAsRead={handleMarkAsRead}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
           <div className={`px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-3 border bg-[#18181b] ${toast.isError ? 'border-status-missing/50 text-status-missing' : 'border-[#27272a] text-status-cleared'}`}>
            {toast.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}
