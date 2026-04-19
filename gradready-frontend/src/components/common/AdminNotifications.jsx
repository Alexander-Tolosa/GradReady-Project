import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function AdminNotifications({ notifications, onMarkAsRead }) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="card p-10 flex flex-col items-center justify-center text-zinc-500 min-h-[400px]">
        <Bell className="w-8 h-8 mb-3 opacity-50" />
        <p>No recent notifications.</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'status_update': return <CheckCircle2 className="w-5 h-5 text-status-cleared" />;
      case 'revision_requested': return <AlertTriangle className="w-5 h-5 text-status-revision" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="card flex flex-col h-full min-h-[500px]">
      <div className="p-4 sm:p-6 border-b border-[#27272a] flex justify-between items-center">
        <div>
           <h2 className="text-lg font-semibold text-white">System Notifications</h2>
           <p className="text-sm text-zinc-500 mt-0.5">Recent system activity and alerts.</p>
        </div>
        <button 
          onClick={onMarkAsRead}
          className="text-xs text-maroon hover:text-maroon-light font-medium transition-colors border border-maroon-light/20 px-3 py-1.5 rounded-lg"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-[#27272a]/50">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${!notif.is_read ? 'bg-[#1c1c20]' : 'hover:bg-[#1c1c20]/50'}`}>
              <div className="mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${!notif.is_read ? 'text-zinc-200 font-medium' : 'text-zinc-300'}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(notif.created_at).toLocaleString()}
                </p>
              </div>
              {!notif.is_read && (
                <div className="w-2 h-2 rounded-full bg-maroon flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
