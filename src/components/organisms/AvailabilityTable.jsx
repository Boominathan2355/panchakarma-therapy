import React, { useState } from 'react';
import Skeleton from '../atoms/Skeleton';
import Badge from '../atoms/Badge';
import Table from '../molecules/Table';
import Card from '../atoms/Card';
import './AvailabilityTable.css';

const AvailabilityTable = ({ therapists, rooms, loading }) => {

    const [activeTab, setActiveTab] = useState('therapists');
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

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

    const fullData = activeTab === 'therapists' ? therapists : rooms;
    const totalPages = Math.ceil((fullData?.length || 0) / PAGE_SIZE);
    const paginatedData = (fullData || []).slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const tableColumns = [
        {
            header: 'Name',
            key: 'name',
            className: 'font-medium'
        },
        {
            header: activeTab === 'therapists' ? 'Specialty' : 'Type',
            key: 'type',
            className: 'text-muted',
            render: (_, item) => activeTab === 'therapists' ? item.specialty : 'Treatment Room'
        },
        {
            header: 'Status',
            key: 'status',
            render: (status) => (
                <Badge variant={getStatusVariant(status)}>
                    {status}
                </Badge>
            )
        }
    ];

    return (
        <div className="availability-layout">
            <Card className="availability-header-card">
                <div className="panel-header">
                    <h3 className="section-title">Resource Availability</h3>
                    <div className="tabs">
                        <button
                            className={`tab-btn ${activeTab === 'therapists' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('therapists');
                                setCurrentPage(1);
                            }}
                        >
                            Therapists
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('rooms');
                                setCurrentPage(1);
                            }}
                        >
                            Rooms
                        </button>
                    </div>
                </div>
            </Card>

            <Table
                columns={tableColumns}
                data={paginatedData}
                loading={loading}
                loadingRows={5}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                emptyMessage="No data available"
                className="availability-table-card"
            />
        </div>
    );
};

export default AvailabilityTable;
