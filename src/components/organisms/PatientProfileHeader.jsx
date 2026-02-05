import React from 'react';
import Avatar from '../atoms/Avatar';
import InfoItem from '../molecules/InfoItem';
import './PatientProfileHeader.css';

const PatientProfileHeader = ({ patient }) => {
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
