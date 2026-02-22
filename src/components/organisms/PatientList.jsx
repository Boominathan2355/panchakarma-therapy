import React, { useState } from 'react';
import Avatar from '../atoms/Avatar';
import Skeleton from '../atoms/Skeleton';
import { Filter } from 'lucide-react';
import './PatientList.css';

const PatientList = ({ patients = [], selectedId, onSelect, variant = 'list', isLoading = false }) => {
    const [riskFilter, setRiskFilter] = useState(null); // null, 'high', 'med', 'low'

    const totalPatients = patients?.length || 0;
    const activeTreatments = patients?.filter(p => p.history && p.history.some(h => h.type === 'Treatment')).length || 0;

    // Calculate Risk Stats (always based on full list)
    const riskStats = (patients || []).reduce((acc, p) => {
        const count = p.conditions?.length || 0;
        if (count >= 2) acc.high++;
        else if (count === 1) acc.med++;
        else acc.low++;
        return acc;
    }, { high: 0, med: 0, low: 0 });

    const handleRiskFilter = (filter) => {
        setRiskFilter(prev => prev === filter ? null : filter);
    };

    const getPatientRisk = (p) => {
        const count = p.conditions?.length || 0;
        if (count >= 2) return 'high';
        if (count === 1) return 'med';
        return 'low';
    };

    const filteredPatients = riskFilter
        ? patients.filter(p => {
            if (riskFilter === 'active') {
                return p.history && p.history.some(h => h.type === 'Treatment');
            }
            return getPatientRisk(p) === riskFilter;
        })
        : patients;

    const isGrid = variant === 'grid';

    if (isLoading && patients.length === 0) {
        return (
            <div className={`patient-list-container ${variant} loading`}>
                {isGrid ? (
                    <div className="patient-table-view">
                        <div className="list-management-header" style={{ opacity: 0.7 }}>
                            <div className="mgmt-stat">
                                <Skeleton width="60px" height="1.2rem" />
                                <Skeleton width="40px" height="0.8rem" style={{ marginTop: '4px' }} />
                            </div>
                            <div className="mgmt-stat">
                                <Skeleton width="60px" height="1.2rem" />
                                <Skeleton width="40px" height="0.8rem" style={{ marginTop: '4px' }} />
                            </div>
                            <div className="mgmt-stat separator"></div>
                            <div className="mgmt-stat">
                                <Skeleton width="30px" height="1.2rem" />
                                <Skeleton width="30px" height="0.6rem" style={{ marginTop: '4px' }} />
                            </div>
                            <div className="mgmt-stat">
                                <Skeleton width="30px" height="1.2rem" />
                                <Skeleton width="30px" height="0.6rem" style={{ marginTop: '4px' }} />
                            </div>
                            <div className="mgmt-stat">
                                <Skeleton width="30px" height="1.2rem" />
                                <Skeleton width="30px" height="0.6rem" style={{ marginTop: '4px' }} />
                            </div>
                        </div>

                        <div className="patient-table-header">
                            <div className="col-avatar"></div>
                            <div className="col-name">Name</div>
                            <div className="col-info">Gender & Age</div>
                            <div className="col-contact">Phone</div>
                            <div className="col-complaint">Complaint</div>
                        </div>

                        <div className="patient-table-body">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="patient-table-row">
                                    <div className="col-avatar">
                                        <Skeleton variant="circle" width="32px" height="32px" />
                                    </div>
                                    <div className="col-name">
                                        <Skeleton width="140px" height="1.2rem" />
                                    </div>
                                    <div className="col-info">
                                        <Skeleton width="80px" height="0.8rem" />
                                    </div>
                                    <div className="col-contact">
                                        <Skeleton width="120px" height="0.8rem" />
                                    </div>
                                    <div className="col-complaint">
                                        <Skeleton width="220px" height="0.8rem" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="patient-scroll-list">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="patient-card-item">
                                <Skeleton variant="circle" width="32px" height="32px" />
                                <div className="patient-info">
                                    <Skeleton width="120px" height="1rem" style={{ marginBottom: '6px' }} />
                                    <Skeleton width="70px" height="0.75rem" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`patient-list-container ${variant}`}>
            {isGrid ? (
                <div className="patient-table-view">
                    <div className="list-management-header">
                        <div className="mgmt-stat">
                            <span className="mgmt-label">Total Patients</span>
                            <span className="mgmt-value">{totalPatients}</span>
                        </div>
                        <div
                            className={`mgmt-stat clickable ${riskFilter === 'active' ? 'active' : ''}`}
                            onClick={() => handleRiskFilter('active')}
                        >
                            <span className="mgmt-label">
                                <Filter size={10} className="filter-icon" />
                                Active Treatments
                            </span>
                            <span className="mgmt-value">{activeTreatments}</span>
                        </div>
                        <div className="mgmt-stat separator"></div>
                        <div
                            className={`mgmt-stat clickable ${riskFilter === 'high' ? 'active' : ''}`}
                            onClick={() => handleRiskFilter('high')}
                        >
                            <span className="mgmt-label label-red">
                                <Filter size={10} className="filter-icon" />
                                High Risk
                            </span>
                            <span className="mgmt-value value-red">{riskStats.high}</span>
                        </div>
                        <div
                            className={`mgmt-stat clickable ${riskFilter === 'med' ? 'active' : ''}`}
                            onClick={() => handleRiskFilter('med')}
                        >
                            <span className="mgmt-label label-orange">
                                <Filter size={10} className="filter-icon" />
                                Med Risk
                            </span>
                            <span className="mgmt-value value-orange">{riskStats.med}</span>
                        </div>
                        <div
                            className={`mgmt-stat clickable ${riskFilter === 'low' ? 'active' : ''}`}
                            onClick={() => handleRiskFilter('low')}
                        >
                            <span className="mgmt-label label-green">
                                <Filter size={10} className="filter-icon" />
                                Low Risk
                            </span>
                            <span className="mgmt-value value-green">{riskStats.low}</span>
                        </div>
                    </div>

                    {riskFilter && (
                        <div className="filter-badge-row">
                            <span className="filter-label">Filtering by: <strong>{riskFilter.toUpperCase()} RISK</strong></span>
                            <button className="clear-filter-btn" onClick={() => setRiskFilter(null)}>Clear Filter</button>
                        </div>
                    )}

                    <div className="patient-table-header">
                        <div className="col-avatar"></div>
                        <div className="col-name">Name</div>
                        <div className="col-info">Gender & Age</div>
                        <div className="col-contact">Phone</div>
                        <div className="col-complaint">Complaint</div>
                    </div>
                    <div className="patient-table-body">
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map(p => (
                                <div
                                    key={p.id}
                                    className={`patient-table-row ${selectedId === p.id ? 'active' : ''}`}
                                    onClick={() => onSelect(p.id)}
                                >
                                    <div className="col-avatar">
                                        <Avatar name={p.name} size="small" />
                                    </div>
                                    <div className="col-name">
                                        <span className="patient-name">{p.name || 'Unknown'}</span>
                                    </div>
                                    <div className="col-info">
                                        <span className="patient-sub">
                                            {p.gender ? `${p.gender}, ` : ''}
                                            {p.age ? `${p.age}y` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="col-contact">
                                        <span className="patient-sub">{p.phone || 'No phone'}</span>
                                    </div>
                                    <div className="col-complaint">
                                        <span className="patient-sub">{p.complaint || 'No complaint data'}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-list-message" style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No patients matching this filter.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="patient-scroll-list">
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map(p => (
                            <div
                                key={p.id}
                                className={`patient-card-item ${selectedId === p.id ? 'active' : ''}`}
                                onClick={() => onSelect(p.id)}
                            >
                                <Avatar name={p.name} size="small" />
                                <div className="patient-info">
                                    <span className="patient-name">{p.name || 'Unknown'}</span>
                                    <span className="patient-sub">
                                        {p.gender ? `${p.gender}, ` : ''}
                                        {p.age ? `${p.age}y` : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-list-message" style={{ padding: 'var(--spacing-md)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No patients matching this filter.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PatientList;
