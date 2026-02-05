import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import './WorkflowEditor.css';

const WorkflowEditor = ({ steps = [], onUpdate }) => {
    // In a real app, this would dispatch updates.
    // Here we just display the mock data

    return (
        <div className="workflow-editor">
            <div className="editor-header">
                <h3>Treatment Protocol</h3>
                <Button variant="outline" size="small"><Plus size={16} /> Add Step</Button>
            </div>

            <div className="steps-list">
                {steps.map((step, index) => (
                    <div key={step.id || index} className="step-item">
                        <div className="step-number">{step.step}</div>
                        <div className="step-content">
                            <div className="step-row">
                                <span className="step-label">Action:</span>
                                <span className="step-value">{step.action}</span>
                            </div>
                            <div className="step-row">
                                <span className="step-label">Duration:</span>
                                <span className="step-value">{step.duration}</span>
                            </div>
                            {step.notes && (
                                <div className="step-row notes">
                                    <span className="step-label">Notes:</span>
                                    <span className="step-value text-muted">{step.notes}</span>
                                </div>
                            )}
                        </div>
                        <div className="step-actions">
                            <button className="icon-btn-danger"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}

                {steps.length === 0 && (
                    <div className="empty-state">No steps defined for this therapy.</div>
                )}
            </div>
        </div>
    );
};

export default WorkflowEditor;
