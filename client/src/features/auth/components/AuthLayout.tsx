import React, { PropsWithChildren } from 'react';
import './AuthLayout.scss';

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="auth-layout">
            <div className="auth-card-container">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;

