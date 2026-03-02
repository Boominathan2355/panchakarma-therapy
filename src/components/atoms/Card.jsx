import React from 'react';
import './Card.css';

/**
 * Reusable Card container for a premium dashboard look.
 * 
 * @param {React.ReactNode} children - Content of the card
 * @param {string} className - Additional CSS class
 * @param {string} title - Optional title
 * @param {React.ReactNode} action - Optional action (e.g., button) for the header
 */
const Card = ({ children, className = '', title, action }) => {
    return (
        <div className={`custom-card ${className}`}>
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
