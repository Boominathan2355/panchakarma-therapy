import React, { useState } from 'react';
import Badge from '../atoms/Badge';
import Table from '../molecules/Table';
import Card from '../atoms/Card';
import './AuditLogTable.css';

const AuditLogTable = ({ logs = [] }) => {
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

    const getBadgeVariant = (type) => {
        switch (type) {
            case 'WARN': return 'warning';
            case 'ERROR': return 'error';
            default: return 'default';
        }
    };

    const tableColumns = [
        {
            header: 'Timestamp',
            key: 'timestamp',
            className: 'font-mono text-sm',
            render: (ts) => new Date(ts).toLocaleString()
        },
        {
            header: 'User',
            key: 'user'
        },
        {
            header: 'Action',
            key: 'action',
            className: 'font-weight-600'
        },
        {
            header: 'Details',
            key: 'details',
            render: (details, row) => (
                <>
                    {details}
                    {row.justification && (
                        <div className="justification-note">Justification: {row.justification}</div>
                    )}
                </>
            )
        },
        {
            header: 'Type',
            key: 'type',
            render: (type) => <Badge variant={getBadgeVariant(type)}>{type}</Badge>
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
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                emptyMessage="No logs found."
                className="audit-table-card"
            />
        </div>
    );
};

export default AuditLogTable;
