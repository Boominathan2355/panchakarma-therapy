import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, reset } from '../../store/slices/authSlice';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import FormField from '../molecules/FormField';
import Card from '../atoms/Card';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, isLoading, isError, isSuccess, message } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            setErrors({ submit: message });
        }

        if (isSuccess || user) {
            navigate('/dashboard');
        }

        return () => {
            dispatch(reset());
        };
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
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

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        dispatch(login(formData));
    };

    return (
        <Card className="login-form-card">
            <div className="login-header">
                <div className="logo-icon-wrapper">
                    <LogIn size={32} className="logo-icon" />
                </div>
                <h2>Welcome Back</h2>
                <p>Sign in to access the Panchakarma System</p>
            </div>

            <form onSubmit={onSubmit}>
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
                        />
                    </div>
                </FormField>

                {errors.submit && (
                    <div className="form-error-banner">
                        <AlertCircle size={18} />
                        <span>{errors.submit}</span>
                    </div>
                )}

                <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full mt-4"
                    isLoading={isLoading}
                >
                    Sign In
                </Button>
            </form>

            <div className="login-footer">
                <p>Forgot your password? <a href="/forgot-password">Contact Administration</a></p>
            </div>
        </Card>
    );
};

export default LoginForm;
