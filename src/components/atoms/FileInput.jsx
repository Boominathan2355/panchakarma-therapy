import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import './FileInput.css';

const FileInput = ({ onChange, accept, label = 'Upload File' }) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onChange(e.target.files[0]);
        }
    };

    return (
        <div className="file-input-wrapper" onClick={handleClick}>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden-input"
                onChange={handleFileChange}
                accept={accept}
            />
            <div className="upload-placeholder">
                <UploadCloud size={24} className="upload-icon" />
                <span className="upload-text">{label}</span>
                <span className="upload-hint">Click to browse</span>
            </div>
        </div>
    );
};

export default FileInput;
