import React from 'react';
import LoginForm from '../../components/organisms/LoginForm';
import AuthLayout from '../../components/templates/AuthLayout';

const LoginPage = () => {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
};

export default LoginPage;
