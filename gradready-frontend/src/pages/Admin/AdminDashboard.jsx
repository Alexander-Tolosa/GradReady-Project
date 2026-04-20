import React, { useState, useEffect } from 'react';
import { Users, Layers, LogOut, Loader2, Clock, AlertTriangle, Activity } from 'lucide-react';
import StudentRoster from '../../components/common/StudentRoster';
import ManageRoles from '../../components/common/ManageRoles';
import AdminNotifications from '../../components/common/AdminNotifications';
import { authService } from '../../services/authService';
import { adminService } from '../../services/adminService';
import { notificationService } from '../../services/notificationService';

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="card p-6 border-l-4 border-l-maroon flex items-center justify-between group hover:border-l-maroon-light transition-all">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">{label}</p>
        <p className="text-3xl font-black text-white tracking-tighter">{value ?? '—'}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ stats, recentRequests = [], onApprove, onReject }) {
  return (
    <div className="space-y-8 animate-fade-in">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={stats?.totalStudents}
          icon={Users}
          color="text-status-cleared"
        />
        <StatCard
          label="Pending Clearances"
          value={stats?.pendingReqs}
          icon={Clock}
          color="text-status-submitted"
        />
        <StatCard
          label="Flagged Revisions"
          value={stats?.revisionReqs}
          icon={AlertTriangle}
          color="text-status-revision"
        />
        <StatCard
          label="Overall Progress"
          value={`${stats?.overallProgress ?? 0}%`}
          icon={Activity}
          color="text-status-cleared"
        />
      </div>

      {/* Recent Requests Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent Clearance Requests</h3>
          <span className="text-xs text-zinc-500">{recentRequests.length} pending</span>
        </div>

        {recentRequests.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500 text-center">No pending requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-900/50 text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Clearance Item</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {recentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-zinc-200">{req.studentName}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-400">{req.studentDepartment}</td>
                    <td className="px-6 py-4 text-xs text-zinc-400">{req.name ?? req.title ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`status-badge status-${req.status}`}>{req.status}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {req.updated_at
                        ? new Date(req.updated_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onApprove(req.id)}
                          className="status-badge status-cleared hover:scale-105 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onReject(req.id)}
                          className="status-badge status-missing hover:scale-105 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

  return (
    <div className="min-h-screen bg-[#111114]">

      {/* Header */}
      <header className="bg-[#18181b] border-b border-[#27272a] sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between py-4">

            <button
              onClick={() => { setActiveTab('overview'); loadData(); }}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              title="Back to Dashboard"
            >
              <img src="/images/usa-seal.png" alt="USA Seal" className="w-9 h-9 rounded-lg object-contain" />
              <div className="text-left">
                <h1 className="text-lg font-semibold text-white leading-none">GradReady System</h1>
                <p className="text-zinc-500 text-xs mt-0.5">Admin Portal</p>
              </div>
            </button>

            <div className="flex items-center gap-3">
              {/* Desktop Tabs */}
              <div className="hidden sm:flex bg-[#27272a] rounded-lg p-1 mr-2">
                {[
                  { key: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
                  { key: 'roster', label: 'Roster', icon: <Users className="w-4 h-4" /> },
                  { key: 'roles', label: 'Roles', icon: null },
                  { key: 'notifications', label: 'Notifications', icon: null, badge: unreadCount },
                ].map(({ key, label, icon, badge }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === key
                        ? 'bg-[#3f3f46] text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                  >
                    {icon}{label}
                    {badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-maroon rounded-full border-2 border-[#27272a]" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => authService.signOut()}
                className="p-2 text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="sm:hidden bg-[#18181b] border-b border-[#27272a] px-4 py-2 flex gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-[#27272a] text-white' : 'text-zinc-400'
            }`}
        >
          <Layers className="w-4 h-4" /> Overview
        </button>
        <button
          onClick={() => setActiveTab('roster')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'roster' ? 'bg-[#27272a] text-white' : 'text-zinc-400'
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
        ) : activeTab === 'roles' ? (
          <div className="animate-fade-in">
            <ManageRoles users={users} />
          </div>
        ) : activeTab === 'notifications' ? (
          <div className="animate-fade-in">
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
      </main>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 border bg-[#18181b] ${notification.isError
              ? 'border-status-missing/50 text-status-missing'
              : 'border-[#27272a] text-status-cleared'
            }`}>
            {notification.text}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#27272a] mt-12">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <p>© 2026 University of San Agustin - GradReady. All rights reserved.</p>
            <p>Admin Portal v1.0</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
