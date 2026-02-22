import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTherapyPlans, fetchTherapyPlanDetails, clearSelectedPlan } from '../../store/slices/therapyPlanSlice';
import Skeleton from '../../components/atoms/Skeleton';
import {
    ArrowLeft, Calendar, Users, Clock, Tag,
    CheckCircle2, Circle, PlayCircle, ChevronRight, Layers, Zap
} from 'lucide-react';
import './TherapyPlanPage.css';

const TherapyPlanPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { plans, selectedPlan, isListLoading, isDetailLoading } = useSelector((state) => state.therapyPlan);

    useEffect(() => {
        dispatch(fetchTherapyPlans());
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(fetchTherapyPlanDetails(id));
        }
    }, [id, dispatch]);

    const handleSelectPlan = (planId) => {
        dispatch(clearSelectedPlan());
        navigate(`/therapy-plans/${planId}`);
    };

    const handleBack = () => {
        dispatch(clearSelectedPlan());
        navigate('/therapy-plans');
    };

    const getPlanColor = (index) => {
        const colors = [
            { bg: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', accent: '#0ea5e9' },
            { bg: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)', accent: '#f97316' },
            { bg: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)', accent: '#14b8a6' },
            { bg: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', accent: '#a855f7' },
        ];
        return colors[index % colors.length];
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={16} className="status-icon completed" />;
            case 'in-progress': return <PlayCircle size={16} className="status-icon in-progress" />;
            default: return <Circle size={16} className="status-icon pending" />;
        }
    };

    const getDifficultyClass = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'advanced': return 'difficulty-advanced';
            case 'moderate': return 'difficulty-moderate';
            default: return 'difficulty-beginner';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'plan-status-active';
            case 'draft': return 'plan-status-draft';
            default: return 'plan-status-default';
        }
    };

    /* ===== DASHBOARD VIEW ===== */
    if (!id) {
        return (
            <div className="plan-page">
                <div className="plan-dashboard">
                    <div className="plan-dash-header">
                        <div>
                            <h1 className="plan-dash-title">Therapy Plans</h1>
                            <p className="plan-dash-subtitle">Structured multi-therapy treatment programs for patient care</p>
                        </div>
                    </div>

                    {isListLoading ? (
                        <div className="plan-cards-grid">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="plan-card skeleton-card">
                                    <Skeleton width="100%" height="100px" style={{ borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
                                    <div style={{ padding: 'var(--spacing-lg)' }}>
                                        <Skeleton width="70%" height="1.3rem" style={{ marginBottom: '10px' }} />
                                        <Skeleton width="90%" height="0.85rem" style={{ marginBottom: '6px' }} />
                                        <Skeleton width="60%" height="0.85rem" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="plan-cards-grid">
                            {plans.map((plan, index) => {
                                const color = getPlanColor(index);
                                const completedSteps = plan.therapySequence.filter(s => s.status === 'completed').length;
                                const totalSteps = plan.therapySequence.length;
                                const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

                                return (
                                    <div
                                        key={plan.id}
                                        className="plan-card"
                                        onClick={() => handleSelectPlan(plan.id)}
                                    >
                                        <div className="plan-card-banner" style={{ background: color.bg }}>
                                            <div className="plan-card-icon">
                                                <Layers size={24} />
                                            </div>
                                            <span className={`plan-status-badge ${getStatusBadgeClass(plan.status)}`}>
                                                {plan.status}
                                            </span>
                                        </div>
                                        <div className="plan-card-body">
                                            <h3 className="plan-card-name">{plan.name}</h3>
                                            <p className="plan-card-desc">{plan.description}</p>

                                            <div className="plan-card-meta">
                                                <span className="plan-meta-item">
                                                    <Calendar size={14} /> {plan.duration}
                                                </span>
                                                <span className="plan-meta-item">
                                                    <Zap size={14} /> {plan.totalSessions} Sessions
                                                </span>
                                                <span className="plan-meta-item">
                                                    <Users size={14} /> {plan.assignedPatients} Patients
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="plan-progress-wrapper">
                                                <div className="plan-progress-label">
                                                    <span>Progress</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="plan-progress-bar">
                                                    <div
                                                        className="plan-progress-fill"
                                                        style={{ width: `${progress}%`, background: color.bg }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="plan-tags">
                                                {plan.tags?.map(tag => (
                                                    <span key={tag} className="plan-tag"><Tag size={10} /> {tag}</span>
                                                ))}
                                            </div>

                                            <button className="plan-card-btn">
                                                View Plan <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* ===== DETAIL VIEW ===== */
    return (
        <div className="plan-page">
            <div className="plan-detail-view">
                <div className="dashboard-navigation">
                    <button className="back-btn" onClick={handleBack}>
                        <ArrowLeft size={16} /> Back to Therapy Plans
                    </button>
                </div>

                {isDetailLoading || !selectedPlan ? (
                    <div style={{ padding: 'var(--spacing-lg)' }}>
                        <Skeleton width="350px" height="2rem" style={{ marginBottom: '1rem' }} />
                        <Skeleton width="100%" height="1.2rem" style={{ marginBottom: '0.5rem' }} />
                        <Skeleton width="80%" height="1.2rem" style={{ marginBottom: '2rem' }} />
                        <Skeleton width="100%" height="300px" />
                    </div>
                ) : (
                    <>
                        <div className="plan-detail-header">
                            <div className="plan-detail-title-row">
                                <h2>{selectedPlan.name}</h2>
                                <span className={`plan-status-badge ${getStatusBadgeClass(selectedPlan.status)}`}>
                                    {selectedPlan.status}
                                </span>
                            </div>
                            <p className="plan-detail-desc">{selectedPlan.description}</p>

                            <div className="plan-detail-stats">
                                <div className="plan-detail-stat">
                                    <Calendar size={18} />
                                    <div>
                                        <span className="stat-value">{selectedPlan.duration}</span>
                                        <span className="stat-label">Duration</span>
                                    </div>
                                </div>
                                <div className="plan-detail-stat">
                                    <Zap size={18} />
                                    <div>
                                        <span className="stat-value">{selectedPlan.totalSessions}</span>
                                        <span className="stat-label">Total Sessions</span>
                                    </div>
                                </div>
                                <div className="plan-detail-stat">
                                    <Users size={18} />
                                    <div>
                                        <span className="stat-value">{selectedPlan.assignedPatients}</span>
                                        <span className="stat-label">Assigned Patients</span>
                                    </div>
                                </div>
                                <div className="plan-detail-stat">
                                    <Clock size={18} />
                                    <div>
                                        <span className={`stat-value difficulty-badge ${getDifficultyClass(selectedPlan.difficulty)}`}>
                                            {selectedPlan.difficulty}
                                        </span>
                                        <span className="stat-label">Difficulty</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Therapy Sequence Timeline */}
                        <div className="plan-timeline-section">
                            <h3 className="section-title">Therapy Sequence</h3>
                            <div className="plan-timeline">
                                {selectedPlan.therapySequence.map((seq, index) => (
                                    <div key={seq.id} className={`timeline-item ${seq.status}`}>
                                        <div className="timeline-connector">
                                            {getStatusIcon(seq.status)}
                                            {index < selectedPlan.therapySequence.length - 1 && (
                                                <div className="timeline-line" />
                                            )}
                                        </div>
                                        <div className="timeline-content">
                                            <div className="timeline-header">
                                                <h4>{seq.therapyName}</h4>
                                                <span className="timeline-day">{seq.day}</span>
                                            </div>
                                            <p className="timeline-notes">{seq.notes}</p>
                                            <div className="timeline-meta">
                                                <span className="timeline-sessions">
                                                    <Zap size={12} /> {seq.sessions} Sessions
                                                </span>
                                                <span className={`timeline-status-badge status-${seq.status}`}>
                                                    {seq.status.replace('-', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        {selectedPlan.tags && selectedPlan.tags.length > 0 && (
                            <div className="plan-detail-tags">
                                <h3 className="section-title">Tags</h3>
                                <div className="plan-tags">
                                    {selectedPlan.tags.map(tag => (
                                        <span key={tag} className="plan-tag"><Tag size={12} /> {tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TherapyPlanPage;
