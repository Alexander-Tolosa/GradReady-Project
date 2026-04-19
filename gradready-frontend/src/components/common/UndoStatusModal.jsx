import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';

export default function UndoStatusModal({ requirement, onClose, onUndo, submitting }) {
  if (!requirement) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl w-full max-w-sm shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-[#27272a]">
          <div>
            <h3 className="font-semibold text-white">Undo Status Change</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#27272a] rounded-md text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <RotateCcw className="w-6 h-6" />
          </div>
          <p className="text-sm text-zinc-300 mb-2">
            Are you sure you want to revert the status for <span className="font-semibold text-white">{requirement.description}</span>?
          </p>
          <p className="text-xs text-zinc-500">
            Reverting will put this requirement back to "Pending" status and require the student to resubmit.
          </p>
        </div>

        <div className="p-4 border-t border-[#27272a] flex gap-3">
           <button
             onClick={onClose}
             className="flex-1 py-2 rounded-lg border border-[#27272a] text-zinc-400 text-sm font-medium hover:bg-[#1c1c1f] transition-colors"
           >
             Cancel
           </button>
           <button
             onClick={() => onUndo(requirement.id)}
             disabled={submitting}
             className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-[#27272a] disabled:text-zinc-600 rounded-lg text-white text-sm font-medium transition-all flex items-center justify-center"
           >
             {submitting ? 'Reverting...' : 'Confirm Revert'}
           </button>
        </div>
      </div>
    </div>
  );
}
