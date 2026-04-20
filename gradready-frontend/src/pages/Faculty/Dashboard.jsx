import React, { useState, useEffect, useMemo } from 'react';
import { LogOut, Search, Hash, BookOpen, Clock, Upload, CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { facultyService } from '../../services/facultyService';
import { notificationService } from '../../services/notificationService';
import StatusUpdateModal from '../../components/common/StatusUpdateModal';
import AdminNotifications from '../../components/common/AdminNotifications';

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

  return (
    <div className="min-h-screen bg-[#111114]">
      <header className="bg-[#18181b] border-b border-[#27272a] sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between py-4">
            <button onClick={() => { setActiveTab('submissions'); loadData(); }} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/images/usa-seal.png" alt="USA Seal" className="w-9 h-9 rounded-lg object-contain" />
              <div className="text-left">
                <h1 className="text-lg font-semibold text-white leading-none">GradReady Faculty</h1>
                <p className="text-zinc-500 text-xs mt-0.5">Department Portal</p>
              </div>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex bg-[#27272a] rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'submissions' ? 'bg-[#3f3f46] text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  <BookOpen className="w-4 h-4" /> Submissions
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors relative ${activeTab === 'notifications' ? 'bg-[#3f3f46] text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-700 rounded-full border-2 border-[#27272a]" />
                  )}
                </button>
              </div>
              <button onClick={handleSignOut} className="p-2 text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 lg:px-10 py-6">
        {loading && !facultyData ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-red-800 animate-spin" />
            <p className="text-zinc-500 text-sm">Loading department data...</p>
          </div>
        ) : !facultyData ? (
          <div className="text-center py-20 text-zinc-500">No faculty profile found.</div>
        ) : activeTab === 'notifications' ? (
          <AdminNotifications notifications={notifications} onMarkAsRead={handleMarkAsRead} />
        ) : (
          <>
            {/* Faculty Profile Card */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-red-900 flex items-center justify-center text-lg font-bold text-white">
                  {facultyData?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'FA'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{facultyData?.name || 'Faculty Member'}</h2>
                    <span className="text-[10px] font-bold bg-red-900/30 text-red-400 px-2 py-0.5 rounded uppercase tracking-wider">
                      {facultyData?.departments?.name || 'Department'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-zinc-500 text-xs">
                    <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{facultyData?.employee_id}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{facultyData?.position || 'Instructor'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">{stats.progress}%</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Overall Cleared</p>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {[
                { label: 'Cleared', count: stats.cleared, icon: CheckCircle2, color: 'text-green-400' },
                { label: 'Submitted', count: stats.submitted, icon: Upload, color: 'text-blue-400' },
                { label: 'Pending', count: stats.pending, icon: Clock, color: 'text-zinc-400' },
                { label: 'Needs Revision', count: stats.revision, icon: AlertCircle, color: 'text-yellow-400' },
                { label: 'Missing', count: stats.missing, icon: XCircle, color: 'text-red-400' },
              ].map(card => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="bg-[#18181b] border border-[#27272a] rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${card.color}`} />
                      <div>
                        <p className={`text-xl font-black ${card.color}`}>{card.count}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{card.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Student Clearance Matrix */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Student Clearance Matrix</h3>
                <p className="text-zinc-500 text-xs mt-0.5">{studentsData.length} students · {stats.cleared}/{stats.total} requirements cleared</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.length === 0 ? (
                <div className="col-span-full text-center py-10 text-zinc-500">
                  {search ? 'No students match your search.' : 'No submissions found for your department.'}
                </div>
              ) : (
                filteredStudents.map((student, index) => (
                  <div key={student.id} style={{ animationDelay: `${index * 30}ms` }}>
                    <StudentListCard
                      student={student}
                      onRequirementClick={(req, stu) => setSelectedReq({ requirement: { ...req, student_name: stu.name }, student: stu })}
                    />
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>

      {selectedReq && (
        <StatusUpdateModal
          requirement={selectedReq.requirement}
          onClose={() => setSelectedReq(null)}
          onSubmit={handleUpdateStatus}
          submitting={submittingAction}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 border bg-[#18181b] ${toast.isError ? 'border-red-800 text-red-400' : 'border-[#27272a] text-green-400'}`}>
            <CheckCircle2 className="w-4 h-4" />
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}
