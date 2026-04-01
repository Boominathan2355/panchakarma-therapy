import React from 'react';
import './SkillBadge.css';

export interface SkillBadgeProps {
    skill: string;
    className?: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, className = '' }) => {
    return (
        <span className={`skill-badge ${className}`}>
            {skill}
        </span>
    );
};

export default SkillBadge;
