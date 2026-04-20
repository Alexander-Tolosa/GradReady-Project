import React, { useState, useMemo, useEffect } from 'react';
import { Search, Shield, Building2, User } from 'lucide-react';

export default function ManageRoles({ users, onUpdateRole }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'student', 'faculty', 'admin'

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      // Filter by tab
      if (activeTab !== 'all' && user.derivedRole !== activeTab) return false;
      
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = user.name && user.name.toLowerCase().includes(query);
        const matchesRole = user.derivedRole && user.derivedRole.toLowerCase().includes(query);
        const matchesDept = user.assignedDepartment && user.assignedDepartment.toLowerCase().includes(query);
        return matchesName || matchesRole || matchesDept;
      }
      return true;
    });
  }, [users, searchQuery, activeTab]);

  return (
    <div className="card flex flex-col h-full min-h-[500px]">
      <div className="p-4 sm:p-6 border-b border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-lg font-semibold text-white">System Users & Roles</h2>
           <p className="text-sm text-zinc-500 mt-0.5">Directory of all registered accounts.</p>
        </div>
        <div className="relative w-full sm:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
           <input
             type="text"
             placeholder="Search name or role..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="search-input"
           />
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 border-b border-[#27272a]">
        <div className="flex items-center gap-6 overflow-x-auto custom-scrollbar pb-[-1px]">
          {['all', 'student', 'faculty', 'admin'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium whitespace-nowrap capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-maroon text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              {tab === 'all' ? 'All Roles' : `${tab}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.id} className="bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] rounded-xl p-4 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center flex-shrink-0 text-zinc-400">
                    {user.derivedRole === 'admin' ? <Shield className="w-5 h-5"/> : user.derivedRole === 'faculty' ? <Building2 className="w-5 h-5"/> : <User className="w-5 h-5"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-200 truncate">{user.name || 'Unnamed User'}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-medium">{user.derivedRole}</p>
                    {user.assignedDepartment && (
                      <p className="text-xs text-zinc-400 mt-1 truncate">{user.assignedDepartment}</p>
                    )}
                    <p className="text-[10px] text-zinc-600 mt-2">
                       Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>   
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-zinc-500">
              No users found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
