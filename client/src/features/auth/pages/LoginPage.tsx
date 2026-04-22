import React from 'react';
import LoginForm from '../components/LoginForm';
import AuthLayout from '../components/AuthLayout';

const LoginPage: React.FC = () => {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
};

export default LoginPage;

