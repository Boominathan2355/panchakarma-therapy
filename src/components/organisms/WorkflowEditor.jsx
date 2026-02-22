import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Save, X, Edit3 } from 'lucide-react';
import Button from '../atoms/Button';
import './WorkflowEditor.css';

const WorkflowEditor = ({ steps = [], onUpdate }) => {
    const [localSteps, setLocalSteps] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStepId, setEditingStepId] = useState(null);
    const [expandedStepId, setExpandedStepId] = useState(null);
    const [dragIndex, setDragIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [newStep, setNewStep] = useState({
        action: '',
        duration: '',
        notes: '',
    });

    // Initialize local state from props
    useEffect(() => {
        setLocalSteps(steps.map((s, i) => ({ ...s, id: s.id || `step-${i}` })));
    }, [steps]);

    const handleAddStep = () => {
        if (!newStep.action.trim()) return;

        const step = {
            id: `step-${Date.now()}`,
            step: localSteps.length + 1,
            action: newStep.action.trim(),
            duration: newStep.duration.trim(),
            notes: newStep.notes.trim(),
        };

        const updated = [...localSteps, step];
        setLocalSteps(updated);
        setNewStep({ action: '', duration: '', notes: '' });
        setShowAddForm(false);

        if (onUpdate) onUpdate(updated);
    };

    const handleDeleteStep = (stepId) => {
        const updated = localSteps
            .filter(s => s.id !== stepId)
            .map((s, i) => ({ ...s, step: i + 1 }));
        setLocalSteps(updated);

        if (editingStepId === stepId) setEditingStepId(null);
        if (expandedStepId === stepId) setExpandedStepId(null);

        if (onUpdate) onUpdate(updated);
    };

    const handleEditStep = (stepId, field, value) => {
        const updated = localSteps.map(s =>
            s.id === stepId ? { ...s, [field]: value } : s
        );
        setLocalSteps(updated);
    };

    const handleSaveEdit = () => {
        setEditingStepId(null);
        if (onUpdate) onUpdate(localSteps);
    };

    const handleCancelEdit = () => {
        // Revert to props
        setLocalSteps(steps.map((s, i) => ({ ...s, id: s.id || `step-${i}` })));
        setEditingStepId(null);
    };

    const handleMoveStep = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= localSteps.length) return;

        const updated = [...localSteps];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        const renumbered = updated.map((s, i) => ({ ...s, step: i + 1 }));
        setLocalSteps(renumbered);

        if (onUpdate) onUpdate(renumbered);
    };

    const toggleExpand = (stepId) => {
        setExpandedStepId(expandedStepId === stepId ? null : stepId);
    };

    // ===== Drag & Drop Handlers =====
    const handleDragStart = (e, index) => {
        setDragIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
        // Make the dragged element semi-transparent after a tick
        setTimeout(() => {
            e.target.closest('.step-item')?.classList.add('dragging');
        }, 0);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragIndex === null || index === dragIndex) {
            setDragOverIndex(null);
            return;
        }
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === dropIndex) {
            setDragIndex(null);
            setDragOverIndex(null);
            return;
        }

        const updated = [...localSteps];
        const [dragged] = updated.splice(dragIndex, 1);
        updated.splice(dropIndex, 0, dragged);
        const renumbered = updated.map((s, i) => ({ ...s, step: i + 1 }));
        setLocalSteps(renumbered);
        setDragIndex(null);
        setDragOverIndex(null);

        if (onUpdate) onUpdate(renumbered);
    };

    const handleDragEnd = (e) => {
        e.target.closest('.step-item')?.classList.remove('dragging');
        setDragIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className="workflow-editor">
            <div className="editor-header">
                <h3>Treatment Protocol</h3>
                <Button
                    variant="outline"
                    size="small"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Step</>}
                </Button>
            </div>

            {/* Add Step Form */}
            {showAddForm && (
                <div className="add-step-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Action *</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Snehapana (Internal Oleation)"
                                value={newStep.action}
                                onChange={(e) => setNewStep({ ...newStep, action: e.target.value })}
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Duration</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. 3-7 days"
                                value={newStep.duration}
                                onChange={(e) => setNewStep({ ...newStep, duration: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Additional notes or instructions..."
                            value={newStep.notes}
                            onChange={(e) => setNewStep({ ...newStep, notes: e.target.value })}
                            rows={2}
                        />
                    </div>
                    <div className="form-actions">
                        <Button
                            variant="primary"
                            size="small"
                            onClick={handleAddStep}
                            disabled={!newStep.action.trim()}
                        >
                            <Plus size={14} /> Add Step
                        </Button>
                        <Button
                            variant="outline"
                            size="small"
                            onClick={() => {
                                setShowAddForm(false);
                                setNewStep({ action: '', duration: '', notes: '' });
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Steps List */}
            <div className="steps-list">
                {localSteps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`step-item ${expandedStepId === step.id ? 'expanded' : ''} ${dragOverIndex === index ? (dragIndex < index ? 'drag-over-below' : 'drag-over-above') : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="step-main-row" onClick={() => toggleExpand(step.id)}>
                            <div className="step-drag-handle" title="Drag to reorder">
                                <GripVertical size={14} />
                            </div>
                            <div className="step-number">{step.step}</div>
                            <div className="step-content">
                                {editingStepId === step.id ? (
                                    <div className="step-edit-fields">
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={step.action}
                                            onChange={(e) => handleEditStep(step.id, 'action', e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="Action"
                                        />
                                        <input
                                            type="text"
                                            className="form-input form-input-sm"
                                            value={step.duration}
                                            onChange={(e) => handleEditStep(step.id, 'duration', e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="Duration"
                                        />
                                        <textarea
                                            className="form-textarea"
                                            value={step.notes || ''}
                                            onChange={(e) => handleEditStep(step.id, 'notes', e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="Notes"
                                            rows={2}
                                        />
                                        <div className="edit-actions">
                                            <button className="icon-btn-success" onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }}>
                                                <Save size={14} /> Save
                                            </button>
                                            <button className="icon-btn-muted" onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}>
                                                <X size={14} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="step-row">
                                            <span className="step-value step-action-text">{step.action}</span>
                                            {step.duration && (
                                                <span className="step-duration-badge">{step.duration}</span>
                                            )}
                                        </div>
                                        {step.notes && expandedStepId === step.id && (
                                            <div className="step-row notes">
                                                <span className="step-label">Notes:</span>
                                                <span className="step-value text-muted">{step.notes}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="step-actions" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="icon-btn-subtle"
                                    onClick={() => handleMoveStep(index, -1)}
                                    disabled={index === 0}
                                    title="Move Up"
                                >
                                    <ChevronUp size={14} />
                                </button>
                                <button
                                    className="icon-btn-subtle"
                                    onClick={() => handleMoveStep(index, 1)}
                                    disabled={index === localSteps.length - 1}
                                    title="Move Down"
                                >
                                    <ChevronDown size={14} />
                                </button>
                                <button
                                    className="icon-btn-primary"
                                    onClick={() => setEditingStepId(step.id)}
                                    title="Edit"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button
                                    className="icon-btn-danger"
                                    onClick={() => handleDeleteStep(step.id)}
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedStepId === step.id && editingStepId !== step.id && (
                            <div className="step-expanded-details">
                                {step.requiredMaterials && step.requiredMaterials.length > 0 && (
                                    <div className="step-detail-section">
                                        <span className="step-label">Required Materials:</span>
                                        <ul className="materials-list">
                                            {step.requiredMaterials.map((m, mi) => (
                                                <li key={mi}>{m.name} — {m.quantity} {m.unit}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {step.precautions && step.precautions.length > 0 && (
                                    <div className="step-detail-section">
                                        <span className="step-label">Precautions:</span>
                                        <ul className="precautions-list">
                                            {step.precautions.map((p, pi) => (
                                                <li key={pi}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {!step.requiredMaterials?.length && !step.precautions?.length && step.notes && (
                                    <div className="step-detail-section">
                                        <span className="step-label">Notes:</span>
                                        <span className="text-muted">{step.notes}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {localSteps.length === 0 && !showAddForm && (
                    <div className="empty-state">
                        <p>No steps defined for this therapy.</p>
                        <Button variant="primary" size="small" onClick={() => setShowAddForm(true)}>
                            <Plus size={14} /> Add First Step
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkflowEditor;
