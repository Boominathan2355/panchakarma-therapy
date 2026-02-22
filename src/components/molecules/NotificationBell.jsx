import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import './NotificationBell.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await dashboardService.getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle size={16} className="text-warning" />;
            case 'error': return <AlertCircle size={16} className="text-error" />;
            case 'success': return <CheckCircle size={16} className="text-success" />;
            default: return <Info size={16} className="text-info" />;
        }
    };

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button className="bell-button" onClick={toggleDropdown} aria-label="Notifications">
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="dropdown-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button className="mark-all-btn" onClick={markAllAsRead}>
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notifications-list">
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="notification-icon">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">{notification.title}</div>
                                        <p className="notification-message">{notification.message}</p>
                                        <span className="notification-time">{notification.time}</span>
                                    </div>
                                    {!notification.read && <div className="unread-indicator" />}
                                </div>
                            ))
                        ) : (
                            <div className="no-notifications">
                                <p>No notifications yet</p>
                            </div>
                        )}
                    </div>

                    <div className="dropdown-footer">
                        <button className="view-all-btn">View All Notifications</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
