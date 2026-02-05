import React, { useState, useMemo } from 'react';
import {
    Brain,
    Clock,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    Zap,
    Target,
    Filter
} from 'lucide-react';
import { DECISION_TYPES } from '../../algorithms';
import './ScheduleExplainer.css';

/**
 * Schedule Explainer Component
 * TRACE-CS inspired explainability panel showing decision rationale
 */
const ScheduleExplainer = ({ explanations = null, onClose }) => {
    const [expandedPhases, setExpandedPhases] = useState(new Set());
    const [filterType, setFilterType] = useState('ALL');

    const decisionTypeIcons = {
        [DECISION_TYPES.PLACEMENT]: <Target size={16} />,
        [DECISION_TYPES.OPTIMIZATION]: <Zap size={16} />,
        [DECISION_TYPES.CONSTRAINT]: <AlertTriangle size={16} />,
        [DECISION_TYPES.PREEMPTION]: <ArrowRight size={16} />,
        [DECISION_TYPES.CONFLICT]: <AlertTriangle size={16} />,
        [DECISION_TYPES.MANUAL]: <Lightbulb size={16} />
    };

    const decisionTypeColors = {
        [DECISION_TYPES.PLACEMENT]: '#22c55e',
        [DECISION_TYPES.OPTIMIZATION]: '#8b5cf6',
        [DECISION_TYPES.CONSTRAINT]: '#eab308',
        [DECISION_TYPES.PREEMPTION]: '#f97316',
        [DECISION_TYPES.CONFLICT]: '#ef4444',
        [DECISION_TYPES.MANUAL]: '#06b6d4'
    };

    const togglePhase = (phaseId) => {
        const newExpanded = new Set(expandedPhases);
        if (newExpanded.has(phaseId)) {
            newExpanded.delete(phaseId);
        } else {
            newExpanded.add(phaseId);
        }
        setExpandedPhases(newExpanded);
    };

    const filteredTimeline = useMemo(() => {
        if (!explanations?.timeline) return [];
        if (filterType === 'ALL') return explanations.timeline;
        return explanations.timeline.filter(item => item.type === filterType);
    }, [explanations, filterType]);

    if (!explanations) {
        return (
            <div className="schedule-explainer empty">
                <Brain size={48} />
                <p>Run the scheduler to see decision explanations</p>
            </div>
        );
    }

    return (
        <div className="schedule-explainer">
            <div className="explainer-header">
                <Brain size={24} />
                <h3>Decision Explainer</h3>
            </div>

            {/* Summary Cards */}
            <div className="explainer-summary">
                <div className="summary-card">
                    <span className="summary-value">{explanations.summary?.totalDecisions || 0}</span>
                    <span className="summary-label">Decisions</span>
                </div>
                <div className="summary-card">
                    <span className="summary-value">{explanations.summary?.constraintsResolved || 0}</span>
                    <span className="summary-label">Constraints</span>
                </div>
                <div className="summary-card">
                    <span className="summary-value">{explanations.summary?.conflictsHandled || 0}</span>
                    <span className="summary-label">Conflicts</span>
                </div>
                <div className="summary-card">
                    <span className="summary-value">{explanations.summary?.optimizations || 0}</span>
                    <span className="summary-label">Optimizations</span>
                </div>
            </div>

            {/* Phase Breakdown */}
            <div className="phase-section">
                <h4>Phase Breakdown</h4>
                <div className="phases-list">
                    {explanations.phases?.map((phase, idx) => (
                        <div key={idx} className="phase-item">
                            <div
                                className="phase-header"
                                onClick={() => togglePhase(idx)}
                            >
                                <div className="phase-info">
                                    <span className="phase-number">{idx + 1}</span>
                                    <div className="phase-details">
                                        <span className="phase-name">{phase.name}</span>
                                        <span className="phase-description">{phase.description}</span>
                                    </div>
                                </div>
                                <div className="phase-meta">
                                    <span className="phase-duration">
                                        <Clock size={14} />
                                        {phase.duration}
                                    </span>
                                    <span className="phase-count">{phase.decisionCount} decisions</span>
                                    {expandedPhases.has(idx) ? (
                                        <ChevronUp size={18} />
                                    ) : (
                                        <ChevronDown size={18} />
                                    )}
                                </div>
                            </div>
                            {expandedPhases.has(idx) && phase.summary && (
                                <div className="phase-expanded">
                                    <p>{phase.summary}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Decision Timeline */}
            <div className="timeline-section">
                <div className="timeline-header">
                    <h4>Decision Timeline</h4>
                    <div className="timeline-filter">
                        <Filter size={14} />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="ALL">All Types</option>
                            {Object.entries(DECISION_TYPES).map(([key, value]) => (
                                <option key={key} value={value}>{key}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="timeline-list">
                    {filteredTimeline.length === 0 ? (
                        <div className="timeline-empty">No decisions to display</div>
                    ) : (
                        filteredTimeline.map((item, idx) => (
                            <div key={item.id || idx} className="timeline-item">
                                <div
                                    className="timeline-icon"
                                    style={{ backgroundColor: decisionTypeColors[item.type] || '#6b7280' }}
                                >
                                    {decisionTypeIcons[item.type] || <CheckCircle size={16} />}
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-top">
                                        <span
                                            className="timeline-type"
                                            style={{ color: decisionTypeColors[item.type] || '#6b7280' }}
                                        >
                                            {item.type}
                                        </span>
                                        <span className="timeline-time">{item.timestamp}</span>
                                    </div>
                                    <p className="timeline-summary">{item.summary}</p>
                                    {item.reason && (
                                        <p className="timeline-reason">
                                            <Lightbulb size={12} /> {item.reason}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Metrics Footer */}
            {explanations.metrics && (
                <div className="explainer-footer">
                    <div className="footer-stat">
                        <CheckCircle size={16} className="success" />
                        <span>{explanations.metrics.totalDecisions} total decisions made</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleExplainer;
