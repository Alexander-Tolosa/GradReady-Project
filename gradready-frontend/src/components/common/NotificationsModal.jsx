import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';

export default function NotificationsModal({ notifications, onClose, onMarkAsRead }) {
  const getIcon = (type, isRead) => {
    switch (type) {
      case 'status_update': 
        return <CheckCircle2 className={`w-5 h-5 ${isRead ? 'text-zinc-600' : 'text-status-cleared'}`} />;
      case 'revision_requested': 
        return <AlertCircle className={`w-5 h-5 ${isRead ? 'text-zinc-600' : 'text-status-revision'}`} />;
      default: 
        return <Info className={`w-5 h-5 ${isRead ? 'text-zinc-600' : 'text-blue-400'}`} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl w-full max-w-md shadow-2xl animate-scale-in flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-[#27272a]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-zinc-400" />
            <h3 className="font-semibold text-white">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
             <button 
               onClick={onMarkAsRead}
               className="text-xs text-maroon hover:text-maroon-light font-medium transition-colors bg-maroon/10 px-2 py-1 rounded"
             >
               Mark all as read
             </button>
             <button 
               onClick={onClose}
               className="p-1 hover:bg-[#27272a] rounded-md text-zinc-500 hover:text-white transition-colors"
             >
               <X className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-3">
          {notifications && notifications.length > 0 ? (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-3 rounded-lg border flex gap-3 ${
                  notif.is_read ? 'bg-[#111114] border-[#27272a]' : 'bg-[#1c1c20] border-maroon/30 shadow-sm'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {getIcon(notif.type, notif.is_read)}
                </div>
                <div className="flex-1 min-w-0">
                   <p className={`text-sm ${notif.is_read ? 'text-zinc-400' : 'text-zinc-200 font-medium'}`}>
                     {notif.message}
                   </p>
                   <span className="text-[10px] text-zinc-500 mt-1 block">
                     {new Date(notif.created_at).toLocaleString()}
                   </span>
                </div>
                {!notif.is_read && (
                  <div className="w-2 h-2 rounded-full bg-maroon shrink-0 mt-1.5" />
                )}
              </div>
            ))
          ) : (
             <div className="text-center py-10 text-zinc-500 flex flex-col items-center">
                <Bell className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No new notifications</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
