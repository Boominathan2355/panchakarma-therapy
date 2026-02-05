import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../../store/slices/authSlice';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import { AlertCircle } from 'lucide-react';
import './LoginForm.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, error, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isAuthenticated || user) {
            navigate('/dashboard');
        }

        return () => {
            dispatch(reset());
        };
    }, [user, isAuthenticated, error, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <form onSubmit={onSubmit} className="login-form">
            <div className="form-header">
                <h1>Welcome back</h1>
                <p>Enter your credentials to access your account</p>
            </div>

            {error && (
                <div className="alert alert-error" role="alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <div className="form-content space-y-4">
                <FormField
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={onChange}
                    required
                />
                <FormField
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={onChange}
                    required
                />
            </div>

            <Button
                type="submit"
                variant="primary"
                size="large"
                className="width-100"
                isLoading={isLoading}
            >
                Sign In
            </Button>

            <div className="form-footer">
                <p>Use <b>admin@example.com</b> / <b>password</b> to test</p>
            </div>
        </form>
    );
};

export default LoginForm;
