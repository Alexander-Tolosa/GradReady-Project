import React from 'react';
import { CheckCircle2, Clock, Upload, XCircle, AlertTriangle } from 'lucide-react';

export default function ProgressOverview({ stats }) {
  const cards = [
    {
      label: 'Cleared',
      count: stats.clearedReqs,
      icon: CheckCircle2,
      color: 'text-status-cleared',
      bg: 'bg-status-cleared/10',
      border: 'border-status-cleared/20',
    },
    {
      label: 'Submitted',
      count: stats.submittedReqs,
      icon: Upload,
      color: 'text-status-submitted',
      bg: 'bg-status-submitted/10',
      border: 'border-status-submitted/20',
    },
    {
      label: 'Pending',
      count: stats.pendingReqs,
      icon: Clock,
      color: 'text-status-pending',
      bg: 'bg-status-pending/10',
      border: 'border-status-pending/20',
    },
    {
      label: 'Needs Revision',
      count: stats.revisionReqs,
      icon: AlertTriangle,
      color: 'text-status-revision',
      bg: 'bg-status-revision/10',
      border: 'border-status-revision/20',
    },
    {
      label: 'Missing',
      count: stats.missingReqs,
      icon: XCircle,
      color: 'text-status-missing',
      bg: 'bg-status-missing/10',
      border: 'border-status-missing/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`glass-card p-4 border ${card.border} hover:scale-[1.02]`}
            id={`stat-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-heading ${card.color} leading-none`}>
                  {card.count}
                </p>
                <p className="text-[11px] font-body text-white/40 mt-0.5">{card.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
