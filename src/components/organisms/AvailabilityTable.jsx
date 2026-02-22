import React, { useState } from 'react';
import Skeleton from '../atoms/Skeleton';
import Badge from '../atoms/Badge';
import './AvailabilityTable.css';

const AvailabilityTable = ({ therapists, rooms, loading }) => {

    const [activeTab, setActiveTab] = useState('therapists');

    if (loading) {
        return (
            <div className="availability-panel">
                <div className="panel-header">
                    <Skeleton width="40%" height="24px" />
                    <div className="tabs">
                        <Skeleton width="80px" height="32px" borderRadius="16px" />
                        <Skeleton width="80px" height="32px" borderRadius="16px" className="ml-2" />
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th><Skeleton width="60%" /></th>
                                <th><Skeleton width="60%" /></th>
                                <th><Skeleton width="60%" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i}>
                                    <td><Skeleton width="80%" /></td>
                                    <td><Skeleton width="70%" /></td>
                                    <td><Skeleton width="60px" height="24px" borderRadius="12px" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

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
