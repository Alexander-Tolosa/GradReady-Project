import React, { useState, useEffect } from 'react';
import { Users, LayoutDashboard, LogOut, Loader2, Clock, AlertTriangle, Building2, CheckCircle2, Search, Bell, Download, FileText, FileCheck, History } from 'lucide-react';
import StudentRoster from '../../components/common/StudentRoster';
import ManageRoles from '../../components/common/ManageRoles';
import AdminNotifications from '../../components/common/AdminNotifications';
import { authService } from '../../services/authService';
import { adminService } from '../../services/adminService';
import { notificationService } from '../../services/notificationService';

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-[#18181b] rounded-xl p-6 relative overflow-hidden border border-[#27272a] group shadow-sm">
      <div className="relative z-10 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{label}</p>
        <p className="text-4xl font-black text-white tracking-tighter">{value ?? '—'}</p>
      </div>
      <div className="absolute -right-6 -bottom-6 text-white/[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
        <Icon className="w-32 h-32" strokeWidth={1.5} />
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ stats, recentRequests = [], onApprove, onReject }) {
  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Institutional Overview</h2>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-maroon hover:bg-maroon-light text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export Ledger
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Students"
          value={stats?.totalStudents?.toLocaleString()}
          icon={Users}
        />
        <StatCard
          label="Pending Clearances"
          value={stats?.pendingReqs?.toLocaleString()}
          icon={Clock}
        />
        <StatCard
          label="Approved Clearances"
          value={stats?.clearedReqs?.toLocaleString()}
          icon={FileCheck}
        />
        <StatCard
          label="Active Departments"
          value={stats?.departmentsCount ?? 24} // Mocked count or add to payload
          icon={Building2}
        />
      </div>

      {/* Ledger Activity */}
      <div className="bg-[#18181b] rounded-xl border border-[#27272a] mt-8 overflow-hidden">
        <div className="px-6 py-5 border-b border-[#27272a] flex items-center justify-between bg-[#111114]/50">
          <h3 className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-bold">Ledger Activity</h3>
          <button className="text-xs font-semibold text-white hover:text-maroon-light transition-colors">View All</button>
        </div>
        
        <div className="divide-y divide-[#27272a] p-3">
          {recentRequests.length === 0 ? (
             <div className="p-8 text-center text-zinc-500 text-sm">No recent ledger activity.</div>
          ) : (
            recentRequests.map((req) => {
              // Determine Icon and Styling based on status
              const isCleared = req.status === 'cleared';
              const isFlagged = req.status === 'needs_revision';
              
              let IconItem = FileText;
              let bgClass = "bg-[#27272a] text-zinc-400";
              let titleText = `New Initiation`;
              let descText = `Student ${req.studentName} started clearance in ${req.studentDepartment}.`;

              if (isCleared) {
                IconItem = CheckCircle2;
                bgClass = "bg-status-cleared/20 text-status-cleared shadow-[0_0_10px_rgba(34,197,94,0.1)]";
                titleText = `Clearance Approved`;
                descText = `${req.studentDepartment} approved record for ${req.studentName}.`;
              } else if (isFlagged) {
                IconItem = AlertTriangle;
                bgClass = "bg-status-missing/20 text-status-missing shadow-[0_0_10px_rgba(239,68,68,0.1)]";
                titleText = `Flagged: Overdue / Revision`;
                descText = `System flagged ${req.studentName} in ${req.studentDepartment}.`;
              } else if (req.status === 'submitted') {
                IconItem = FileText;
                bgClass = "bg-status-submitted/20 text-status-submitted";
                titleText = `Document Upload`;
                descText = `${req.studentName} submitted documents to ${req.studentDepartment}.`;
              }
              
              const dateObj = new Date(req.updated_at);
              const diffMs = Date.now() - dateObj.getTime();
              const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
              const diffMins = Math.floor(diffMs / (1000 * 60));
              let timeStr = `${diffMins} mins ago`;
              if (diffHrs > 0 && diffHrs < 24) timeStr = `${diffHrs} hours ago`;
              else if (diffHrs >= 24) timeStr = dateObj.toLocaleDateString();
              if (diffMins < 1 && diffHrs === 0) timeStr = 'Just now';

              return (
                <div key={req.id} className="p-4 hover:bg-[#27272a]/30 transition-colors flex items-center justify-between rounded-lg group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
                      <IconItem className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{titleText}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{descText}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 shrink-0 text-right">
                    <span className="text-[11px] text-zinc-500 font-medium">{timeStr}</span>
                    {/* Action buttons on hover if actionable */}
                    {(req.status === 'pending' || req.status === 'submitted') && (
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => onApprove(req.id)} className="text-[10px] px-3 py-1.5 bg-status-cleared/10 text-status-cleared hover:bg-status-cleared/20 border border-status-cleared/20 rounded-md font-medium transition-colors">Approve</button>
                          <button onClick={() => onReject(req.id)} className="text-[10px] px-3 py-1.5 bg-status-missing/10 text-status-missing hover:bg-status-missing/20 border border-status-missing/20 rounded-md font-medium transition-colors">Reject</button>
                       </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [systemData, setSystemData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState(null);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profile, sysData, allUsers, sysNotifs] = await Promise.all([
        adminService.fetchAdminProfile(),
        adminService.fetchSystemData(),
        adminService.fetchAllUsers(),
        notificationService.fetchNotifications(),
      ]);
      setAdminData(profile);
      setSystemData(sysData);
      setUsers(allUsers);
      setNotifications(sysNotifs);
    } catch (error) {
      showNotification('Error loading data: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, isError = false) => {
    setNotification({ text: message, isError });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprove = async (requirementId) => {
    try {
      await adminService.updateClearanceStatus(requirementId, 'cleared');
      showNotification('Requirement cleared successfully.');
      loadData();
    } catch (e) {
      showNotification('Failed to approve: ' + e.message, true);
    }
  };

  const handleReject = async (requirementId) => {
    try {
      await adminService.updateClearanceStatus(requirementId, 'needs_revision');
      showNotification('Requirement flagged for revision.');
      loadData();
    } catch (e) {
      showNotification('Failed to reject: ' + e.message, true);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(await notificationService.fetchNotifications());
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0;

  // Sidebar mapping matching mockup
  const navigation = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'roster', label: 'Clearance Requests', icon: Users },
    { id: 'roles', label: 'Departments', icon: Building2 },
    { id: 'notifications', label: 'Audit Logs', icon: History, badge: unreadCount },
  ];

  return (
    <div className="h-screen bg-[#111114] flex overflow-hidden">
      
      {/* ─── Sidebar Sidebar ─── */}
      <aside className="w-64 bg-[#18181b] border-r border-[#27272a] shrink-0 flex flex-col z-30 h-full">
        {/* Branding */}
        <button 
          onClick={() => window.location.reload()}
          className="p-6 flex items-center gap-4 border-b border-[#27272a]/50 text-left w-full hover:bg-[#27272a]/30 transition-colors"
        >
           <img src="/images/usa-seal.png" alt="USA Seal" className="w-10 h-10 rounded-xl object-contain bg-zinc-800" />
           <div>
             <h1 className="text-[17px] font-bold text-white tracking-widest leading-none">GRADREADY</h1>
             <p className="text-[11px] text-zinc-500 uppercase font-medium mt-1">Admin Terminal</p>
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
                <div className="w-10 h-10 rounded-full bg-maroon flex items-center justify-center font-bold text-lg text-white ring-2 ring-transparent group-hover:ring-maroon-light transition-all">
                  {adminData?.name?.[0] || 'A'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-white leading-tight">{adminData?.name || 'Administrator'}</p>
                  <p className="text-[11px] text-zinc-500 font-medium truncate max-w-[140px] uppercase">
                     {adminData?.role || 'Registrar Office'}
                  </p>
                </div>
             </div>
             
             <button
               onClick={() => authService.signOut()}
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
           <div className="w-80 h-11 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center px-4 text-zinc-500 shadow-sm focus-within:border-maroon focus-within:ring-1 focus-within:ring-maroon transition-all">
             <Search className="w-4 h-4 mr-3" />
             <input 
               type="text" 
               placeholder="Search entries..." 
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
                {unreadCount > 0 && <div className="absolute top-2 right-2.5 w-2 h-2 bg-maroon rounded-full ring-2 ring-[#111114]" />}
              </button>
           </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading && !systemData ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-maroon animate-spin" />
              <p className="text-zinc-500 text-sm">Loading system data...</p>
            </div>
          ) : !adminData ? (
            <div className="h-full flex items-center justify-center text-zinc-500">
              <p>No admin profile found. Please contact support.</p>
            </div>
          ) : activeTab === 'roster' ? (
            <div className="animate-fade-in bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-sm">
              <StudentRoster students={systemData?.mappedStudents} />
            </div>
          ) : activeTab === 'roles' ? (
            <div className="animate-fade-in bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-sm">
              <ManageRoles users={users} />
            </div>
          ) : activeTab === 'notifications' ? (
            <div className="animate-fade-in bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-sm p-6">
              <AdminNotifications notifications={notifications} onMarkAsRead={handleMarkAsRead} />
            </div>
          ) : (
            <OverviewTab
              stats={systemData?.stats}
              recentRequests={systemData?.recentRequests}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </div>
      </main>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-3 border bg-[#18181b] ${
            notification.isError
              ? 'border-status-missing/30 text-status-missing'
              : 'border-[#27272a] text-status-cleared'
          }`}>
            {notification.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {notification.text}
          </div>
        </div>
      )}
    </div>
  );
}
