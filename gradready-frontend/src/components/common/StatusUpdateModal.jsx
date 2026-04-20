import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function StatusUpdateModal({ requirement, onClose, onSubmit, submitting }) {
  const [action, setAction] = useState('cleared'); // 'cleared' or 'needs_revision'
  const [note, setNote] = useState(requirement?.revision_note || '');

  if (!requirement) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl w-full max-w-md shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-[#27272a]">
          <div>
            <h3 className="font-semibold text-white">Status Decision</h3>
            <p className="text-xs text-zinc-500">{requirement.student_name || requirement.students?.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#27272a] rounded-md text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-[#1c1c20] p-3 rounded-lg border border-[#27272a]">
            <p className="text-sm font-medium text-zinc-300">{requirement.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button
                onClick={() => setAction('cleared')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                  action === 'cleared' 
                    ? 'border-status-cleared bg-status-cleared/10 text-status-cleared' 
                    : 'border-[#27272a] bg-[#111114] text-zinc-400 hover:border-[#3f3f46]'
                }`}
             >
                <CheckCircle2 className="w-4 h-4" /> Approve
             </button>
             <button
                onClick={() => setAction('needs_revision')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                  action === 'needs_revision' 
                    ? 'border-[#7f1d1d] bg-[#7f1d1d]/10 text-red-400' 
                    : 'border-[#27272a] bg-[#111114] text-zinc-400 hover:border-[#3f3f46]'
                }`}
             >
                <AlertCircle className="w-4 h-4" /> Need Revision
             </button>
          </div>

          {action === 'needs_revision' && (
            <div className="space-y-1.5 animate-slide-down">
              <label className="text-xs font-medium text-zinc-400">Revision Note (Required)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add remarks or reason for revision..."
                className="w-full h-24 bg-[#111114] border border-[#27272a] rounded-lg p-3 text-sm text-zinc-300 outline-none focus:border-maroon resize-none"
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#27272a] flex gap-3">
           <button
             onClick={onClose}
             className="flex-1 py-2 rounded-lg border border-[#27272a] text-zinc-400 text-sm font-medium hover:bg-[#1c1c1f] transition-colors"
           >
             Cancel
           </button>
           <button
             onClick={() => onSubmit(action, note)}
             disabled={submitting || (action === 'needs_revision' && !note.trim())}
             className="flex-1 bg-maroon hover:bg-maroon-light disabled:bg-[#27272a] disabled:text-zinc-600 rounded-lg text-white text-sm font-medium transition-all flex items-center justify-center"
           >
             {submitting ? 'Updating...' : 'Confirm'}
           </button>
        </div>
      </div>
    </div>
  );
}
