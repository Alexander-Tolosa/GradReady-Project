import React, { useState, useMemo } from 'react';
import { Building2, MapPin, GraduationCap } from 'lucide-react';
import StudentHeader from './components/layout/StudentHeader';
import DepartmentCard from './components/common/DepartmentCard';
import ProgressOverview from './components/common/ProgressOverview';
import InfoDirectory from './components/common/InfoDirectory';
import UploadModal from './components/common/UploadModal';

const initialDepartments = [
  {
    id: 'library',
    name: 'University Library',
    icon: '📚',
    head: 'Ms. Elena R. Santos',
    requirements: [
      { id: 'lib-1', description: 'Return all borrowed books', status: 'cleared', dueDate: '2025-03-15' },
      { id: 'lib-2', description: 'Settle overdue fines', status: 'pending', dueDate: '2025-03-20' },
      { id: 'lib-3', description: 'Library clearance form', status: 'pending', dueDate: '2025-03-25' },
    ],
  },
  {
    id: 'registrar',
    name: "Registrar's Office",
    icon: '📋',
    head: 'Dr. Marco L. Villanueva',
    requirements: [
      { id: 'reg-1', description: 'Updated academic records', status: 'submitted', dueDate: '2025-03-10' },
      { id: 'reg-2', description: 'Enrollment verification', status: 'cleared', dueDate: '2025-03-12' },
      { id: 'reg-3', description: 'Transcript request form', status: 'needs_revision', revisionNote: 'Please re-upload with correct student ID number.', dueDate: '2025-03-18' },
    ],
  },
  {
    id: 'dean',
    name: "Dean's Office (CITE)",
    icon: '🎓',
    head: 'Dr. Anna Mae T. Cruz',
    requirements: [
      { id: 'dean-1', description: 'Course completion certificate', status: 'cleared', dueDate: '2025-03-08' },
      { id: 'dean-2', description: 'Thesis/Capstone defense clearance', status: 'missing', dueDate: '2025-03-22' },
      { id: 'dean-3', description: 'OJT completion report', status: 'submitted', dueDate: '2025-03-20' },
    ],
  },
  {
    id: 'accounting',
    name: 'Accounting Office',
    icon: '💰',
    head: 'Mr. Roberto A. Domingo',
    requirements: [
      { id: 'acc-1', description: 'Full tuition payment', status: 'cleared', dueDate: '2025-02-28' },
      { id: 'acc-2', description: 'Lab fee settlement', status: 'cleared', dueDate: '2025-03-01' },
      { id: 'acc-3', description: 'Miscellaneous fees clearance', status: 'pending', dueDate: '2025-03-15' },
    ],
  },
  {
    id: 'student-affairs',
    name: 'Student Affairs Office',
    icon: '🤝',
    head: 'Ms. Patricia G. Reyes',
    requirements: [
      { id: 'sa-1', description: 'Community service completion', status: 'cleared', dueDate: '2025-03-05' },
      { id: 'sa-2', description: 'Student organization clearance', status: 'submitted', dueDate: '2025-03-18' },
      { id: 'sa-3', description: 'Disciplinary record check', status: 'cleared', dueDate: '2025-03-10' },
    ],
  },
  {
    id: 'dormitory',
    name: 'Dormitory Management',
    icon: '🏠',
    head: 'Mr. Angelo J. Ferrer',
    requirements: [
      { id: 'dorm-1', description: 'Room key return', status: 'pending', dueDate: '2025-03-25' },
      { id: 'dorm-2', description: 'Room inspection clearance', status: 'pending', dueDate: '2025-03-28' },
      { id: 'dorm-3', description: 'Utility bills settlement', status: 'missing', dueDate: '2025-03-20' },
    ],
  },
];

const studentData = {
  name: 'Juan Dela Cruz',
  studentId: '2021-00123',
  program: 'BS Information Technology',
  college: 'College of Information Technology Education',
  yearLevel: '4th Year',
  semester: '2nd Semester, A.Y. 2024-2025',
  avatar: null,
};

export default function App() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [showDirectory, setShowDirectory] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [notification, setNotification] = useState(null);

  const stats = useMemo(() => {
    const totalReqs = departments.reduce((acc, d) => acc + d.requirements.length, 0);
    const clearedReqs = departments.reduce(
      (acc, d) => acc + d.requirements.filter((r) => r.status === 'cleared').length,
      0
    );
    const submittedReqs = departments.reduce(
      (acc, d) => acc + d.requirements.filter((r) => r.status === 'submitted').length,
      0
    );
    const pendingReqs = departments.reduce(
      (acc, d) => acc + d.requirements.filter((r) => r.status === 'pending').length,
      0
    );
    const missingReqs = departments.reduce(
      (acc, d) => acc + d.requirements.filter((r) => r.status === 'missing').length,
      0
    );
    const revisionReqs = departments.reduce(
      (acc, d) => acc + d.requirements.filter((r) => r.status === 'needs_revision').length,
      0
    );
    const progress = totalReqs > 0 ? Math.round((clearedReqs / totalReqs) * 100) : 0;

    return { totalReqs, clearedReqs, submittedReqs, pendingReqs, missingReqs, revisionReqs, progress };
  }, [departments]);

  const handleRequirementClick = (department, requirement) => {
    if (requirement.status === 'missing' || requirement.status === 'needs_revision' || requirement.status === 'pending') {
      setSelectedRequirement({ department, requirement });
    }
  };

  const handleUpload = (departmentId, requirementId, file) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === departmentId
          ? {
              ...dept,
              requirements: dept.requirements.map((req) =>
                req.id === requirementId
                  ? { ...req, status: 'submitted', uploadedFile: file.name }
                  : req
              ),
            }
          : dept
      )
    );
    setSelectedRequirement(null);
    showNotification(`"${file.name}" uploaded successfully`);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#111114]">
      {/* Header */}
      <header className="bg-[#18181b] border-b border-[#27272a]">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-maroon rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white leading-none">
                  GradReady
                </h1>
                <p className="text-zinc-500 text-xs mt-0.5">
                  University of San Agustin
                </p>
              </div>
            </div>

            <button
              id="toggle-directory-btn"
              onClick={() => setShowDirectory(!showDirectory)}
              className="flex items-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {showDirectory ? (
                <>
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clearance Matrix</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Office Directory</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-10 py-6">
        {showDirectory ? (
          <div className="animate-fade-in">
            <InfoDirectory />
          </div>
        ) : (
          <>
            {/* Student Info & Progress */}
            <div className="animate-fade-in">
              <StudentHeader student={studentData} stats={stats} />
            </div>

            {/* Progress Overview */}
            <div className="mt-6 animate-fade-in">
              <ProgressOverview stats={stats} />
            </div>

            {/* Department Cards Grid */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Clearance Matrix
                </h2>
                <span className="text-xs text-zinc-500">
                  {stats.clearedReqs}/{stats.totalReqs} requirements cleared
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept, index) => (
                  <div
                    key={dept.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <DepartmentCard
                      department={dept}
                      onRequirementClick={(req) => handleRequirementClick(dept, req)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Upload Modal */}
      {selectedRequirement && (
        <UploadModal
          department={selectedRequirement.department}
          requirement={selectedRequirement.requirement}
          onClose={() => setSelectedRequirement(null)}
          onUpload={handleUpload}
        />
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-[#18181b] border border-[#27272a] text-status-cleared px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {notification}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#27272a] mt-12">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <p>© 2025 GradReady — University of San Agustin, Iloilo City</p>
            <p>Student Clearance Tracking System v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
