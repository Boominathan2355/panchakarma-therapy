import React, { PropsWithChildren } from 'react';
import './AuthLayout.css';

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="auth-layout">
            <div className="auth-card">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
