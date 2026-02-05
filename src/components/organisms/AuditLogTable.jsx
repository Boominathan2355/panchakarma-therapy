import React, { useState } from 'react';
import Badge from '../atoms/Badge';
import './AuditLogTable.css';

const AuditLogTable = ({ logs }) => {
    const [filter, setFilter] = useState('');

    const filteredLogs = logs.filter(log =>
        log.user.toLowerCase().includes(filter.toLowerCase()) ||
        log.action.toLowerCase().includes(filter.toLowerCase())
    );

    const getBadgeVariant = (type) => {
        switch (type) {
            case 'WARN': return 'warning';
            case 'ERROR': return 'error'; // We need to add error variant to Badge probably, or just use default specific styling
            default: return 'default';
        }
    };

    return (
        <div className="audit-table-card">
            <div className="table-header">
                <h3>System Transaction Logs</h3>
                <input
                    type="text"
                    placeholder="Search Logs..."
                    className="search-input"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <div className="table-responsive">
                <table className="audit-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Details</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id}>
                                <td className="font-mono text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.user}</td>
                                <td className="font-weight-600">{log.action}</td>
                                <td>
                                    {log.details}
                                    {log.justification && (
                                        <div className="justification-note">Justification: {log.justification}</div>
                                    )}
                                </td>
                                <td><Badge variant={getBadgeVariant(log.type)}>{log.type}</Badge></td>
                            </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                            <tr><td colSpan="5" className="text-center p-4">No logs found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogTable;
