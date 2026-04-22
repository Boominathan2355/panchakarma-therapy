import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import Badge from '../atoms/Badge';
import { useNotificationStore } from '../../store/notificationStore';
import './NotificationBell.css';

const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();
    const unreadCount = notifications.filter(n => !n.read).length;


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button className="bell-btn" onClick={() => setIsOpen(!isOpen)}>
                <Bell size={20} />
                {unreadCount > 0 && (
                    <Badge variant="error" className="notification-badge">
                        {unreadCount}
                    </Badge>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="dropdown-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && <button className="mark-all-btn" onClick={markAllAsRead}>Mark all as read</button>}
                    </div>
                    <div className="dropdown-body">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                                    <div className="item-header">
                                        <span className={`item-dot dot-${notification.type}`} />
                                        <h5 className="item-title">{notification.title}</h5>
                                    </div>
                                    <p className="item-message">{notification.message}</p>
                                    <div className="item-footer">
                                        <span className="item-time">{notification.timestamp}</span>
                                        <div className="item-actions">
                                            {!notification.read && (
                                                <button className="action-btn" title="Mark as read" onClick={() => markAsRead(notification.id)}>
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            <button className="action-btn delete" title="Delete" onClick={() => deleteNotification(notification.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-notifications">
                                <p>No new notifications</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
