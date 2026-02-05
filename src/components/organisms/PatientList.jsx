import React from 'react';
import Avatar from '../atoms/Avatar';
import './PatientList.css';

const PatientList = ({ patients, selectedId, onSelect }) => {
    return (
        <div className="patient-list-container">
            <h3 className="list-header">Patients ({patients.length})</h3>
            <div className="patient-scroll-list">
                {patients.map(p => (
                    <div
                        key={p.id}
                        className={`patient-list-item ${selectedId === p.id ? 'active' : ''}`}
                        onClick={() => onSelect(p.id)}
                    >
                        <Avatar name={p.name} size="small" />
                        <div className="patient-info">
                            <span className="patient-name">{p.name}</span>
                            <span className="patient-sub">{p.gender}, {p.age}y</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientList;
