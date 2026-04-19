import React, { useState, useMemo } from 'react';
import { Search, Hash, BookOpen, Clock, Upload, CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const STUDENTS = [
  {
    id: 1, 
    name: 'Juan Dela Cruz', 
    program: 'BS Information Technology',
    studentId: '2021-00123',
    yearLevel: '4th Year',
    requirements: [
       { id: '1-1', description: 'Capstone Project Proposal', status: 'cleared' },
       { id: '1-2', description: 'OJT Timesheet Submission', status: 'cleared' },
       { id: '1-3', description: 'Department Interview', status: 'cleared' }
    ]
  },
  {
    id: 2, 
    name: 'Ana Reyes', 
    program: 'BS Computer Science',
    studentId: '2021-00456',
    yearLevel: '4th Year',
    requirements: [
       { id: '2-1', description: 'Capstone Project Proposal', status: 'cleared' },
       { id: '2-2', description: 'OJT Timesheet Submission', status: 'submitted' },
       { id: '2-3', description: 'Department Interview', status: 'pending' }
    ]
  },
  {
    id: 3, 
    name: 'Mark Lee', 
    program: 'BS Information Systems',
    studentId: '2021-00789',
    yearLevel: '4th Year',
    requirements: [
       { id: '3-1', description: 'Capstone Project Proposal', status: 'needs_revision' },
       { id: '3-2', description: 'OJT Timesheet Submission', status: 'missing' },
       { id: '3-3', description: 'Department Interview', status: 'pending' }
    ]
  },
  {
    id: 4, 
    name: 'Sarah Kim', 
    program: 'BS Information Technology',
    studentId: '2021-00321',
    yearLevel: '4th Year',
    requirements: [
       { id: '4-1', description: 'Capstone Project Proposal', status: 'cleared' },
       { id: '4-2', description: 'OJT Timesheet Submission', status: 'pending' },
       { id: '4-3', description: 'Department Interview', status: 'cleared' }
    ]
  },
];

const statusConfig = {
  cleared: {
    icon: CheckCircle2,
    label: 'Cleared',
    className: 'status-cleared',
    dotColor: 'bg-status-cleared',
  },
  missing: {
    icon: XCircle,
    label: 'Missing',
    className: 'status-missing',
    dotColor: 'bg-status-missing',
  },
  needs_revision: {
    icon: AlertCircle,
    label: 'Revision',
    className: 'status-revision',
    dotColor: 'bg-status-revision',
  },
  submitted: {
    icon: Upload,
    label: 'Submitted',
    className: 'status-submitted',
    dotColor: 'bg-status-submitted',
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    className: 'status-pending',
    dotColor: 'bg-status-pending',
  },
};

function StudentListCard({ student }) {
  const [expanded, setExpanded] = useState(true);

  const clearedCount = student.requirements.filter((r) => r.status === 'cleared').length;
  const totalCount = student.requirements.length;
  const progressPercent = Math.round((clearedCount / totalCount) * 100);

  const getStatus = () => {
    if (progressPercent === 100) return { text: 'Complete', color: 'text-status-cleared' };
    const hasSubmitted = student.requirements.some(r => r.status === 'submitted');
    if (hasSubmitted) return { text: 'In Progress', color: 'text-[#f59e0b]' }; // Warning color mapped
    return { text: 'Action Needed', color: 'text-status-revision' };
  };

  const studentStatus = getStatus();

  return (
    <div className="card-hover card overflow-hidden" id={`student-card-${student.id}`}>
      {/* Card Header similar to DepartmentCard */}
      <div
        className="p-5 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-xl font-bold text-maroon-light border border-zinc-700">
             {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {student.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{student.studentId}</span>
               <span className="text-[9px] text-zinc-600 bg-zinc-900 px-1 rounded">{student.program}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-widest ${studentStatus.color}`}>
            {studentStatus.text}
          </span>
          <div className="text-zinc-600 cursor-pointer">
             {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-2">
             <span className="text-[10px] font-bold text-zinc-500">{clearedCount}/{totalCount} Cleared</span>
             <span className="text-[10px] font-black text-white">{progressPercent}%</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${progressPercent === 100 ? 'bg-status-cleared' : 'bg-maroon'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
      </div>

      {/* Expanded Requirements list */}
      {expanded && (
        <div className="px-5 pb-5 space-y-2 animate-fade-in border-t border-zinc-900 pt-5">
            {student.requirements.map((req) => {
              const config = statusConfig[req.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-4 group/row cursor-pointer"
                >
                  <div className="flex items-center gap-2 max-w-[70%]">
                     <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                     <p className="text-xs text-zinc-400 font-medium truncate group-hover/row:text-white transition-colors">
                       {req.description}
                     </p>
                  </div>
                  <div className={`status-badge ${config.className} !px-2 !py-0.5 flex-shrink-0`}>
                    <StatusIcon className="w-3 h-3 md:hidden lg:block hidden" />
                    <span className="text-[9px]">{config.label}</span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default function FacultyDashboard() {
  const stats = useMemo(() => {
    let totalReqs = 0, clearedReqs = 0, submittedReqs = 0, pendingReqs = 0, missingReqs = 0, revisionReqs = 0;
    
    STUDENTS.forEach(student => {
      student.requirements.forEach(req => {
        totalReqs++;
        if (req.status === 'cleared') clearedReqs++;
        if (req.status === 'submitted') submittedReqs++;
        if (req.status === 'pending') pendingReqs++;
        if (req.status === 'missing') missingReqs++;
        if (req.status === 'needs_revision') revisionReqs++;
      });
    });

    const progress = totalReqs > 0 ? Math.round((clearedReqs / totalReqs) * 100) : 0;
    return { totalReqs, clearedReqs, submittedReqs, pendingReqs, missingReqs, revisionReqs, progress };
  }, []);

  const statCards = [
    { label: 'Cleared', count: stats.clearedReqs, icon: CheckCircle2, color: 'text-status-cleared', bg: 'bg-status-cleared/10', border: 'border-status-cleared/20' },
    { label: 'Submitted', count: stats.submittedReqs, icon: Upload, color: 'text-status-submitted', bg: 'bg-status-submitted/10', border: 'border-status-submitted/20' },
    { label: 'Pending', count: stats.pendingReqs, icon: Clock, color: 'text-status-pending', bg: 'bg-status-pending/10', border: 'border-status-pending/20' },
    { label: 'Needs Revision', count: stats.revisionReqs, icon: AlertCircle, color: 'text-status-revision', bg: 'bg-status-revision/10', border: 'border-status-revision/20' },
    { label: 'Missing', count: stats.missingReqs, icon: XCircle, color: 'text-status-missing', bg: 'bg-status-missing/10', border: 'border-status-missing/20' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Faculty Header using StudentHeader styling */}
      <div className="card p-6 bg-zinc-900 shadow-sm border-b-4 border-b-maroon">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <span className="text-xl font-bold text-maroon-light">MS</span>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white tracking-tight">Professor Maria Santos</h2>
              <p className="text-zinc-500 font-medium text-xs mt-1">Department of Information Technology</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-zinc-600 font-bold text-[10px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Hash className="w-3 h-3" /> 2018-0045</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> CITE Faculty</span>
              </div>
            </div>
          </div>

          <div className="h-12 w-px bg-zinc-800 hidden md:block" />

          <div className="flex items-center gap-6">
            <div className="text-right">
               <p className="text-2xl font-black text-white">{stats.progress}%</p>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Cleared</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#27272a" strokeWidth="10" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#800000" strokeWidth="10" fill="none" strokeDasharray={`${stats.progress * 2.51} 251`} className="transition-all duration-1000" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview similar to the Student Dashboard one */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`card p-5 border-l-4 ${card.border} group hover:scale-[1.02] transition-all cursor-default`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center transition-transform group-hover:rotate-6`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-black ${card.color} leading-none tracking-tighter`}>{card.count}</p>
                  <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-widest leading-none">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clearance Matrix for Faculty (Student Checklists) */}
      <div className="pt-10 border-t border-zinc-900">
         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-black text-white tracking-tighter">Clearance Matrix</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Student Clearance Status</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                 <input type="text" placeholder="Search students..." className="input-field w-full pl-10 h-9 text-sm" />
               </div>
               <div className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-black text-zinc-400 uppercase tracking-widest shadow-inner whitespace-nowrap">
                  {stats.clearedReqs} / {stats.totalReqs} CLEARED
               </div>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STUDENTS.map((student, index) => (
              <div key={student.id} className="animate-slide-up" style={{ animationDelay: `${index * 30}ms` }}>
                <StudentListCard student={student} />
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
