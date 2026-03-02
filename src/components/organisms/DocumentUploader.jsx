import React, { useState } from 'react';
import FileInput from '../atoms/FileInput';
import Button from '../atoms/Button';
import ProcessingLog from '../molecules/ProcessingLog';
import { FileText, Download, CheckCircle, Loader, FileJson } from 'lucide-react';
import documentService from '../../services/documentService';
import './DocumentUploader.css';

const DocumentUploader = ({ documents = [], onUpload }) => {
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, extracting, analyzing, complete
    const [logs, setLogs] = useState([]);
    const [showJson, setShowJson] = useState(false);
    const [extractedData, setExtractedData] = useState(null);

    const addLog = (message, type = 'info') => {
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev, { time, message, type }]);
    };

    const handleUpload = async (file) => {
        setUploadStatus('uploading');
        setLogs([]);
        addLog(`[Step 1] Upload started: ${file.name}`, 'info');

        try {
            // Real API Call
            const response = await documentService.uploadDocument(file);

            setUploadStatus('extracting');
            addLog('[Step 3] Backend extracting text and processing with LLM...', 'info');

            // Simulating further steps if backend doesn't provide granular progress
            // In a production app, we might use WebSockets or polling for these steps
            setTimeout(() => {
                setUploadStatus('analyzing');
                addLog('[Step 5] LLM identifying therapy patterns...', 'warning');

                setTimeout(() => {
                    setUploadStatus('complete');
                    addLog('[Step 9] Digitization Complete. Results stored.', 'success');

                    if (response.extractedData) {
                        setExtractedData(JSON.stringify(response.extractedData, null, 2));
                    } else if (response.json) {
                        setExtractedData(JSON.stringify(response.json, null, 2));
                    }

                    if (onUpload) onUpload(response);
                }, 1500);
            }, 1000);

        } catch (error) {
            setUploadStatus('idle');
            addLog(`Error: ${error.message}`, 'error');
            console.error('Upload failed:', error);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            idle: { color: 'var(--text-secondary)', icon: null },
            uploading: { color: 'var(--primary-color)', icon: Loader, text: 'Uploading...' },
            extracting: { color: 'var(--warning-text)', icon: Loader, text: 'Extracting Text...' },
            analyzing: { color: 'var(--info-text)', icon: Loader, text: 'LLM Processing...' },
            complete: { color: 'var(--success-text)', icon: CheckCircle, text: 'Digitization Complete' }
        };
        const st = styles[status] || styles.idle;
        const Icon = st.icon;

        if (status === 'idle') return null;

        return (
            <div className={`status-badge ${status}`}>
                {Icon && <Icon size={16} className={status !== 'complete' ? 'spin' : ''} />}
                <span>{st.text}</span>
            </div>
        );
    };

    return (
        <div className="doc-uploader">
            <div className="upload-area">
                <FileInput onChange={handleUpload} accept=".pdf,.doc,.docx" label="Upload Protocol (PDF)" />
                <StatusBadge status={uploadStatus} />
            </div>

            {logs.length > 0 && <ProcessingLog logs={logs} />}

            {uploadStatus === 'complete' && (
                <div className="json-preview-action">
                    <Button variant="outline" size="small" onClick={() => setShowJson(true)}>
                        <FileJson size={16} /> View Extracted JSON
                    </Button>
                </div>
            )}

            {showJson && (
                <div className="json-modal-overlay">
                    <div className="json-modal">
                        <h3>LLM Output: Structured Data</h3>
                        <pre>{extractedData}</pre>
                        <Button size="small" onClick={() => setShowJson(false)}>Close</Button>
                    </div>
                </div>
            )}

            <div className="doc-list">
                <h3>Attached Documents</h3>
                {documents.map((doc) => (
                    <div key={doc.id} className="doc-item">
                        <FileText className="file-icon" size={24} />
                        <div className="doc-info">
                            <span className="doc-name">{doc.name}</span>
                            <span className="doc-meta">{doc.size} • {doc.uploadDate}</span>
                        </div>
                        <button className="download-btn">
                            <Download size={18} />
                        </button>
                    </div>
                ))}
                {documents.length === 0 && (
                    <p className="no-docs">No documents attached.</p>
                )}
            </div>
        </div>
    );
};

export default DocumentUploader;
