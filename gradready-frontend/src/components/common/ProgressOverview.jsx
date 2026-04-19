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
      label: 'Revision Needed',
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="card p-4"
            id={`stat-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div>
                <p className={`text-xl font-semibold ${card.color} leading-none`}>
                  {card.count}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{card.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
