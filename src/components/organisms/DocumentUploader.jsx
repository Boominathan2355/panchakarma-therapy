import React, { useState } from 'react';
import FileInput from '../atoms/FileInput';
import Button from '../atoms/Button';
import ProcessingLog from '../molecules/ProcessingLog';
import { FileText, Download, CheckCircle, Loader, FileJson } from 'lucide-react';
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

    const handleUpload = (file) => {
        // Start simulation of Algorithm 1: Document Upload and LLM Processing
        setUploadStatus('uploading');
        setLogs([]);
        addLog(`[Step 1] Input received: ${file.name}`, 'info');

        // Step 3: Extract text
        setTimeout(() => {
            setUploadStatus('extracting');
            addLog('[Step 3] Extracting text from document...', 'info');

            // Step 4: Preprocess
            setTimeout(() => {
                setUploadStatus('analyzing');
                addLog('[Step 4] Preprocessing: Cleaning and segmentation...', 'info');
                addLog('Text cleaned. Segments identified: 14 sections.', 'info');

                // Step 5: Send to LLM
                addLog('[Step 5] Sending processed text to LLM for parsing...', 'warning');

                // Step 6: Generate JSON
                setTimeout(() => {
                    addLog('[Step 6] Generating structured JSON representation...', 'info');

                    // Step 7: Store JSON & Embeddings
                    addLog('[Step 7] Storing JSON J and semantic embeddings in database...', 'success');

                    // Step 9: Notify Administrator
                    setTimeout(() => {
                        setUploadStatus('complete');
                        addLog('[Step 9] COMPLETED. Notification sent to Administrator.', 'success');

                        const mockJson = {
                            metadata: { title: "Vamana Protocol v2", author: "Chief Vaidya" },
                            sequence: [
                                { step: 1, action: "Snehana", duration: "45 mins", notes: "Use warm oil" },
                                { step: 2, action: "Swedana", duration: "30 mins", notes: "Steam box" }
                            ],
                            safety: ["Check BP prep-procedure", "Monitor pulse"]
                        };
                        setExtractedData(JSON.stringify(mockJson, null, 2));

                        if (onUpload) onUpload(file);
                    }, 1000);
                }, 2000);
            }, 1500);
        }, 1000);
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
