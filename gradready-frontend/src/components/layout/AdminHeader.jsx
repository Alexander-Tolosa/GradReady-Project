import React from 'react';
import { Shield } from 'lucide-react';

export default function AdminHeader({ admin, stats }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-maroon flex items-center justify-center">
            <span className="text-xl font-semibold text-white">
              {admin?.name?.split(' ').map(n => n[0]).join('') || 'A'}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-status-cleared flex items-center justify-center border-2 border-[#111114]">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Admin Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white leading-tight">
            {admin?.name || 'Administrator'}
          </h2>
          <div className="flex items-center gap-1 mt-1.5">
            <Shield className="w-3 h-3 text-maroon-light" />
            <span className="text-xs font-medium text-maroon-light uppercase tracking-wider">System Admin</span>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex-shrink-0">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="#27272a" strokeWidth="6" fill="none" />
              <circle
                cx="50" cy="50" r="42"
                stroke="#7f1d1d"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(stats?.overallProgress || 0) * 2.64} ${264 - (stats?.overallProgress || 0) * 2.64}`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-semibold text-white leading-none">
                {stats?.overallProgress || 0}%
              </span>
              <span className="text-[10px] text-zinc-500 mt-0.5">cleared</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
