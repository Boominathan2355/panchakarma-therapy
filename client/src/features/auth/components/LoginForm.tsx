import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../index';
import Button from '../../../components/atoms/Button';
import Input from '../../../components/atoms/Input';
import FormField from '../../../components/molecules/FormField';
import Card from '../../../components/atoms/Card';
import { LogIn, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import './LoginForm.scss';

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const navigate = useNavigate();
    const { login, isLoading, isError, message, user, reset } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }

        return () => {
            reset();
        };
    }, [user, navigate, reset]);


    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        if (errors[e.target.name]) {
            const newErrors = { ...errors };
            delete newErrors[e.target.name];
            setErrors(newErrors);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            await login(formData);
        } catch (err) {
            // Error is handled in context
        }
    };

    return (
        <Card className="login-form-card">
            <div className="login-header">
                <div className="logo-icon-wrapper">
                    <LogIn size={32} />
                </div>
                <h2>Welcome Back</h2>
                <p>Sign in to access the Panchakarma System</p>
            </div>

            <form onSubmit={onSubmit} aria-labelledby="login-form">
                <FormField 
                    label="Username" 
                    id="username" 
                    error={errors.username}
                >
                    <div className="input-with-icon">
                        <User size={18} className="input-icon" />
                        <Input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={onChange}
                            placeholder="Enter your username"
                            autoComplete="username"
                            aria-required="true"
                            className={errors.username ? 'error' : ''}
                        />
                    </div>
                </FormField>

                <FormField 
                    label="Password" 
                    id="password" 
                    error={errors.password}
                >
                    <div className="input-with-icon">
                        <Lock size={18} className="input-icon" />
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={onChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            aria-required="true"
                            className={errors.password ? 'error' : ''}
                        />
                    </div>
                </FormField>

                {isError && (
                    <div className="form-error-banner" role="alert">
                        <AlertCircle size={18} />
                        <span>{message}</span>
                    </div>
                )}

                <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full mt-4"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Signing In...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </Button>
            </form>

            <div className="login-footer">
                <p>
                    Forgot your password? <a href="/forgot-password">Contact Administration</a>
                </p>
            </div>
        </Card>
    );
};

export default LoginForm;

