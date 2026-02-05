import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateStaff } from '../../store/slices/resourceSlice';
import Avatar from '../atoms/Avatar';
import SkillBadge from '../molecules/SkillBadge';
import { Edit2, Check, X } from 'lucide-react';
import './StaffDirectory.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const StaffDirectory = ({ staff }) => {
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const [roster, setRoster] = useState(staff);

    const toggleDay = (staffId, day) => {
        setRoster(prev => prev.map(member => {
            if (member.id !== staffId) return member;
            const hasShift = member.shifts.includes(day);
            const newShifts = hasShift
                ? member.shifts.filter(d => d !== day)
                : [...member.shifts, day].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
            return { ...member, shifts: newShifts };
        }));
    };

    const handleSave = async () => {
        setEditMode(false);
        // Dispatch updates for all modified staff members
        // In a real app we might batch this, but here we'll iterate
        for (const member of roster) {
            const original = staff.find(s => s.id === member.id);
            if (JSON.stringify(original.shifts) !== JSON.stringify(member.shifts)) {
                dispatch(updateStaff(member));
            }
        }
    };

    return (
        <div className="staff-directory">
            <div className="directory-header">
                <h3>Therapist Roster</h3>
                <button
                    className={`edit-mode-btn ${editMode ? 'active' : ''}`}
                    onClick={() => editMode ? handleSave() : setEditMode(true)}
                >
                    {editMode ? 'Save Changes' : 'Manage Shifts'}
                </button>
            </div>
            <div className="staff-grid">
                {(editMode ? roster : staff).map(member => (
                    <div key={member.id} className="staff-card">
                        <div className="staff-header">
                            <Avatar name={member.name} size="medium" />
                            <div className="staff-info">
                                <h4 className="staff-name">{member.name}</h4>
                                <span className="staff-role">{member.role}</span>
                            </div>
                        </div>
                        <div className="skills-section">
                            <span className="section-label">Skills:</span>
                            <div className="skills-list">
                                {member.skills.map((skill, i) => (
                                    <SkillBadge key={i} skill={skill} />
                                ))}
                            </div>
                        </div>
                        <div className="shifts-section">
                            <span className="section-label">Shifts:</span>
                            {editMode ? (
                                <div className="shifts-editor">
                                    {DAYS.map(day => (
                                        <button
                                            key={day}
                                            className={`day-toggle ${member.shifts.includes(day) ? 'selected' : ''}`}
                                            onClick={() => toggleDay(member.id, day)}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <span className="shift-text">
                                    {member.shifts.length > 0 ? member.shifts.join(', ') : 'No shifts assigned'}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffDirectory;
