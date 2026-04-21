import React from 'react';

export default function DashboardStatCard({ label, value, icon: Icon, valueColor = "text-white" }) {
  return (
    <div className="bg-[#18181b] rounded-xl p-6 relative overflow-hidden border border-[#27272a] group shadow-sm">
      <div className="relative z-10 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{label}</p>
        <p className={`text-4xl font-black tracking-tighter ${valueColor}`}>{value ?? '—'}</p>
      </div>
      <div className="absolute -right-6 -bottom-6 text-white/[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
        {Icon && <Icon className="w-32 h-32" strokeWidth={1.5} />}
      </div>
    </div>
  );
}
