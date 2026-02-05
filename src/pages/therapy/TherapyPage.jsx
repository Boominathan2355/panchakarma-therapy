import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTherapies, fetchTherapyDetails } from '../../store/slices/therapySlice';
import WorkflowEditor from '../../components/organisms/WorkflowEditor';
import SafetyPanel from '../../components/organisms/SafetyPanel';
import DocumentUploader from '../../components/organisms/DocumentUploader';
import './TherapyPage.css';

const TherapyPage = () => {
    const dispatch = useDispatch();
    const { therapies, selectedTherapy, isLoading } = useSelector((state) => state.therapy);
    const [activeTab, setActiveTab] = useState('workflow');
    const [searchTerm, setSearchTerm] = useState('');
    const [kbStatus, setKbStatus] = useState('synced'); // synced, updating

    // Mock "Semantic" Embeddings Map
    // In a real app, this would be vector similarity search
    const semanticMap = {
        'detox': ['Vamana', 'Virechana'],
        'cleansing': ['Vamana', 'Virechana'],
        'stress': ['Shirodhara', 'Abhyanga'],
        'anxiety': ['Shirodhara'],
        'joint pain': ['Abhyanga', 'Janu Basti'],
        'arthritis': ['Janu Basti', 'Abhyanga'],
        'skin': ['Virechana'],
        'weight loss': ['Udvartana'],
        'relaxation': ['Shirodhara', 'Abhyanga']
    };

    const getRelevance = (therapy, term) => {
        if (!term) return 0;
        const lowerTerm = term.toLowerCase();
        const lowerName = therapy.name.toLowerCase();
        const lowerDesc = therapy.description.toLowerCase();

        // 1. Direct Match
        if (lowerName.includes(lowerTerm)) return 100;

        // 2. Semantic Match (via Mock Embeddings)
        let score = 0;
        Object.keys(semanticMap).forEach(key => {
            if (lowerTerm.includes(key) || key.includes(lowerTerm)) {
                if (semanticMap[key].includes(therapy.name)) {
                    score = 92 + Math.floor(Math.random() * 5); // Mock high confidence
                }
            }
        });

        // 3. Content Match
        if (score === 0 && lowerDesc.includes(lowerTerm)) return 85;

        return score;
    };

    const filteredTherapies = therapies
        .map(t => ({ ...t, score: getRelevance(t, searchTerm) }))
        .filter(t => searchTerm === '' || t.score > 0)
        .sort((a, b) => b.score - a.score);

    useEffect(() => {
        dispatch(fetchTherapies());
        // Simulate background KB monitoring
        const interval = setInterval(() => {
            setKbStatus('updating');
            setTimeout(() => setKbStatus('synced'), 2000);
        }, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [dispatch]);

    // Select first therapy by default when list loads
    useEffect(() => {
        if (therapies.length > 0 && !selectedTherapy) {
            dispatch(fetchTherapyDetails(therapies[0].id));
        }
    }, [therapies, selectedTherapy, dispatch]);

    const handleSelectTherapy = (id) => {
        dispatch(fetchTherapyDetails(id));
        setActiveTab('workflow'); // Reset tab
    };

    if (isLoading && !selectedTherapy) {
        return <div className="loading-state">Loading therapies...</div>;
    }

    return (
        <div className="therapy-page">
            <div className="therapy-sidebar">
                <div className="sidebar-header-row">
                    <h3>Therapies</h3>
                    <div className={`kb-status ${kbStatus}`} title="Knowledge Base Embeddings Status">
                        <span className="kb-dot"></span>
                        <span className="kb-text">{kbStatus === 'synced' ? 'KB Synced' : 'Indexing...'}</span>
                    </div>
                </div>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Semantic Search (e.g. 'Detox', 'Stress')..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <ul className="therapy-list">
                    {filteredTherapies.map(t => (
                        <li
                            key={t.id}
                            className={`therapy-list-item ${selectedTherapy?.id === t.id ? 'active' : ''}`}
                            onClick={() => handleSelectTherapy(t.id)}
                        >
                            <div className="therapy-item-header">
                                <span className="therapy-name">{t.name}</span>
                                {searchTerm && t.score > 0 && (
                                    <span className="relevance-score">{t.score}% Match</span>
                                )}
                            </div>
                            <span className="therapy-desc-short">{t.description.substring(0, 30)}...</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="therapy-content">
                {selectedTherapy ? (
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
                ) : (
                    <div className="wrapper-empty">Select a therapy to view details</div>
                )}
            </div>
        </div>
    );
};

export default TherapyPage;
