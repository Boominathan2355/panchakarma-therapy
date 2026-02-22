import React from 'react';
import Avatar from '../atoms/Avatar';
import InfoItem from '../molecules/InfoItem';
import Skeleton from '../atoms/Skeleton';
import './PatientProfileHeader.css';

const PatientProfileHeader = ({ patient, loading = false }) => {
    if (loading) {
        return (
            <div className="profile-header-card loading">
                <div className="profile-main">
                    <Skeleton variant="circle" width="80px" height="80px" />
                    <div className="profile-identity">
                        <Skeleton width="200px" height="1.8rem" style={{ marginBottom: '8px' }} />
                        <Skeleton width="150px" height="1.2rem" />
                    </div>
                </div>

                <div className="profile-details-grid">
                    <div className="info-item-skeleton">
                        <Skeleton width="80px" height="0.8rem" style={{ marginBottom: '4px' }} />
                        <Skeleton width="120px" height="1.2rem" />
                    </div>
                    <div className="info-item-skeleton">
                        <Skeleton width="80px" height="0.8rem" style={{ marginBottom: '4px' }} />
                        <Skeleton width="120px" height="1.2rem" />
                    </div>
                    <div className="info-item-skeleton">
                        <Skeleton width="80px" height="0.8rem" style={{ marginBottom: '4px' }} />
                        <Skeleton width="120px" height="1.2rem" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-header-card">
            <div className="profile-main">
                <Avatar name={patient.name} size="large" />
                <div className="profile-identity">
                    <h2>{patient.name}</h2>
                    <p className="profile-subtitle">{patient.age} years • {patient.gender}</p>
                </div>
            </div>

            <div className="profile-details-grid">
                <InfoItem label="Primary Complaint" value={patient.complaint} />
                <InfoItem label="Phone" value={patient.phone} />
                <InfoItem label="Email" value={patient.email} />
            </div>
        </div>
    );
};

export default PatientProfileHeader;
