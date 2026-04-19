import React from 'react';
import { Shield, Bell, Monitor, ChevronRight, Lock, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">System Settings</h2>
        <p className="text-zinc-500 text-sm mt-1">Manage your account security and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Account Security (Screenshot 4 Left) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-white">Account Security</h3>
          </div>
          
          <div className="card p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Change Password</p>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Current Password</label>
                  <div className="relative">
                    <input type="password" placeholder="••••••••" className="input-field w-full pr-10" />
                    <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">New Password</label>
                  <div className="relative">
                    <input type="password" placeholder="••••••••" className="input-field w-full pr-10" />
                    <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Confirm Password</label>
                  <div className="relative">
                    <input type="password" placeholder="••••••••" className="input-field w-full pr-10" />
                    <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 cursor-pointer" />
                  </div>
                </div>
              </div>

              <button className="btn btn-maroon w-full py-2.5 mt-2">Update Password</button>
            </div>

            <div className="pt-6 border-t border-zinc-800">
               <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-zinc-200">Two-Factor Authentication (2FA)</p>
                    <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">Enhance your account security by requiring an authentication code from your mobile device.</p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-maroon" />
                    <span className="ml-3 text-xs font-bold text-zinc-400">ON</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Display */}
        <div className="space-y-8">
          
          {/* Notification Preferences */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
            <div className="card p-6 space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-200">Email Alerts for Clearance Updates</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-maroon" />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Alert Frequency</label>
                  <select className="input-field w-full h-11 appearance-none bg-zinc-900">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Immediate</option>
                  </select>
               </div>
            </div>
          </section>

          {/* Display Settings */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">Display Settings</h3>
            <div className="card p-6 space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-200">Dark Mode</span>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] text-zinc-600 font-bold uppercase">disabled</span>
                     <div className="relative inline-flex items-center">
                        <input type="checkbox" value="" className="sr-only peer" disabled />
                        <div className="w-11 h-6 bg-zinc-800 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-600 after:rounded-full after:h-5 after:w-5 cursor-not-allowed" />
                     </div>
                     <span className="text-[10px] text-zinc-400 font-bold uppercase">Fixed</span>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Theme Accent Color</label>
                  <select className="input-field w-full h-11 bg-zinc-900 border-maroon/30 text-maroon-light">
                    <option>Crimson</option>
                    <option>Maroon</option>
                    <option>Deep Red</option>
                  </select>
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Language</label>
                  <select className="input-field w-full h-11 bg-zinc-900">
                    <option>English</option>
                    <option>Tagalog</option>
                    <option>Hiligaynon</option>
                  </select>
               </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
