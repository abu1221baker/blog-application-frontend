import React from 'react';
import { Link } from 'react-router-dom';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({ notifications, onMarkAsRead, onMarkAllRead, onClose }) => {
  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-900">Notifications</h3>
        {notifications.length > 0 && (
          <button 
            onClick={onMarkAllRead}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 block">notifications_off</span>
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <NotificationItem 
              key={n.id} 
              notification={n} 
              onMarkAsRead={onMarkAsRead} 
            />
          ))
        )}
      </div>

    </div>
  );
};

export default NotificationDropdown;
