import React, { useState, useEffect, useMemo } from 'react';
import { Building2, MapPin, LogOut, Loader2 } from 'lucide-react';
import StudentHeader from '../../components/layout/StudentHeader';
import DepartmentCard from '../../components/common/DepartmentCard';
import ProgressOverview from '../../components/common/ProgressOverview';
import InfoDirectory from '../../components/common/InfoDirectory';
import UploadModal from '../../components/common/UploadModal';
import { authService } from '../../services/authService';
import { clearanceService } from '../../services/clearanceService';
import { storageService } from '../../services/storageService';

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [showDirectory, setShowDirectory] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [notification, setNotification] = useState(null);

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
      const fileUrl = await storageService.uploadDocument(file, departmentId, requirementId);
      await clearanceService.updateRequirementStatus(requirementId, 'submitted', fileUrl);
      await loadData();

      setSelectedRequirement(null);
      showNotification(`"${file.name}" uploaded successfully`);
    } catch (error) {
      console.error(error);
      showNotification('Upload failed: ' + error.message, true);
    } finally {
      setLoading(false);
    }
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
              <img src="/images/usa-seal.png" alt="USA Seal" className="w-9 h-9 rounded-lg object-contain" />
              <div>
                <h1 className="text-lg font-semibold text-white leading-none">GradReady</h1>
                <p className="text-zinc-500 text-xs mt-0.5">University of San Agustin</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="toggle-directory-btn"
                onClick={() => setShowDirectory(!showDirectory)}
                className="flex items-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {showDirectory ? (
                  <><Building2 className="w-4 h-4" /><span className="hidden sm:inline">Clearance Matrix</span></>
                ) : (
                  <><MapPin className="w-4 h-4" /><span className="hidden sm:inline">Office Directory</span></>
                )}
              </button>
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

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-10 py-6">
        {loading && !departments.length ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-maroon animate-spin" />
            <p className="text-zinc-500 text-sm">Loading your clearance data...</p>
          </div>
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
        ) : (
          <div className="text-center py-20 text-zinc-500">
            <p>No student profile found. Please contact the registrar.</p>
          </div>
        )}
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

      {/* Footer */}
      <footer className="border-t border-[#27272a] mt-12">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <p>© 2026 University of San Agustin - GradReady. All rights reserved.</p>
            <p>Student Clearance Tracking System v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
