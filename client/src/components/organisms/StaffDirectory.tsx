import React, { useState, useEffect } from 'react';
import { useUpdateStaff } from '../../hooks/useResources';
import Avatar from '../atoms/Avatar';
import SkillBadge from '../molecules/SkillBadge';
import './StaffDirectory.scss';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export interface Staff {
    id: string;
    name: string;
    role: string;
    skills: string[];
    shifts: string[];
}

export interface StaffDirectoryProps {
    staff: Staff[];
}

const StaffDirectory: React.FC<StaffDirectoryProps> = ({ staff }) => {
    const { mutate: performUpdate } = useUpdateStaff();
    const [editMode, setEditMode] = useState(false);
    const [roster, setRoster] = useState<Staff[]>(Array.isArray(staff) ? staff : []);

    useEffect(() => {
        if (Array.isArray(staff)) {
            setRoster(staff);
        }
    }, [staff]);

    const toggleDay = (staffId: string, day: string) => {
        if (!Array.isArray(roster)) return;
        setRoster(prev => Array.isArray(prev) ? prev.map(member => {
            if (member.id !== staffId) return member;
            const hasShift = member.shifts.includes(day);
            const newShifts = hasShift
                ? member.shifts.filter(d => d !== day)
                : [...member.shifts, day].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
            return { ...member, shifts: newShifts };
        }) : prev);
    };

    const handleSave = async () => {
        setEditMode(false);
        if (!Array.isArray(roster) || !Array.isArray(staff)) return;
        
        for (const member of roster) {
            const original = staff.find(s => s.id === member.id);
            if (original && Array.isArray(original.shifts) && Array.isArray(member.shifts) && 
                JSON.stringify(original.shifts) !== JSON.stringify(member.shifts)) {
                performUpdate(member);
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
                {Array.isArray(editMode ? roster : staff) && (editMode ? roster : staff).map(member => (
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
                                {Array.isArray(member.skills) && member.skills.map((skill, i) => (
                                    <SkillBadge key={i} skill={skill} />
                                ))}
                            </div>
                        </div>
                        <div className="shifts-section">
                            <span className="section-label">Shifts:</span>
                            {editMode ? (
                                <div className="shifts-editor">
                                    {Array.isArray(DAYS) && DAYS.map(day => (
                                        <button
                                            key={day}
                                            className={`day-toggle ${Array.isArray(member.shifts) && member.shifts.includes(day) ? 'selected' : ''}`}
                                            onClick={() => toggleDay(member.id, day)}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <span className="shift-text">
                                    {Array.isArray(member.shifts) && member.shifts.length > 0 ? member.shifts.join(', ') : 'No shifts assigned'}
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
