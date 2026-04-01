import React from 'react';
import AppRoutes from './routes/AppRoutes';
import './App.css';

const App: React.FC = () => {
    return (
        <div className="app-container">
            <AppRoutes />
        </div>
    );
};

export default App;
