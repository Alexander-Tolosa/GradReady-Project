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
    showNotification(`✅ "${file.name}" uploaded successfully!`);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] relative">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-usa-maroon/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-usa-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-usa-maroon/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-usa-maroon via-usa-maroon-light to-usa-maroon border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <GraduationCap className="w-7 h-7 text-usa-gold" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl text-white tracking-wider leading-none">
                  GradReady
                </h1>
                <p className="text-white/50 text-xs font-body tracking-wide mt-0.5">
                  University of San Agustin
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="toggle-directory-btn"
                onClick={() => setShowDirectory(!showDirectory)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-300 border border-white/10 hover:border-white/20"
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
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="mt-8 animate-slide-up">
              <ProgressOverview stats={stats} />
            </div>

            {/* Department Cards Grid */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl text-white tracking-wider">
                  Clearance Matrix
                </h2>
                <span className="text-sm font-body text-white/40">
                  {stats.clearedReqs}/{stats.totalReqs} requirements cleared
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {departments.map((dept, index) => (
                  <div
                    key={dept.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 80}ms` }}
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
          <div className="bg-[#1a1a2e] border border-status-cleared/30 text-status-cleared px-5 py-3.5 rounded-xl shadow-2xl font-body text-sm font-medium flex items-center gap-2">
            {notification}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body text-white/30">
            <p>© 2025 GradReady — University of San Agustin, Iloilo City</p>
            <p>Student Clearance Tracking System v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
