import React, { useState } from 'react';
import Badge from '../atoms/Badge';
import Table, { Column } from '../molecules/Table';
import Card from '../atoms/Card';
import './AuditLogTable.css';

export interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
    type: 'INFO' | 'WARN' | 'ERROR';
    justification?: string;
}

export interface AuditLogTableProps {
    logs?: AuditLog[];
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs = [] }) => {
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    const filteredLogs = (logs || []).filter(log =>
        log.user?.toLowerCase().includes(filter.toLowerCase()) ||
        log.action?.toLowerCase().includes(filter.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const getBadgeVariant = (type: string) => {
        switch (type) {
            case 'WARN': return 'warning';
            case 'ERROR': return 'error';
            default: return 'default';
        }
    };

    const tableColumns: Column<AuditLog>[] = [
        {
            header: 'Timestamp',
            accessor: (log) => new Date(log.timestamp).toLocaleString(),
            className: 'font-mono text-sm'
        },
        {
            header: 'User',
            accessor: 'user'
        },
        {
            header: 'Action',
            accessor: 'action',
            className: 'font-weight-600'
        },
        {
            header: 'Details',
            accessor: (log) => (
                <>
                    {log.details}
                    {log.justification && (
                        <div className="justification-note">Justification: {log.justification}</div>
                    )}
                </>
            )
        },
        {
            header: 'Type',
            accessor: (log) => <Badge variant={getBadgeVariant(log.type)}>{log.type}</Badge>
        }
    ];

    return (
        <div className="audit-log-layout">
            <Card className="audit-header-card">
                <div className="table-header">
                    <h3>System Transaction Logs</h3>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search Logs..."
                            className="search-input"
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            </Card>

            <Table
                columns={tableColumns}
                data={paginatedLogs}
                keyField="id"
                isLoading={false}
                className="audit-table-card"
            />
        </div>
    );
};

export default AuditLogTable;
