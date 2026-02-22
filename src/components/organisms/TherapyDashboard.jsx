import React from 'react';
import { Clock, AlertTriangle, FileText, ChevronRight, Zap } from 'lucide-react';
import Skeleton from '../atoms/Skeleton';
import './TherapyDashboard.css';

const TherapyDashboard = ({ therapies, onSelect, isLoading, searchTerm, onSearchChange }) => {

    // Mock "Semantic" Embeddings Map
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

        if (lowerName.includes(lowerTerm)) return 100;

        let score = 0;
        Object.keys(semanticMap).forEach(key => {
            if (lowerTerm.includes(key) || key.includes(lowerTerm)) {
                if (semanticMap[key].includes(therapy.name)) {
                    score = 92 + Math.floor(Math.random() * 5);
                }
            }
        });

        if (score === 0 && lowerDesc.includes(lowerTerm)) return 85;
        return score;
    };

    const filteredTherapies = therapies
        .map(t => ({ ...t, score: getRelevance(t, searchTerm) }))
        .filter(t => searchTerm === '' || t.score > 0)
        .sort((a, b) => b.score - a.score);

    const getTherapyColor = (index) => {
        const colors = [
            { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' },
            { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', accent: '#f5576c' },
            { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accent: '#4facfe' },
            { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', accent: '#43e97b' },
            { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', accent: '#fa709a' },
            { bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', accent: '#a18cd1' },
        ];
        return colors[index % colors.length];
    };

    if (isLoading) {
        return (
            <div className="therapy-dashboard">
                <div className="therapy-dash-header">
                    <div>
                        <h1 className="therapy-dash-title">Therapy Protocols</h1>
                        <p className="therapy-dash-subtitle">Select a therapy to view its full protocol details</p>
                    </div>
                </div>
                <div className="therapy-cards-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="therapy-card skeleton-card">
                            <Skeleton width="100%" height="70px" style={{ borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
                            <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}>
                                <Skeleton width="60%" height="1rem" style={{ marginBottom: '8px' }} />
                                <Skeleton width="90%" height="0.75rem" style={{ marginBottom: '4px' }} />
                                <Skeleton width="70%" height="0.75rem" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="therapy-dashboard">
            <div className="therapy-dash-header">
                <div>
                    <h1 className="therapy-dash-title">Therapy Protocols</h1>
                    <p className="therapy-dash-subtitle">Select a therapy to view its full protocol details</p>
                </div>
                <div className="therapy-search-bar">
                    <Zap size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Semantic Search (e.g. 'Detox', 'Stress')..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="therapy-search-input"
                    />
                </div>
            </div>

            {filteredTherapies.length === 0 ? (
                <div className="therapy-empty-state">
                    <Zap size={48} />
                    <h3>No therapies match your search</h3>
                    <p>Try a different keyword like "detox", "stress", or "relaxation"</p>
                </div>
            ) : (
                <div className="therapy-cards-grid">
                    {filteredTherapies.map((therapy, index) => {
                        const color = getTherapyColor(index);
                        return (
                            <div
                                key={therapy.id}
                                className="therapy-card"
                                onClick={() => onSelect(therapy.id)}
                            >
                                <div className="therapy-card-banner" style={{ background: color.bg }}>
                                    <div className="therapy-card-icon">
                                        <Zap size={18} />
                                    </div>
                                    {searchTerm && therapy.score > 0 && (
                                        <span className="therapy-match-badge">{therapy.score}% Match</span>
                                    )}
                                </div>
                                <div className="therapy-card-body">
                                    <h3 className="therapy-card-name">{therapy.name}</h3>
                                    <p className="therapy-card-desc">{therapy.description}</p>

                                    <div className="therapy-card-stats">
                                        <div className="therapy-stat">
                                            <Clock size={11} />
                                            <span>{therapy.workflow?.length || 0} Steps</span>
                                        </div>
                                        <div className="therapy-stat">
                                            <AlertTriangle size={11} />
                                            <span>{therapy.contraindications?.length || 0} Warnings</span>
                                        </div>
                                        <div className="therapy-stat">
                                            <FileText size={11} />
                                            <span>{therapy.documents?.length || 0} Docs</span>
                                        </div>
                                    </div>

                                    <button className="therapy-card-btn">
                                        View Protocol <ChevronRight size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TherapyDashboard;
