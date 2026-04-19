import React, { useState, useEffect } from 'react';
import { LogOut, Loader2, BookOpen } from 'lucide-react';
import { authService } from '../../services/authService';
import { facultyService } from '../../services/facultyService';
import FacultyHeader from '../../components/layout/FacultyHeader';
import SubmissionsTable from '../../components/common/SubmissionsTable';
import StatusUpdateModal from '../../components/common/StatusUpdateModal';
import AdminNotifications from '../../components/common/AdminNotifications';
import { notificationService } from '../../services/notificationService';

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(true);
  const [facultyData, setFacultyData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' | 'notifications'
  
  const [selectedReq, setSelectedReq] = useState(null);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const profile = await facultyService.fetchFacultyProfile();
      setFacultyData(profile);

      if (profile?.department_id) {
        const reqs = await facultyService.fetchDepartmentSubmissions(profile.department_id);
        setSubmissions(reqs);
      }

      const notifs = await notificationService.fetchNotifications();
      setNotifications(notifs);
    } catch (error) {
      console.error(error);
      showToast('Error loading data.', true);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, isError = false) => {
    setToast({ text: message, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSignOut = async () => {
    await authService.signOut();
  };

  const handleUpdateStatus = async (status, revisionNote) => {
    if (!selectedReq) return;
    
    try {
      setSubmittingAction(true);
      await facultyService.updateRequirementStatus(
        selectedReq.id, 
        status, 
        revisionNote, 
        selectedReq.student_auth_id
      );
      showToast(`Status updated to ${status}`);
      setSelectedReq(null);
      await loadData();
    } catch (error) {
      console.error(error);
      showToast('Failed to update status: ' + error.message, true);
    } finally {
      setSubmittingAction(false);
    }
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

  return (
    <div className="min-h-screen bg-[#111114]">
      {/* Header */}
      <header className="bg-[#18181b] border-b border-[#27272a] sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <img src="/images/usa-seal.png" alt="USA Seal" className="w-9 h-9 rounded-lg object-contain" />
              <div>
                <h1 className="text-lg font-semibold text-white leading-none">GradReady Faculty</h1>
                <p className="text-zinc-500 text-xs mt-0.5">Department Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex bg-[#27272a] rounded-lg p-1 mr-2">
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'submissions' ? 'bg-[#3f3f46] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Submissions
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors relative ${
                    activeTab === 'notifications' ? 'bg-[#3f3f46] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                   Notifications
                   {notifications?.filter(n => !n.is_read).length > 0 && (
                     <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-maroon rounded-full border-2 border-[#27272a]"></span>
                   )}
                </button>
              </div>

              <button
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

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-10 py-6">
        {loading && !facultyData ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-maroon animate-spin" />
            <p className="text-zinc-500 text-sm">Loading department data...</p>
          </div>
        ) : !facultyData ? (
          <div className="text-center py-20 text-zinc-500">
            <p>No faculty profile found. Please contact administration.</p>
          </div>
        ) : (
          <>
            <div className="animate-fade-in mb-6">
              <FacultyHeader faculty={facultyData} />
            </div>

            <div className="animate-fade-in">
              {activeTab === 'submissions' ? (
                 <SubmissionsTable 
                    requirements={submissions} 
                    onActionClick={setSelectedReq} 
                 />
              ) : (
                 <AdminNotifications 
                    notifications={notifications} 
                    onMarkAsRead={handleMarkAsRead} 
                 />
              )}
            </div>
          </>
        )}
      </main>

      {/* Action Modal */}
      {selectedReq && (
        <StatusUpdateModal 
          requirement={selectedReq}
          onClose={() => setSelectedReq(null)}
          onSubmit={handleUpdateStatus}
          submitting={submittingAction}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 border bg-[#18181b]
            ${toast.isError ? 'border-status-missing/50 text-status-missing' : 'border-[#27272a] text-status-cleared'}`}>
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}
