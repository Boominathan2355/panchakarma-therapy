import React from 'react';
import './Card.scss';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
    glass?: boolean;
}

/**
 * Reusable Card container for a premium dashboard look.
 */
const Card: React.FC<CardProps> = ({ children, className = '', title, action, glass = false }) => {
    return (
        <div className={`card ${glass ? 'glass' : ''} ${className}`}>
            {(title || action) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {action && <div className="card-action">{action}</div>}
                </div>
            )}
            <div className="card-content">
                {children}
            </div>
        </div>
    );
};

export default Card;
