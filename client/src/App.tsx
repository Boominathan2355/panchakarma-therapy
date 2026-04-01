import React from 'react';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <div className="app-container">
                <AppRoutes />
            </div>
        </ErrorBoundary>
    );
};

export default App;
