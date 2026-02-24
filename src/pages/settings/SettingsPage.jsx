import React, { useState } from 'react';
import { Bell, Lock, Users, Plus, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';

import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import Label from '../../components/atoms/Label';
import './SettingsPage.css';

const SettingsPage = () => {
    const { user } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('notifications');
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        alerts: true
    });

    // Mock User Management State
    const [systemUsers, setSystemUsers] = useState([
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
        { id: 2, name: 'Dr. Arya', email: 'arya@ayursoft.com', role: 'Physician' },
        { id: 3, name: 'Sarah Jones', email: 'sarah@ayursoft.com', role: 'Scheduler' },
    ]);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Physician' });

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email) return;
        const id = systemUsers.length + 1;
        setSystemUsers([...systemUsers, { id, ...newUser }]);
        setNewUser({ name: '', email: '', role: 'Physician' });
        alert('User added successfully!');
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Are you sure you want to remove this user?')) {
            setSystemUsers(systemUsers.filter(u => u.id !== id));
        }
    };

    const handleSave = () => {
        alert("Settings saved successfully!");
    };

    return (
        <div className="settings-page">
            <h2 className="settings-title">Settings</h2>

            <div className="settings-container">
                <div className="settings-sidebar">
                    <button
                        className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                    <button
                        className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <Lock size={18} /> Security
                    </button>
                    {user?.role?.toLowerCase() === 'admin' && (
                        <button
                            className={`settings-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <Users size={18} /> User Management
                        </button>
                    )}
                </div>

                <div className="settings-content">
                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h3>Notification Preferences</h3>
                            <div className="toggle-group">
                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>Email Notifications</h4>
                                        <p>Receive daily summaries and alerts.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.email}
                                        onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                                    />
                                </div>
                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>SMS Alerts</h4>
                                        <p>Receive immediate alerts for critical issues.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.sms}
                                        onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="settings-section">
                            <h3>Security Settings</h3>
                            <div className="form-group">
                                <Label>Current Password</Label>
                                <Input type="password" placeholder="********" />
                            </div>
                            <div className="form-group">
                                <Label>New Password</Label>
                                <Input type="password" placeholder="Enter new password" />
                            </div>
                            <div className="form-group">
                                <Label>Confirm New Password</Label>
                                <Input type="password" placeholder="Confirm new password" />
                            </div>
                            <Button variant="outline" className="text-error border-error">Sign out of all devices</Button>
                        </div>
                    )}


                    {activeTab === 'users' && user?.role?.toLowerCase() === 'admin' && (
                        <div className="settings-section full-width">
                            <h3>User Management</h3>

                            <div className="add-user-card">
                                <h4>Add New User</h4>
                                <div className="add-user-grid">
                                    <div className="form-group mb-0">
                                        <Label>Name</Label>
                                        <Input
                                            placeholder="Full Name"
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group mb-0">
                                        <Label>Email</Label>
                                        <Input
                                            placeholder="Email Address"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group mb-0">
                                        <Label>Role</Label>
                                        <select
                                            className="custom-select"
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Physician">Physician</option>
                                            <option value="Scheduler">Scheduler</option>
                                        </select>
                                    </div>
                                    <div className="form-group mb-0 flex-end">
                                        <Button variant="primary" onClick={handleAddUser}>
                                            <Plus size={16} /> Add
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="users-list">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {systemUsers.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td><span className="role-badge">{u.role}</span></td>
                                                <td>
                                                    <button className="icon-btn text-error" onClick={() => handleDeleteUser(u.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="settings-actions">
                        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
