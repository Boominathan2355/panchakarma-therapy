import React, { useState } from 'react';
import FileInput from '../atoms/FileInput';
import Button from '../atoms/Button';
import ProcessingLog, { ProcessingLogEntry } from '../molecules/ProcessingLog';
import { FileText, Download, CheckCircle, Loader2, FileJson } from 'lucide-react';
import documentService from '../../services/documentService';
import './DocumentUploader.css';

export interface Document {
    id: string;
    name: string;
    size: string;
    uploadDate: string;
}

export interface DocumentUploaderProps {
    documents?: Document[];
    onUpload?: (response: any) => void;
}

type UploadStatus = 'idle' | 'uploading' | 'extracting' | 'analyzing' | 'complete';

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ documents = [], onUpload }) => {
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [logs, setLogs] = useState<ProcessingLogEntry[]>([]);
    const [showJson, setShowJson] = useState(false);
    const [extractedData, setExtractedData] = useState<string | null>(null);

    const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        // Map warning to info or error for ProcessingLog molecule if needed, here I'll assume ProcessingLog accepts these
        const statusMap: Record<string, 'pending' | 'success' | 'error'> = {
            'info': 'pending',
            'success': 'success',
            'error': 'error',
            'warning': 'pending'
        };
        
        setLogs(prev => [...prev, { 
            id: Math.random().toString(36).substr(2, 9), 
            timestamp: time, 
            message, 
            status: statusMap[type] || 'pending'
        }]);
    };

    const handleUpload = async (file: File) => {
        setUploadStatus('uploading');
        setLogs([]);
        addLog(`[Step 1] Upload started: ${file.name}`, 'info');

        try {
            const response = await documentService.uploadDocument(file);

            setUploadStatus('extracting');
            addLog('[Step 3] Backend extracting text and processing with LLM...', 'info');

            setTimeout(() => {
                setUploadStatus('analyzing');
                addLog('[Step 5] LLM identifying therapy patterns...', 'info');

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

        } catch (error: any) {
            setUploadStatus('idle');
            addLog(`Error: ${error.message}`, 'error');
            console.error('Upload failed:', error);
        }
    };

    const StatusBadge: React.FC<{ status: UploadStatus }> = ({ status }) => {
        const styles: Record<UploadStatus, { text: string; icon: any; className: string }> = {
            idle: { text: '', icon: null, className: '' },
            uploading: { text: 'Uploading...', icon: Loader2, className: 'status-uploading' },
            extracting: { text: 'Extracting Text...', icon: Loader2, className: 'status-extracting' },
            analyzing: { text: 'LLM Processing...', icon: Loader2, className: 'status-analyzing' },
            complete: { text: 'Digitization Complete', icon: CheckCircle, className: 'status-complete' }
        };
        
        const st = styles[status];
        const Icon = st.icon;

        if (status === 'idle') return null;

        return (
            <div className={`status-badge ${st.className}`}>
                {Icon && <Icon size={16} className={status !== 'complete' ? 'spinner' : ''} />}
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

            {logs.length > 0 && <ProcessingLog entries={logs} />}

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
                        <pre className="json-output">{extractedData}</pre>
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
