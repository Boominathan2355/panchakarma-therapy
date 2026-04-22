import { create } from 'zustand';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    timestamp: string;
}

interface NotificationStore {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    addNotification: (n) => set((state) => ({
        notifications: [
            {
                ...n,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toLocaleTimeString(),
                read: false
            },
            ...state.notifications
        ]
    })),
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
    })),
    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
    })),
    deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
    })),
}));
