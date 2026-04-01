import React from 'react';
import Avatar from '../atoms/Avatar';
import InfoItem from '../molecules/InfoItem';
import Skeleton from '../atoms/Skeleton';
import './PatientProfileHeader.css';

export interface PatientProfileHeaderProps {
    patient?: {
        name: string;
        age?: number;
        gender?: string;
        complaint?: string;
        phone?: string;
        email?: string;
    };
    loading?: boolean;
}

const PatientProfileHeader: React.FC<PatientProfileHeaderProps> = ({ patient, loading = false }) => {
    if (loading) {
        return (
            <div className="profile-header-card loading">
                <div className="profile-main">
                    <Skeleton variant="circle" width="80px" height="80px" />
                    <div className="profile-identity">
                        <Skeleton width="200px" height="1.8rem" className="mb-2" />
                        <Skeleton width="150px" height="1.2rem" />
                    </div>
                </div>

                <div className="profile-details-grid">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="info-item-skeleton">
                            <Skeleton width="80px" height="0.8rem" className="mb-1" />
                            <Skeleton width="120px" height="1.2rem" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!patient) return null;

    return (
        <div className="profile-header-card">
            <div className="profile-main">
                <Avatar name={patient.name} size="large" />
                <div className="profile-identity">
                    <h2>{patient.name}</h2>
                    <p className="profile-subtitle">
                        {patient.age ? `${patient.age} years` : 'Age N/A'} • {patient.gender || 'Gender N/A'}
                    </p>
                </div>
            </div>

            <div className="profile-details-grid">
                <InfoItem label="Primary Complaint" value={patient.complaint || 'N/A'} />
                <InfoItem label="Phone" value={patient.phone || 'N/A'} />
                <InfoItem label="Email" value={patient.email || 'N/A'} />
            </div>
        </div>
    );
};

export default PatientProfileHeader;
