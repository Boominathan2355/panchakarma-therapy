import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import './ProcessingLog.css';

export interface ProcessingLogEntry {
    id: string;
    message: string;
    status: 'pending' | 'success' | 'error';
    timestamp: string;
}

export interface ProcessingLogProps {
    entries: ProcessingLogEntry[];
    title?: string;
    className?: string;
}

const ProcessingLog: React.FC<ProcessingLogProps> = ({ entries, title, className = '' }) => {
    const getStatusIcon = (status: ProcessingLogEntry['status']) => {
        switch (status) {
            case 'success':
                return <CheckCircle size={16} className="text-success" />;
            case 'error':
                return <AlertCircle size={16} className="text-error" />;
            default:
                return <Clock size={16} className="text-muted spinner" />;
        }
    };

    return (
        <div className={`processing-log ${className}`}>
            {title && <h4 className="log-title">{title}</h4>}
            <div className="log-container">
                {entries.map((entry) => (
                    <div key={entry.id} className="log-entry">
                        <div className="entry-icon">
                            {getStatusIcon(entry.status)}
                        </div>
                        <div className="entry-content">
                            <span className="entry-message">{entry.message}</span>
                            <span className="entry-time">{entry.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProcessingLog;
