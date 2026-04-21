import React, { useState, useEffect, useMemo } from 'react';
import { LogOut, Search, Hash, BookOpen, Clock, Upload, CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronUp, Loader2, Bell } from 'lucide-react';
import { authService } from '../../services/authService';
import { facultyService } from '../../services/facultyService';
import { notificationService } from '../../services/notificationService';
import StatusUpdateModal from '../../components/common/StatusUpdateModal';
import AdminNotifications from '../../components/common/AdminNotifications';
import DashboardStatCard from '../../components/common/DashboardStatCard';

const statusConfig = {
  cleared: { icon: CheckCircle2, label: 'Cleared', className: 'status-cleared', dotColor: 'bg-status-cleared' },
  missing: { icon: XCircle, label: 'Missing', className: 'status-missing', dotColor: 'bg-status-missing' },
  needs_revision: { icon: AlertCircle, label: 'Revision', className: 'status-revision', dotColor: 'bg-status-revision' },
  submitted: { icon: Upload, label: 'Submitted', className: 'status-submitted', dotColor: 'bg-status-submitted' },
  pending: { icon: Clock, label: 'Pending', className: 'status-pending', dotColor: 'bg-status-pending' },
};

function StudentListCard({ student, onRequirementClick }) {
  const [expanded, setExpanded] = useState(true);
  const clearedCount = student.requirements.filter(r => r.status === 'cleared').length;
  const totalCount = student.requirements.length;
  const progressPercent = totalCount > 0 ? Math.round((clearedCount / totalCount) * 100) : 0;

  const getStatus = () => {
    if (progressPercent === 100) return { text: 'Complete', color: 'text-status-cleared' };
    const hasSubmitted = student.requirements.some(r => r.status === 'submitted');
    if (hasSubmitted) return { text: 'In Progress', color: 'text-yellow-500' };
    return { text: 'Action Needed', color: 'text-status-revision' };
  };

  const studentStatus = getStatus();

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
      <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-sm font-bold text-white border border-zinc-700">
            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{student.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{student.studentId}</span>
              <span className="text-[9px] text-zinc-400 bg-zinc-900 px-1 rounded">{student.program}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${studentStatus.color}`}>{studentStatus.text}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-zinc-600" /> : <ChevronDown className="w-4 h-4 text-zinc-600" />}
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-zinc-500">{clearedCount}/{totalCount} Cleared</span>
          <span className="text-[10px] font-black text-white">{progressPercent}%</span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${progressPercent === 100 ? 'bg-green-500' : 'bg-red-800'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-2 border-t border-zinc-900 pt-4">
          {student.requirements.map(req => {
            const config = statusConfig[req.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            return (
              <div
                key={req.id}
                onClick={() => onRequirementClick(req, student)}
                className="flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-2 max-w-[70%]">
                  <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                  <p className="text-xs text-zinc-400 font-medium truncate group-hover:text-white transition-colors">
                    {req.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${config.className}`}>
                    {config.label}
                  </span>
                  {req.status !== 'cleared' && (
                    <span className="text-[9px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      Click to act
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(true);
  const [facultyData, setFacultyData] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('submissions');
  const [selectedReq, setSelectedReq] = useState(null);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const profile = await facultyService.fetchFacultyProfile();
      setFacultyData(profile);

      if (profile?.department_id) {
        const reqs = await facultyService.fetchDepartmentSubmissions(profile.department_id);
        const studentMap = {};
        reqs.forEach(req => {
          const authId = req.student_auth_id;
          if (!studentMap[authId]) {
            studentMap[authId] = {
              id: authId,
              name: req.students?.name || 'Unknown Student',
              program: req.students?.program || 'N/A',
              studentId: req.students?.student_id || 'N/A',
              requirements: []
            };
          }
          studentMap[authId].requirements.push(req);
        });
        setStudentsData(Object.values(studentMap));
      }

      const notifs = await notificationService.fetchNotifications();
      setNotifications(notifs);
    } catch (error) {
      console.error(error);
      showToast('Error loading dashboard: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, isError = false) => {
    setToast({ text: message, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSignOut = async () => { await authService.signOut(); };

  const handleUpdateStatus = async (status, revisionNote) => {
    if (!selectedReq) return;
    try {
      setSubmittingAction(true);
      await facultyService.updateRequirementStatus(
        selectedReq.requirement.id,
        status,
        revisionNote,
        selectedReq.requirement.student_auth_id
      );
      showToast(status === 'cleared' ? 'Requirement cleared!' : 'Revision notice sent to student.');
      setSelectedReq(null);
      await loadData();
    } catch (error) {
      showToast('Failed to update: ' + error.message, true);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleMarkAsRead = async () => {
    await notificationService.markAllAsRead();
    const notifs = await notificationService.fetchNotifications();
    setNotifications(notifs);
  };

  const stats = useMemo(() => {
    let total = 0, cleared = 0, submitted = 0, pending = 0, missing = 0, revision = 0;
    studentsData.forEach(s => s.requirements.forEach(r => {
      total++;
      if (r.status === 'cleared') cleared++;
      if (r.status === 'submitted') submitted++;
      if (r.status === 'pending') pending++;
      if (r.status === 'missing') missing++;
      if (r.status === 'needs_revision') revision++;
    }));
    return { total, cleared, submitted, pending, missing, revision, progress: total > 0 ? Math.round((cleared / total) * 100) : 0 };
  }, [studentsData]);

  const filteredStudents = useMemo(() => {
    if (!search) return studentsData;
    return studentsData.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase())
    );
  }, [studentsData, search]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const navigation = [
    { id: 'submissions', label: 'Submissions', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
  ];

  return (
    <div className="h-screen bg-[#111114] flex overflow-hidden">
      {/* ─── Sidebar ─── */}
      <aside className="w-64 bg-[#18181b] border-r border-[#27272a] shrink-0 flex flex-col z-30 h-full">
        {/* Branding */}
        <button 
          onClick={() => { setActiveTab('submissions'); loadData(); }}
          className="p-6 flex items-center gap-4 border-b border-[#27272a]/50 text-left w-full hover:bg-[#27272a]/30 transition-colors"
        >
           <img src="/images/usa-seal.png" alt="USA Seal" className="w-10 h-10 rounded-xl object-contain bg-zinc-800" />
           <div>
             <h1 className="text-[17px] font-bold text-white tracking-widest leading-none">GRADREADY</h1>
             <p className="text-[11px] text-zinc-500 uppercase font-medium mt-1">Faculty Portal</p>
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
                {item.badge > 0 && (
                  <span className="bg-maroon text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-[#27272a]">
          <div className="flex items-center justify-between px-2 cursor-default relative group">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-900 flex items-center justify-center font-bold text-lg text-white ring-2 ring-transparent group-hover:ring-red-800 transition-all">
                  {facultyData?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'FA'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-white leading-tight">{facultyData?.name || 'Faculty Member'}</p>
                  <p className="text-[11px] text-zinc-500 font-medium truncate max-w-[140px] uppercase">
                     {facultyData?.departments?.name || 'Department'}
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
           <div className="w-80 h-11 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center px-4 text-zinc-500 shadow-sm focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600 transition-all">
             <Search className="w-4 h-4 mr-3" />
             <input 
               type="text" 
               placeholder="Search students..." 
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-600"
             />
           </div>

           {/* Top Right Actions */}
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('notifications')}
                className="relative p-2.5 text-zinc-400 hover:text-white bg-[#18181b] border border-[#27272a] rounded-xl transition-colors shadow-sm"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-700 rounded-full ring-2 ring-[#111114]" />}
              </button>
           </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading && !facultyData ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-red-800 animate-spin" />
              <p className="text-zinc-500 text-sm">Loading department data...</p>
            </div>
          ) : !facultyData ? (
             <div className="h-full flex items-center justify-center text-zinc-500">
              <p>No faculty profile found. Please contact support.</p>
            </div>
          ) : activeTab === 'notifications' ? (
             <div className="animate-fade-in bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-sm p-6 max-w-5xl mx-auto">
              <AdminNotifications notifications={notifications} onMarkAsRead={handleMarkAsRead} />
             </div>
          ) : (
            <div className="animate-fade-in space-y-8 max-w-7xl mx-auto">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <DashboardStatCard label="Cleared" value={stats.cleared} icon={CheckCircle2} valueColor="text-green-400" />
                <DashboardStatCard label="Submitted" value={stats.submitted} icon={Upload} valueColor="text-blue-400" />
                <DashboardStatCard label="Pending" value={stats.pending} icon={Clock} valueColor="text-zinc-400" />
                <DashboardStatCard label="Review" value={stats.revision} icon={AlertCircle} valueColor="text-yellow-400" />
                <DashboardStatCard label="Missing" value={stats.missing} icon={XCircle} valueColor="text-red-400" />
              </div>

              {/* Student Clearance Matrix */}
              <div className="bg-[#18181b] rounded-xl border border-[#27272a] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#27272a] flex items-center justify-between bg-[#111114]/50">
                  <h3 className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-bold">Student Clearance Matrix</h3>
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md font-bold">
                    {stats.cleared}/{stats.total} CLEARED
                  </span>
                </div>
                
                <div className="p-6 bg-[#111114]">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredStudents.length === 0 ? (
                      <div className="col-span-full text-center py-10 text-zinc-500">
                        {search ? 'No students match your search.' : 'No submissions found for your department.'}
                      </div>
                    ) : (
                      filteredStudents.map((student, index) => (
                        <div key={student.id} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                          <StudentListCard
                            student={student}
                            onRequirementClick={(req, stu) => setSelectedReq({ requirement: { ...req, student_name: stu.name }, student: stu })}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals and Toasts */}
      {selectedReq && (
        <StatusUpdateModal
          requirement={selectedReq.requirement}
          onClose={() => setSelectedReq(null)}
          onSubmit={handleUpdateStatus}
          submitting={submittingAction}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-3 border bg-[#18181b] ${toast.isError ? 'border-red-800/30 text-red-400' : 'border-[#27272a] text-green-400'}`}>
            {toast.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}
