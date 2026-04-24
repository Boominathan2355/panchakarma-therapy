import React, { PropsWithChildren } from 'react';
import './AuthLayout.scss';

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="auth-layout">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
            
            <div className="auth-card-container">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;

