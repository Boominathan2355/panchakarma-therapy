import React, { useState } from 'react';
import Badge from '../atoms/Badge';
import './AvailabilityTable.css';

const AvailabilityTable = ({ therapists, rooms }) => {
    const [activeTab, setActiveTab] = useState('therapists');

    const getStatusVariant = (status) => {
        switch (status.toLowerCase()) {
            case 'available': return 'success';
            case 'busy': return 'warning';
            case 'occupied': return 'warning';
            case 'maintenance': return 'error';
            case 'on leave': return 'error';
            default: return 'default';
        }
    };

    const data = activeTab === 'therapists' ? therapists : rooms;

    return (
        <div className="availability-panel">
            <div className="panel-header">
                <h3 className="section-title">Resource Availability</h3>
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'therapists' ? 'active' : ''}`}
                        onClick={() => setActiveTab('therapists')}
                    >
                        Therapists
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rooms')}
                    >
                        Rooms
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>{activeTab === 'therapists' ? 'Specialty' : 'Type'}</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td className="font-medium">{item.name}</td>
                                <td className="text-muted">{activeTab === 'therapists' ? item.specialty : 'Treatment Room'}</td>
                                <td>
                                    <Badge variant={getStatusVariant(item.status)}>
                                        {item.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center p-4 text-muted">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AvailabilityTable;
