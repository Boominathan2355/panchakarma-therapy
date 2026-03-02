import React, { useState } from 'react';
import Avatar from '../atoms/Avatar';
import Skeleton from '../atoms/Skeleton';
import Table from '../molecules/Table';
import Card from '../atoms/Card';
import { Filter } from 'lucide-react';
import './PatientList.css';

const PatientList = ({ patients = [], selectedId, onSelect, variant = 'list', isLoading = false }) => {
    const [riskFilter, setRiskFilter] = useState(null); // null, 'high', 'med', 'low'
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

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
        setCurrentPage(1);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const getPatientRisk = (p) => {
        const count = p.conditions?.length || 0;
        if (count >= 2) return 'high';
        if (count === 1) return 'med';
        return 'low';
    };

    const filteredPatients = (riskFilter
        ? patients.filter(p => {
            if (riskFilter === 'active') {
                return p.history && p.history.some(h => h.type === 'Treatment');
            }
            return getPatientRisk(p) === riskFilter;
        })
        : [...(patients || [])])
        .sort((a, b) => {
            if (!sortConfig.key) return 0;

            const aValue = a[sortConfig.key] || '';
            const bValue = b[sortConfig.key] || '';

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

    const totalPages = Math.ceil(filteredPatients.length / PAGE_SIZE);
    const paginatedPatients = filteredPatients.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const isGrid = variant === 'grid';

    const tableColumns = [
        {
            header: '',
            key: 'avatar',
            className: 'col-avatar',
            render: (_, p) => <Avatar name={p.name} size="small" />
        },
        {
            header: 'Name',
            key: 'name',
            className: 'col-name',
            render: (name) => <span className="patient-name">{name || 'Unknown'}</span>
        },
        {
            header: 'Gender & Age',
            key: 'info',
            className: 'col-info',
            render: (_, p) => (
                <span className="patient-sub">
                    {p.gender ? `${p.gender}, ` : ''}
                    {p.age ? `${p.age}y` : 'N/A'}
                </span>
            )
        },
        {
            header: 'Phone',
            key: 'phone',
            className: 'col-contact',
            render: (phone) => <span className="patient-sub">{phone || 'No phone'}</span>
        },
        {
            header: 'Complaint',
            key: 'complaint',
            className: 'col-complaint',
            sortable: true,
            render: (complaint) => <span className="patient-sub">{complaint || 'No complaint data'}</span>
        }
    ];

    if (isLoading && patients.length === 0) {
        return (
            <div className={`patient-list-container ${variant} loading`}>
                {isGrid ? (
                    <div className="patient-grid-layout">
                        <Card className="stats-card">
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
                        </Card>

                        <Table
                            columns={tableColumns}
                            loading={true}
                            loadingRows={6}
                            className="table-card"
                        />
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
                <div className="patient-grid-layout">
                    <Card className="stats-card">
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
                    </Card>

                    <Table
                        columns={tableColumns}
                        data={paginatedPatients}
                        onRowClick={(p) => onSelect(p.id)}
                        getRowClassName={(p) => selectedId === p.id ? 'active' : ''}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        emptyMessage="No patients matching this filter."
                        className="table-card"
                    />
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
