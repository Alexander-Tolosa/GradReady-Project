import React from 'react';
import { Users, FileText, CheckCircle2, Clock, Upload, XCircle, AlertTriangle } from 'lucide-react';

export default function AdminStatsOverview({ stats }) {
  if (!stats) return null;

  const mainCards = [
    {
      label: 'Total Students',
      count: stats.totalStudents,
      icon: Users,
      color: 'text-zinc-200',
      bg: 'bg-zinc-800/50',
    },
    {
      label: 'Total Reqs',
      count: stats.totalReqs,
      icon: FileText,
      color: 'text-zinc-400',
      bg: 'bg-zinc-800/30',
    }
  ];

  const statusCards = [
    {
      label: 'Cleared',
      count: stats.clearedReqs,
      icon: CheckCircle2,
      color: 'text-status-cleared',
      bg: 'bg-status-cleared/10',
    },
    {
      label: 'Submitted',
      count: stats.submittedReqs,
      icon: Upload,
      color: 'text-status-submitted',
      bg: 'bg-status-submitted/10',
    },
    {
      label: 'Pending',
      count: stats.pendingReqs,
      icon: Clock,
      color: 'text-status-pending',
      bg: 'bg-status-pending/10',
    },
    {
      label: 'Revision',
      count: stats.revisionReqs,
      icon: AlertTriangle,
      color: 'text-status-revision',
      bg: 'bg-status-revision/10',
    },
    {
      label: 'Missing',
      count: stats.missingReqs,
      icon: XCircle,
      color: 'text-status-missing',
      bg: 'bg-status-missing/10',
    },
  ];

  const allCards = [...mainCards, ...statusCards];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
      {allCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="card p-3 sm:p-4"
            id={`stat-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div>
                <p className={`text-lg sm:text-xl font-semibold ${card.color} leading-none`}>
                  {card.count}
                </p>
                <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1 uppercase tracking-wider">{card.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
