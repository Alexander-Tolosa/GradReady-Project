import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Hash, BookOpen } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    pending: { color: 'text-zinc-400 bg-zinc-800/50 border-zinc-700', label: 'Pending' },
    submitted: { color: 'text-blue-400 bg-blue-900/20 border-blue-800/50', label: 'Under Review' },
    needs_revision: { color: 'text-amber-400 bg-amber-900/20 border-amber-800/50', label: 'Needs Revision' },
    missing: { color: 'text-red-400 bg-red-900/20 border-red-800/50', label: 'Missing' },
    cleared: { color: 'text-green-400 bg-green-900/20 border-green-800/50', label: 'Cleared' }
  };
  const current = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${current.color} whitespace-nowrap`}>
      {current.label}
    </span>
  );
};

export default function SubmissionsTable({ requirements, onActionClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, submitted, needs_revision, cleared

  const filteredData = useMemo(() => {
    if (!requirements) return [];
    return requirements.filter(req => {
      // Status filter
      if (filterStatus !== 'all' && req.status !== filterStatus) return false;
      
      // Search filter
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const studentName = req.students?.name?.toLowerCase() || '';
      const studentId = req.students?.student_id?.toLowerCase() || '';
      const desc = req.description?.toLowerCase() || '';
      
      return studentName.includes(query) || studentId.includes(query) || desc.includes(query);
    });
  }, [requirements, searchQuery, filterStatus]);

  return (
    <div className="card flex flex-col h-full">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-[#27272a] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <h3 className="text-base font-semibold text-white">Department Submissions</h3>
             <p className="text-xs text-zinc-500 mt-0.5">Review and update student requirements.</p>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-3">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#1c1c1f] border border-[#27272a] rounded-lg text-sm text-zinc-300 px-3 py-2 outline-none focus:border-maroon"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Under Review</option>
                <option value="needs_revision">Needs Revision</option>
                <option value="cleared">Cleared</option>
              </select>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search student or req..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input py-2 pl-9"
                />
              </div>
           </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto min-h-[400px]">
        <table className="w-full text-left min-w-[700px]">
           <thead className="bg-[#1c1c20] sticky top-0 z-10 text-xs text-zinc-400 uppercase tracking-wider font-medium">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Requirement</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-center">Document</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-[#27272a]/50 text-sm">
             {filteredData.length > 0 ? (
               filteredData.map(req => (
                 <tr key={req.id} className="hover:bg-[#1c1c20]/50 transition-colors">
                   <td className="px-5 py-3">
                      <p className="font-medium text-zinc-200">{req.students?.name}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                        <span className="flex items-center gap-0.5"><Hash className="w-3 h-3"/> {req.students?.student_id}</span>
                        <span className="flex items-center gap-0.5"><BookOpen className="w-3 h-3"/> {req.students?.program}</span>
                      </div>
                   </td>
                   <td className="px-5 py-3">
                      <p className="text-zinc-300 line-clamp-2" title={req.description}>{req.description}</p>
                      {req.revision_note && req.status === 'needs_revision' && (
                        <p className="text-xs text-amber-500/80 mt-1 line-clamp-1 italic">Note: {req.revision_note}</p>
                      )}
                   </td>
                   <td className="px-5 py-3 text-center">
                     <StatusBadge status={req.status} />
                   </td>
                   <td className="px-5 py-3 text-center">
                      {req.uploaded_file_url ? (
                        <a 
                          href={req.uploaded_file_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-900/10 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 transition-colors text-xs font-medium border border-blue-900/30"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View
                        </a>
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                   </td>
                   <td className="px-5 py-3 text-right">
                      {req.status === 'submitted' || req.status === 'needs_revision' ? (
                        <button
                          onClick={() => onActionClick(req)}
                          className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                        >
                          Update
                        </button>
                      ) : req.status === 'cleared' ? (
                        <span className="text-zinc-600 text-xs italic">Reviewed</span>
                      ) : (
                        <span className="text-zinc-600 text-xs italic">Waiting</span>
                      )}
                   </td>
                 </tr>
               ))
             ) : (
               <tr>
                 <td colSpan="5" className="px-5 py-10 text-center text-zinc-500 bg-[#141417]/30">
                    No submissions found matching criteria.
                 </td>
               </tr>
             )}
           </tbody>
        </table>
      </div>
    </div>
  );
}
