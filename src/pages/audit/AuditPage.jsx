import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuditData } from '../../store/slices/auditSlice';
import AuditLogTable from '../../components/organisms/AuditLogTable';
import DecisionExplainer from '../../components/organisms/DecisionExplainer';
import './AuditPage.css';

const AuditPage = () => {
    const dispatch = useDispatch();
    const { logs, explanations, isLoading } = useSelector(state => state.audit);

    useEffect(() => {
        dispatch(fetchAuditData());
    }, [dispatch]);

    return (
        <div className="audit-page">
            <h2 className="audit-title">Audit & Explainability</h2>

            <div className="audit-grid">
                <div className="audit-col table-col">
                    {isLoading ? <div>Loading Logs...</div> : <AuditLogTable logs={logs} />}
                </div>

                <div className="audit-col explainer-col">
                    <h3 className="mb-4">Recent System Decisions</h3>
                    {explanations.map(e => (
                        <div key={e.id} className="mb-4">
                            <DecisionExplainer explanation={e} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuditPage;
