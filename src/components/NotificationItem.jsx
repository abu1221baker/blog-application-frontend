import React from 'react';
import { Link } from 'react-router-dom';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const isRead = notification.is_read;

  return (
    <div className={`p-4 border-b border-slate-100 flex items-start gap-3 hover:bg-slate-50 transition-colors ${!isRead ? 'bg-primary/5' : ''}`}>
      <div className={`mt-1 size-8 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'LIKE' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
        <span className="material-symbols-outlined text-lg">
          {notification.type === 'LIKE' ? 'favorite' : 'comment'}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800 leading-snug">
          <span className="font-bold">{notification.sender.username}</span> {notification.type === 'LIKE' ? 'liked' : 'commented on'} your blog{' '}
          <Link to={`/blog/${notification.blog.slug}`} className="font-medium text-primary hover:underline">
            {notification.blog.title}
          </Link>
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-slate-400">
            {new Date(notification.created_at).toLocaleDateString()}
          </span>
          {!isRead && (
            <button 
              onClick={() => onMarkAsRead(notification.id)}
              className="text-[11px] font-bold text-primary hover:text-primary-dark transition-colors"
            >
              Mark as Read
            </button>
          )}
        </div>
      </div>
      
      {!isRead && (
        <div className="mt-1.5 size-2 rounded-full bg-primary shrink-0" />
      )}
    </div>
  );
};

export default NotificationItem;
