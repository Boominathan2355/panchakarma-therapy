import React, { useState, useCallback } from 'react';
import { Zap, Play, CheckCircle, AlertTriangle, Settings, ChevronDown, ChevronUp, User, Target, Loader2 } from 'lucide-react';
import { HybridScheduler, PriorityToken, PRIORITY_LEVELS } from '../../algorithms';
import { TherapyDefinition } from '../../types/therapy';
import { Patient } from '../../types/patient';
import './ScheduleOptimizer.scss';

export interface ScheduleOptimizerProps {
    onScheduleGenerated?: (result: any) => void;
    therapies?: TherapyDefinition[];
    patients?: Patient[];
    resources?: Record<string, any>;
    existingSessions?: any[];
    initialTask?: any;
}

interface ProgressState {
    phase: string;
    percent: number;
    message: string;
}

const ScheduleOptimizer: React.FC<ScheduleOptimizerProps> = ({
    onScheduleGenerated,
    therapies = [],
    patients = [],
    resources = {},
    existingSessions = [],
    initialTask = null
}) => {
    const [selectedTherapy, setSelectedTherapy] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('');
    const [priorityLevel, setPriorityLevel] = useState<keyof typeof PRIORITY_LEVELS>('NORMAL');
    const [priorityReason, setPriorityReason] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [progress, setProgress] = useState<ProgressState>({ phase: '', percent: 0, message: '' });
    const [result, setResult] = useState<any | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [config, setConfig] = useState({
        enableGA: true,
        enablePSO: true,
        gaGenerations: 100,
        psoIterations: 50
    });

    React.useEffect(() => {
        if (initialTask) {
            setSelectedTherapy(initialTask.therapyId || '');
            setSelectedPatient(initialTask.patientId || '');
            setPriorityLevel(initialTask.priority || 'NORMAL');
            setPriorityReason(initialTask.priorityReason || '');
        }
    }, [initialTask]);

    const handleProgressUpdate = useCallback((update: any) => {
        setProgress({
            phase: update.phase,
            percent: update.progress || 0,
            message: update.message || ''
        });
    }, []);

    const handleOptimize = async () => {
        if (!selectedTherapy || !selectedPatient) {
            return;
        }

        setIsOptimizing(true);
        setResult(null);
        setProgress({ phase: 'starting', percent: 0, message: 'Initializing...' });

        try {
            const therapy = therapies.find(t => String(t.id) === String(selectedTherapy));
            const patient = patients.find(p => String(p.id) === String(selectedPatient));
            const priorityToken = new PriorityToken(priorityLevel, priorityReason);

            if (!therapy || !patient) {
                throw new Error('Could not find complete data for the selected therapy or patient. Please ensure they are properly selected.');
            }

            const scheduler = new HybridScheduler({
                enableGA: config.enableGA,
                enablePSO: config.enablePSO,
                ga: { generations: config.gaGenerations },
                pso: { iterations: config.psoIterations }
            });

            scheduler.setProgressCallback(handleProgressUpdate);

            const scheduleResult = await scheduler.generateSchedule(
                therapy,
                patient,
                priorityToken,
                resources,
                existingSessions
            );

            setResult(scheduleResult);

            if (scheduleResult.success && onScheduleGenerated) {
                onScheduleGenerated(scheduleResult);
            }
        } catch (error: any) {
            setResult({
                success: false,
                errors: [{ phase: 'execution', message: error.message }]
            });
        } finally {
            setIsOptimizing(false);
        }
    };

    const renderProgressBar = () => (
        <div className="optimizer-progress">
            <div className="progress-header">
                <span className="progress-phase">{progress.phase}</span>
                <span className="progress-percent">{progress.percent.toFixed(0)}%</span>
            </div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progress.percent}%` }}
                />
            </div>
            <p className="progress-message">{progress.message}</p>
        </div>
    );

    const renderMetrics = () => {
        if (!result?.metrics) return null;

        return (
            <div className="optimizer-metrics">
                <h4>Optimization Metrics</h4>
                <div className="metrics-grid">
                    <div className="metric-item">
                        <span className="metric-value">{result.metrics.totalSessions}</span>
                        <span className="metric-label">Sessions</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-value">{result.metrics.gaGenerations}</span>
                        <span className="metric-label">GA Generations</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-value">{result.metrics.gaFitness?.toFixed(1)}</span>
                        <span className="metric-label">GA Fitness</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-value">{result.metrics.psoIterations}</span>
                        <span className="metric-label">PSO Iterations</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-value">{result.metrics.psoFitness?.toFixed(1)}</span>
                        <span className="metric-label">PSO Fitness</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-value">{result.metrics.conflictsResolved}</span>
                        <span className="metric-label">Conflicts Resolved</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="schedule-optimizer">
            <div className="optimizer-header">
                <Zap size={24} />
                <h3>Hybrid Schedule Optimizer</h3>
            </div>

            {initialTask && (
                <div className="selected-task-banner">
                    <User size={16} />
                    <span>Scheduling for <strong>{initialTask.patientName}</strong> ({initialTask.therapyName})</span>
                    <button className="clear-selection" onClick={() => {
                        // This should ideally notify the parent to clear selectedTask
                        // For now, it just clears the local state via useEffect if parent updates
                    }}>
                        <Target size={12} />
                        Auto-filled from Queue
                    </button>
                </div>
            )}

            <div className="optimizer-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="therapy-select">Therapy</label>
                        <select
                            id="therapy-select"
                            value={selectedTherapy}
                            onChange={(e) => setSelectedTherapy(e.target.value)}
                            disabled={isOptimizing}
                        >
                            <option value="">Select Therapy...</option>
                            {therapies.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="patient-select">Patient</label>
                        <select
                            id="patient-select"
                            value={selectedPatient}
                            onChange={(e) => setSelectedPatient(e.target.value)}
                            disabled={isOptimizing}
                        >
                            <option value="">Select Patient...</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="priority-select">Priority</label>
                        <select
                            id="priority-select"
                            value={priorityLevel}
                            onChange={(e) => setPriorityLevel(e.target.value as any)}
                            disabled={isOptimizing}
                            style={{
                                borderLeftColor: (PRIORITY_LEVELS as any)[priorityLevel]?.color,
                                borderLeftWidth: '4px'
                            }}
                        >
                            {Object.entries(PRIORITY_LEVELS).map(([key, val]) => (
                                <option key={key} value={key}>{val.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority-reason">Reason (optional)</label>
                        <input
                            id="priority-reason"
                            type="text"
                            placeholder="Enter reason for priority..."
                            value={priorityReason}
                            onChange={(e) => setPriorityReason(e.target.value)}
                            disabled={isOptimizing}
                        />
                    </div>
                </div>

                <button
                    className="advanced-toggle"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    type="button"
                >
                    <Settings size={16} />
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </button>

                {showAdvanced && (
                    <div className="advanced-options">
                        <div className="option-row">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={config.enableGA}
                                    onChange={(e) => setConfig({ ...config, enableGA: e.target.checked })}
                                />
                                Enable Genetic Algorithm
                            </label>
                            {config.enableGA && (
                                <input
                                    type="number"
                                    value={config.gaGenerations}
                                    onChange={(e) => setConfig({ ...config, gaGenerations: parseInt(e.target.value) || 100 })}
                                    min="10"
                                    max="500"
                                    placeholder="Generations"
                                />
                            )}
                        </div>
                        <div className="option-row">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={config.enablePSO}
                                    onChange={(e) => setConfig({ ...config, enablePSO: e.target.checked })}
                                />
                                Enable Particle Swarm Optimization
                            </label>
                            {config.enablePSO && (
                                <input
                                    type="number"
                                    value={config.psoIterations}
                                    onChange={(e) => setConfig({ ...config, psoIterations: parseInt(e.target.value) || 50 })}
                                    min="10"
                                    max="200"
                                    placeholder="Iterations"
                                />
                            )}
                        </div>
                    </div>
                )}

                <button
                    className="optimize-btn"
                    onClick={handleOptimize}
                    disabled={isOptimizing || !selectedTherapy || !selectedPatient}
                >
                    {isOptimizing ? (
                        <>
                            <Loader2 size={18} className="spin" />
                            Optimizing...
                        </>
                    ) : (
                        <>
                            <Play size={18} />
                            Generate Optimized Schedule
                        </>
                    )}
                </button>
            </div>

            {isOptimizing && renderProgressBar()}

            {result && (
                <div className={`optimizer-result ${result.success ? 'success' : 'error'}`}>
                    <div className="result-header">
                        {result.success ? (
                            <>
                                <CheckCircle size={20} />
                                <span>Schedule Generated Successfully</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle size={20} />
                                <span>Scheduling Failed</span>
                            </>
                        )}
                    </div>

                    {result.success && renderMetrics()}

                    {result.errors && result.errors.length > 0 && (
                        <div className="result-errors">
                            {result.errors.map((err: any, idx: number) => (
                                <div key={idx} className="error-item">
                                    <strong>{err.phase}:</strong> {err.message}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScheduleOptimizer;
