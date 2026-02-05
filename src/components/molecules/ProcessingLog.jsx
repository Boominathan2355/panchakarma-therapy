import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import './ProcessingLog.css';

const ProcessingLog = ({ logs }) => {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="processing-log">
            <div className="log-header">
                <Terminal size={14} className="mr-2" />
                <span>System Processing Log</span>
            </div>
            <div className="log-body">
                {logs.map((log, index) => (
                    <div key={index} className={`log-entry ${log.type}`}>
                        <span className="log-timestamp">[{log.time}]</span>
                        <span className="log-message">{log.message}</span>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
        </div>
    );
};

export default ProcessingLog;
