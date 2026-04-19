import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Upload, CreditCard, CheckCircle2, AlertCircle, Clock, ChevronDown } from 'lucide-react';

export default function ClearanceDetail({ session }) {
  const navigate = useNavigate();
  const { departmentId } = useParams();
  
  // Mock data matching Screenshot 5 (University Library)
  const [department] = useState({
    name: 'University Library',
    head: 'Ms. Elena R. Santos',
    progress: 33,
    requirements: [
      { id: 1, text: 'Return all borrowed books', status: 'cleared' },
      { id: 2, text: 'Settle overdue fines', status: 'pending', action: 'Pay Online' },
      { id: 3, text: 'Library clearance form', status: 'pending', action: 'Upload' },
    ]
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Clearance Matrix
      </button>

      {/* Detail Card (Screenshot 5) */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-zinc-800">
           <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-black text-white">{department.name}</h2>
                <p className="text-zinc-500 font-medium text-sm mt-1">Head: {department.head}</p>
              </div>
              <div className="flex items-center gap-2 text-status-missing bg-status-missing/10 px-3 py-1.5 rounded-lg border border-status-missing/20">
                 <span className="text-xs font-bold uppercase tracking-wider">Action Needed</span>
                 <ChevronDown className="w-4 h-4" />
              </div>
           </div>

           <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">1/3 cleared ({department.progress}%)</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-maroon transition-all duration-1000" style={{ width: `${department.progress}%` }} />
              </div>
           </div>
        </div>

        {/* Requirements Checklist */}
        <div className="p-4 space-y-2 bg-zinc-950/30">
          {department.requirements.map((req) => (
            <div key={req.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors group">
              <div className="flex items-center gap-4">
                 <div className={`w-5 h-5 rounded border ${req.status === 'cleared' ? 'bg-status-cleared border-status-cleared' : 'border-zinc-700'} flex items-center justify-center`}>
                    {req.status === 'cleared' && <CheckCircle2 className="w-3 h-3 text-white" />}
                 </div>
                 <span className={`text-sm font-medium ${req.status === 'cleared' ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                    {req.text}
                 </span>
              </div>

              <div className="flex items-center gap-4">
                 <div className={`status-badge ${req.status === 'cleared' ? 'status-cleared' : 'status-revision'}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {req.status === 'cleared' ? 'CLEARED' : 'PENDING'}
                 </div>
                 {req.action === 'Pay Online' && (
                   <button className="btn btn-secondary py-1.5 px-4 text-xs font-bold">Pay Online</button>
                 )}
                 {req.action === 'Upload' && (
                   <button className="btn btn-secondary py-1.5 px-4 text-xs font-bold flex items-center gap-2">
                     <Upload className="w-3.5 h-3.5" /> Upload
                   </button>
                 )}
              </div>
            </div>
          ))}
        </div>

        {/* Upload Dropzone (Screenshot 5 Bottom) */}
        <div className="p-8 border-t border-zinc-900">
           <div className="upload-zone border-dashed border-2 border-zinc-800 rounded-2xl p-12 text-center bg-zinc-950/20 hover:border-maroon/50 transition-all cursor-pointer group">
              <Upload className="w-10 h-10 text-zinc-600 mx-auto mb-4 group-hover:text-maroon-light group-hover:scale-110 transition-all" />
              <h4 className="text-lg font-bold text-white mb-2">Upload Clearance Documents</h4>
              <p className="text-zinc-500 text-sm">Drag & drop your files here or <span className="text-maroon-light underline font-semibold">Browse</span></p>
              <p className="text-[11px] text-zinc-600 mt-4 uppercase tracking-widest font-bold">PDF, JPG, PNG (Max 5MB)</p>
           </div>
        </div>
      </div>
    </div>
  );
}
