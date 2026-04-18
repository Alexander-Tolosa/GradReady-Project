import React, { useState, useMemo } from 'react';
import { Search, Hash, BookOpen } from 'lucide-react';

export default function StudentRoster({ students }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    if (!searchQuery.trim()) return students;
    
    const query = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        (student.name && student.name.toLowerCase().includes(query)) ||
        (student.student_id && student.student_id.toLowerCase().includes(query)) ||
        (student.program && student.program.toLowerCase().includes(query))
    );
  }, [searchQuery, students]);

  return (
    <div className="card flex flex-col h-full min-h-[500px]">
      {/* Header & Search */}
      <div className="p-4 sm:p-6 border-b border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Student Roster</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Manage and track all student clearances</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, ID, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-[#1c1c20] sticky top-0 z-10 text-xs text-zinc-400 uppercase tracking-wider font-medium">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Student Profile</th>
              <th className="px-6 py-4">Program & Year</th>
              <th className="px-6 py-4">Total Reqs</th>
              <th className="px-6 py-4">Clearance Progress</th>
              <th className="px-6 py-4 rounded-tr-lg text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]/50 text-sm">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const isCleared = student.progress === 100;
                return (
                  <tr key={student.id} className="hover:bg-[#1c1c20]/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-maroon/20 text-maroon-light flex items-center justify-center font-semibold text-sm">
                           {student.name?.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-200">{student.name}</p>
                          <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                            <Hash className="w-3 h-3" />
                            {student.student_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-zinc-300">{student.program}</p>
                      <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                        <BookOpen className="w-3 h-3" />
                        {student.year_level}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 font-medium">
                      {student.requirements?.length || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[120px]">
                          <div className="progress-bar-track !h-2">
                            <div
                              className={`progress-bar-fill !h-2 ${isCleared ? '!bg-status-cleared' : ''}`}
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-medium text-zinc-400 w-8">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isCleared ? (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-status-cleared/10 text-status-cleared border border-status-cleared/20">
                           Cleared
                         </span>
                      ) : (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-status-pending/10 text-status-pending border border-status-pending/20">
                           In Progress
                         </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
               <tr>
                 <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                    No students found matching "{searchQuery}"
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
