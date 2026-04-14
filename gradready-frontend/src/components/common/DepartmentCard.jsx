import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock, Upload, ChevronDown, ChevronUp } from 'lucide-react';

const statusConfig = {
  cleared: {
    icon: CheckCircle2,
    label: 'Cleared',
    className: 'status-cleared',
    dotColor: 'bg-status-cleared',
  },
  missing: {
    icon: XCircle,
    label: 'Missing',
    className: 'status-missing',
    dotColor: 'bg-status-missing',
  },
  needs_revision: {
    icon: AlertCircle,
    label: 'Revision',
    className: 'status-revision',
    dotColor: 'bg-status-revision',
  },
  submitted: {
    icon: Upload,
    label: 'Submitted',
    className: 'status-submitted',
    dotColor: 'bg-status-submitted',
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    className: 'status-pending',
    dotColor: 'bg-status-pending',
  },
};

export default function DepartmentCard({ department, onRequirementClick }) {
  const [expanded, setExpanded] = useState(true);

  const clearedCount = department.requirements.filter((r) => r.status === 'cleared').length;
  const totalCount = department.requirements.length;
  const progressPercent = Math.round((clearedCount / totalCount) * 100);

  const getDeptProgress = () => {
    if (progressPercent === 100) return { text: 'Complete', color: 'text-status-cleared' };
    if (progressPercent >= 50) return { text: 'In Progress', color: 'text-usa-gold' };
    return { text: 'Action Needed', color: 'text-status-missing' };
  };

  const deptStatus = getDeptProgress();

  return (
    <div className="glass-card overflow-hidden group" id={`dept-card-${department.id}`}>
      {/* Card Header */}
      <div
        className="p-5 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{department.icon}</span>
            <div>
              <h3 className="text-base font-body font-semibold text-white leading-tight">
                {department.name}
              </h3>
              <p className="text-xs font-body text-white/30 mt-0.5">{department.head}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-body font-semibold ${deptStatus.color}`}>
              {deptStatus.text}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-white/30" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/30" />
            )}
          </div>
        </div>

        {/* Mini Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-body text-white/40">
              {clearedCount}/{totalCount} cleared
            </span>
            <span className="text-[11px] font-body text-white/40">{progressPercent}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Requirements List */}
      {expanded && (
        <div className="px-3 pb-3 animate-slide-down">
          <div className="bg-white/[0.02] rounded-xl overflow-hidden">
            {department.requirements.map((req, index) => {
              const config = statusConfig[req.status];
              const StatusIcon = config.icon;
              const isClickable = ['missing', 'needs_revision', 'pending'].includes(req.status);

              return (
                <div
                  key={req.id}
                  className={`requirement-row ${isClickable ? 'clickable' : ''} ${
                    index !== department.requirements.length - 1
                      ? 'border-b border-white/[0.03]'
                      : ''
                  }`}
                  onClick={() => isClickable && onRequirementClick(req)}
                  id={`req-${req.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dotColor}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-body text-white/80 truncate">
                        {req.description}
                      </p>
                      {req.revisionNote && (
                        <p className="text-xs font-body text-status-revision/70 mt-0.5 truncate">
                          ⚠ {req.revisionNote}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`status-badge ${config.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
