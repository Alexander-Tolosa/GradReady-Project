import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Upload } from 'lucide-react';

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
  pending: {
    icon: XCircle,
    label: 'Missing',
    className: 'status-missing',
    dotColor: 'bg-status-missing',
  },
  needs_revision: {
    icon: AlertCircle,
    label: 'Revision Needed',
    className: 'status-revision',
    dotColor: 'bg-status-revision',
  },
  submitted: {
    icon: Upload,
    label: 'Submitted/Pending',
    className: 'status-submitted',
    dotColor: 'bg-status-submitted',
  },
};

export default function DepartmentCard({ department, onRequirementClick }) {
  const clearedCount = department.requirements.filter((r) => r.status === 'cleared').length;
  const totalCount = department.requirements.length;
  const progressPercent = totalCount > 0 ? Math.round((clearedCount / totalCount) * 100) : 0;

  const getDeptStatus = () => {
    if (progressPercent === 100) return { text: 'Complete', color: 'text-status-cleared' };
    if (progressPercent >= 50) return { text: 'In Progress', color: 'text-status-revision' };
    return { text: 'Action Needed', color: 'text-status-missing' };
  };

  const deptStatus = getDeptStatus();

  return (
    <div className="card h-full flex flex-col overflow-hidden" id={`dept-card-${department.id}`}>
      {/* Card Header */}
      <div className="p-4 border-b border-[#27272a] select-none">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">
                {department.name}
              </h3>
              {department.id === 'it-office' && (
                <p className="text-xs text-zinc-500 mt-0.5">Academic Supervisor</p>
              )}
              <p className="text-xs text-zinc-500 mt-0.5">{department.head}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${deptStatus.color}`}>
              {deptStatus.text}
            </span>
          </div>
        </div>

        {/* Mini Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-zinc-500">
              {clearedCount}/{totalCount} cleared
            </span>
            <span className="text-[11px] text-zinc-500">{progressPercent}%</span>
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
      <div className="flex-1 flex flex-col bg-[#141417]">
        {department.requirements.map((req, index) => {
          const config = statusConfig[req.status] || statusConfig['missing']; // Fallback!
          const isClickable = ['missing', 'needs_revision', 'pending'].includes(req.status);

          return (
            <div
              key={req.id || index}
              className={`requirement-row ${isClickable ? 'clickable' : ''} ${
                index !== department.requirements.length - 1
                  ? 'border-b border-[#1e1e21]'
                  : ''
              }`}
              onClick={() => isClickable && onRequirementClick(req)}
              id={`req-${req.id || index}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config?.dotColor || ''}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-zinc-300 truncate">
                    {req.description}
                  </p>
                  {req.revisionNote && (
                    <p className="text-xs text-status-revision/70 mt-0.5 truncate">
                      ⚠ {req.revisionNote}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`status-badge ${config?.className || ''}`}>
                  {config?.label || 'Unknown'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
