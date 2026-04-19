import React from 'react';
import { Shield, Hash, MapPin, Building2 } from 'lucide-react';

export default function FacultyHeader({ faculty }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-maroon flex items-center justify-center border border-maroon-light/20">
            <span className="text-xl font-semibold text-white">
              {faculty?.name?.split(' ').map(n => n[0]).join('') || 'F'}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-status-cleared flex items-center justify-center border-2 border-[#111114]">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Faculty Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white leading-tight">
              {faculty?.name || 'Faculty Member'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-maroon/20 text-maroon-light uppercase tracking-wider">
              <Building2 className="w-3 h-3" />
              {faculty?.departments?.name || 'Department Unknown'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2.5">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
              <Hash className="w-3.5 h-3.5" />
              <span>{faculty?.employee_id || 'ID Unknown'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>{faculty?.position || 'Faculty'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
