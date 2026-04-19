import React, { useState, useEffect } from 'react';
import ProfileDetails from '../../components/common/ProfileDetails';
import { clearanceService } from '../../services/clearanceService';
import { User, Shield, CreditCard, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await clearanceService.fetchStudentProfile();
        setStudentData(profile);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 h-full">
        <Loader2 className="w-10 h-10 text-maroon animate-spin" />
        <p className="text-zinc-500 font-medium font-mono uppercase tracking-widest text-[10px]">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Student Profile</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage your personal and academic records.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="btn btn-secondary">Edit Information</button>
           <button className="btn btn-maroon">Request Update</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           {/* Simple Identity Card */}
           <div className="card p-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center mb-4">
                 <span className="text-3xl font-black text-maroon-light">
                    {studentData?.name.split(' ').map(n=>n[0]).join('')}
                 </span>
              </div>
              <h3 className="text-xl font-bold text-white">{studentData?.name}</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">{studentData?.program}</p>
              <div className="mt-6 pt-6 border-t border-zinc-900 w-full flex items-center justify-center gap-8">
                 <div className="text-center">
                    <p className="text-lg font-black text-white">{studentData?.yearLevel}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Year</p>
                 </div>
                 <div className="text-center">
                    <p className="text-lg font-black text-white">Active</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Status</p>
                 </div>
              </div>
           </div>

           <div className="card p-6 bg-zinc-900/50">
              <div className="flex items-center gap-3 mb-4">
                 <Shield className="w-4 h-4 text-maroon-light" />
                 <h4 className="text-sm font-bold text-white">Security & Privacy</h4>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                 Your data is protected and only visible to authorized departments for clearance purposes.
              </p>
           </div>
        </div>

        <div className="lg:col-span-2">
           <ProfileDetails student={studentData} />
        </div>
      </div>
    </div>
  );
}
