import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTherapies, fetchTherapyDetails, clearSelectedTherapy } from '../../store/slices/therapySlice';
import TherapyDashboard from '../../components/organisms/TherapyDashboard';
import WorkflowEditor from '../../components/organisms/WorkflowEditor';
import SafetyPanel from '../../components/organisms/SafetyPanel';
import DocumentUploader from '../../components/organisms/DocumentUploader';
import Skeleton from '../../components/atoms/Skeleton';
import { ArrowLeft } from 'lucide-react';
import './TherapyPage.css';

const TherapyPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { therapies, selectedTherapy, isLoading, isListLoading, isDetailLoading } = useSelector((state) => state.therapy);
    const [activeTab, setActiveTab] = useState('workflow');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchTherapies());
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(fetchTherapyDetails(id));
        }
    }, [id, dispatch]);

    const handleSelectTherapy = (therapyId) => {
        dispatch(clearSelectedTherapy());
        navigate(`/therapies/${therapyId}`);
        setActiveTab('workflow');
    };

    const handleBack = () => {
        dispatch(clearSelectedTherapy());
        navigate('/therapies');
    };

    return (
        <div className="therapy-page">
            {!id ? (
                /* === Dashboard View === */
                <TherapyDashboard
                    therapies={therapies}
                    onSelect={handleSelectTherapy}
                    isLoading={isListLoading}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            ) : (
                /* === Detail / Info View === */
                <div className="therapy-detail-view">
                    <div className="dashboard-navigation">
                        <button className="back-btn" onClick={handleBack}>
                            <ArrowLeft size={16} /> Back to Therapies
                        </button>
                    </div>

                    {isDetailLoading || !selectedTherapy ? (
                        <div className="skeleton-detail-view" style={{ padding: 'var(--spacing-lg)' }}>
                            <Skeleton width="300px" height="2rem" style={{ marginBottom: '1rem' }} />
                            <Skeleton width="100%" height="1.2rem" style={{ marginBottom: '0.5rem' }} />
                            <Skeleton width="80%" height="1.2rem" style={{ marginBottom: '2rem' }} />
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                <Skeleton width="100px" height="32px" borderRadius="16px" />
                                <Skeleton width="160px" height="32px" borderRadius="16px" />
                                <Skeleton width="100px" height="32px" borderRadius="16px" />
                            </div>
                            <Skeleton width="100%" height="400px" />
                        </div>
                    ) : (
                        <>
                            <div className="therapy-header">
                                <h2>{selectedTherapy.name}</h2>
                                <p>{selectedTherapy.description}</p>
                            </div>

                            <div className="tabs-container">
                                <button
                                    className={`tab-link ${activeTab === 'workflow' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('workflow')}
                                >
                                    Workflow
                                </button>
                                <button
                                    className={`tab-link ${activeTab === 'safety' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('safety')}
                                >
                                    Safety & Contraindications
                                </button>
                                <button
                                    className={`tab-link ${activeTab === 'docs' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('docs')}
                                >
                                    Documents
                                </button>
                            </div>

                            <div className="tab-content">
                                {activeTab === 'workflow' && (
                                    <WorkflowEditor steps={selectedTherapy.workflow} />
                                )}
                                {activeTab === 'safety' && (
                                    <SafetyPanel
                                        contraindications={selectedTherapy.contraindications}
                                        safetyNotes={selectedTherapy.safetyNotes}
                                    />
                                )}
                                {activeTab === 'docs' && (
                                    <DocumentUploader documents={selectedTherapy.documents} />
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default TherapyPage;
