import React from 'react';
import { Users, Clock, AlertTriangle, Activity, CheckCircle2, XCircle } from 'lucide-react';

const RECENT_REQUESTS = [
  { id: 1, name: 'Juan Dela Cruz', studentId: '2021-00123', department: 'BS Information Technology', item: 'Library Clearance', date: '10/26/2024' },
  { id: 2, name: 'Juan Dela Cruz', studentId: '2021-00123', department: 'BS Information Technology', item: 'Library Clearance', date: '10/26/2024' },
  { id: 3, name: 'Juan Dela Cruz', studentId: '2021-00123', department: 'BS Information Technology', item: 'Library Clearance', date: '10/26/2024' },
  { id: 4, name: 'Juan Dela Cruz', studentId: '2021-00123', department: 'BS Information Technology', item: 'Library Clearance', date: '10/26/2024' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Administrator Dashboard</h2>
        <p className="text-zinc-500 text-sm mt-1">System-wide clearance monitoring and management.</p>
      </div>

      {/* Stats Cards (Screenshot 2 Top) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="2500" icon={Users} color="text-status-cleared" />
        <StatCard label="Pending Clearances" value="450" icon={Clock} color="text-status-submitted" />
        <StatCard label="Flagged Revisions" value="75" icon={AlertTriangle} color="text-status-revision" />
        <StatCard label="System Status" value="Active" icon={Activity} color="text-status-cleared" />
      </div>

      {/* Recent Requests Table (Screenshot 2 Bottom) */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent Clearance Requests</h3>
          <button className="text-xs font-semibold text-maroon-light hover:text-white transition-colors">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50 text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Clearance Item</th>
                <th className="px-6 py-4">Date Submitted</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {RECENT_REQUESTS.map((req) => (
                <tr key={req.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-zinc-200">{req.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-500 font-mono">{req.studentId}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400">
                    {req.department}
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400">
                    {req.item}
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">
                    {req.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="status-badge status-cleared hover:scale-105">Approve</button>
                      <button className="status-badge status-missing hover:scale-105">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="card p-6 border-l-4 border-l-maroon flex items-center justify-between group hover:border-l-maroon-light transition-all">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">{label}</p>
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  );
}
