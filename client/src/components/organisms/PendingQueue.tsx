import React from 'react';
import { Clock, User, ArrowRight, Play } from 'lucide-react';
import './PendingQueue.scss';

export interface PendingTask {
    id: string;
    patientId: string;
    patientName: string;
    therapyId: string;
    therapyName: string;
    planStartDate: string;
    priority: 'NORMAL' | 'URGENT' | 'EMERGENCY';
}

interface PendingQueueProps {
    tasks: PendingTask[];
    onSelectTask: (task: PendingTask) => void;
    onRunBatch?: (taskIds: string[]) => void;
}

const PendingQueue: React.FC<PendingQueueProps> = ({ tasks, onSelectTask, onRunBatch }) => {
    return (
        <div className="pending-queue">
            <div className="queue-header">
                <h4>Pending Scheduling</h4>
                <span className="badge">{tasks.length}</span>
            </div>
            
            <div className="queue-list">
                {tasks.length === 0 ? (
                    <div className="queue-empty">
                        <Clock size={32} />
                        <p>No pending plans to schedule</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div 
                            key={task.id} 
                            className={`queue-item ${task.priority.toLowerCase()}`}
                            onClick={() => onSelectTask(task)}
                        >
                            <div className="item-main">
                                <div className="patient-info">
                                    <User size={14} />
                                    <span>{task.patientName}</span>
                                </div>
                                <div className="therapy-name">{task.therapyName}</div>
                            </div>
                            <div className="item-footer">
                                <span className="start-date">Starts: {new Date(task.planStartDate).toLocaleDateString()}</span>
                                <button className="add-btn">
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {tasks.length > 1 && onRunBatch && (
                <button 
                    className="batch-run-btn"
                    onClick={() => onRunBatch(tasks.map(t => t.id))}
                >
                    <Play size={14} />
                    Schedule All Pending
                </button>
            )}
        </div>
    );
};

export default PendingQueue;
