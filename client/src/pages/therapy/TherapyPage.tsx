import React, { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth';
import { useTherapies, useTherapy } from '../../hooks/useTherapy';
import { useNavigate, useParams } from 'react-router-dom';
// Organisms
import TherapyDashboard from '../../components/organisms/TherapyDashboard';
import WorkflowEditor from '../../components/organisms/WorkflowEditor';
import SafetyPanel from '../../components/organisms/SafetyPanel';
import DocumentUploader from '../../components/organisms/DocumentUploader';
import Skeleton from '../../components/atoms/Skeleton';
import { ChevronRight } from 'lucide-react';
import './TherapyPage.css';

const TherapyPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    
    const { data: therapies = [], isLoading: isListLoading } = useTherapies();
    const { data: selectedTherapy, isLoading: isDetailLoading } = useTherapy(id);
    
    const [activeTab, setActiveTab] = useState<'workflow' | 'safety' | 'docs'>('workflow');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelectTherapy = (therapyId: string) => {
        navigate(`/therapies/${therapyId}`);
        setActiveTab('workflow');
    };

    const handleBack = () => {
        navigate('/therapies');
    };


    return (
        <div className="therapy-page">
            {!id ? (
                /* === Dashboard View === */
                <TherapyDashboard
                    therapies={therapies as any}
                    onSelect={handleSelectTherapy}
                    isLoading={isListLoading}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            ) : (
                /* === Detail / Info View === */
                <div className="therapy-detail-view">
                    <div className="dashboard-navigation">
                        <div className="breadcrumb">
                            <span className="breadcrumb-item clickable" onClick={handleBack}>
                                Therapy Protocols
                            </span>
                            <ChevronRight size={14} className="breadcrumb-separator" />
                            <span className="breadcrumb-item active">
                                {selectedTherapy?.name || id}
                            </span>
                        </div>
                    </div>

                    {isDetailLoading || !selectedTherapy ? (
                        <div className="skeleton-detail-view" style={{ padding: 'var(--spacing-lg)' }}>
                            <Skeleton width="300px" height="2rem" />
                            <Skeleton width="100%" height="1.2rem" />
                            <Skeleton width="80%" height="1.2rem" />
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
                                {user?.role?.toLowerCase() !== 'physician' && (
                                    <button
                                        className={`tab-link ${activeTab === 'docs' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('docs')}
                                    >
                                        Documents
                                    </button>
                                )}
                            </div>

                            <div className="tab-content">
                                {activeTab === 'workflow' && (
                                    <WorkflowEditor steps={selectedTherapy.workflow as any} />
                                )}
                                {activeTab === 'safety' && (
                                    <SafetyPanel
                                        contraindications={selectedTherapy.contraindications}
                                        safetyNotes={selectedTherapy.safetyNotes}
                                    />
                                )}
                                {activeTab === 'docs' && user?.role?.toLowerCase() !== 'physician' && (
                                    <DocumentUploader documents={selectedTherapy.documents as any} />
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
