import React, { useState } from 'react';
import Skeleton from '../atoms/Skeleton';
import Badge from '../atoms/Badge';
import Table, { Column } from '../molecules/Table';
import Card from '../atoms/Card';
import './AvailabilityTable.css';

export interface ResourceItem {
    id: string;
    name: string;
    status: string;
    type?: string;
    specialty?: string;
}

export interface AvailabilityTableProps {
    therapists?: ResourceItem[];
    rooms?: ResourceItem[];
    loading?: boolean;
}

const AvailabilityTable: React.FC<AvailabilityTableProps> = ({ therapists = [], rooms = [], loading = false }) => {
    const [activeTab, setActiveTab] = useState<'therapists' | 'rooms'>('therapists');
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'available': return 'success';
            case 'busy':
            case 'occupied': return 'warning';
            case 'maintenance':
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

    const tableColumns: Column<ResourceItem>[] = [
        {
            header: 'Name',
            accessor: 'name',
            className: 'font-medium'
        },
        {
            header: activeTab === 'therapists' ? 'Specialty' : 'Type',
            accessor: (item) => activeTab === 'therapists' ? (item.specialty || 'N/A') : 'Treatment Room',
            className: 'text-muted'
        },
        {
            header: 'Status',
            accessor: (item) => (
                <Badge variant={getStatusVariant(item.status)}>
                    {item.status}
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
                keyField="id"
                isLoading={loading}
                className="availability-table-card"
            />
        </div>
    );
};

export default AvailabilityTable;
