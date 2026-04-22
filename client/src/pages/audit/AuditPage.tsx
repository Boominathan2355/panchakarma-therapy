import React from 'react';
import { useAuditLogs } from '../../hooks/useAudit';
import AuditLogTable from '../../components/organisms/AuditLogTable';
import './AuditPage.css';

const AuditPage: React.FC = () => {
    const { data: logs = [], isLoading } = useAuditLogs();


    return (
        <div className="audit-page">
            <h2 className="audit-title">Audit & Explainability</h2>

            <div className="audit-grid full-width">
                <div className="audit-col table-col">
                    {isLoading ? (
                        <div className="p-8 text-center text-muted animate-pulse">Loading Logs...</div>
                    ) : (
                        <AuditLogTable logs={logs as any} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditPage;
