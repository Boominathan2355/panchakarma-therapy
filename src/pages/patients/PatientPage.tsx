import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPatients, fetchPatientDetails, clearSelectedPatient } from '../../store/slices/patientSlice';
import { fetchTherapies } from '../../store/slices/therapySlice';
import { fetchSessions } from '../../store/slices/scheduleSlice';
// Organisms
import PatientList from '../../components/organisms/PatientList';
import PatientProfileHeader from '../../components/organisms/PatientProfileHeader';
import PatientStatsDashboard from '../../components/organisms/PatientStatsDashboard';
import MedicalHistory from '../../components/organisms/MedicalHistory';
import EligibilityTracker from '../../components/organisms/EligibilityTracker';
import AvailabilityManager from '../../components/organisms/AvailabilityManager';
import FeasibilityPanel, { FeasibilityData } from '../../components/organisms/FeasibilityPanel';
import Button from '../../components/atoms/Button';
import resourceService from '../../services/resourceService';
import { ChevronRight } from 'lucide-react';
import { Patient, TherapyType, TherapySession } from '../../types';
import './PatientPage.css';

const PatientPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    const { patients, selectedPatient, isListLoading, isDetailLoading } = useAppSelector((state) => state.patient);
    const { therapies } = useAppSelector((state) => state.therapy);
    const { sessions } = useAppSelector((state) => state.schedule);
    const { user } = useAppSelector((state) => state.auth);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTherapyId, setSelectedTherapyId] = useState('');
    const [feasibility, setFeasibility] = useState<FeasibilityData | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        dispatch(fetchTherapies());
        dispatch(fetchSessions());
    }, [dispatch]);

    const visiblePatients = useMemo(() => {
        if (user?.role?.toLowerCase() === 'physician') {
            const doctorPatientIds = new Set(
                sessions
                    .filter((s: TherapySession) => (s as any).therapistId === user.id)
                    .map((s: TherapySession) => (s as any).patientId)
            );
            return patients.filter(p => doctorPatientIds.has(p.id));
        }
        return patients;
    }, [patients, sessions, user]);

    useEffect(() => {
        if (id) {
            dispatch(fetchPatientDetails(id));
        } else {
            dispatch(clearSelectedPatient());
            dispatch(fetchPatients()); // Re-fetch list when coming back
        }
    }, [id, dispatch]);

    const handleSelectPatient = (patientId: string) => {
        dispatch(clearSelectedPatient()); // Proactive clear
        navigate(`/patients/${patientId}`);
        setShowAssignModal(false);
        setFeasibility(null);
    };

    const handleBack = () => {
        dispatch(clearSelectedPatient()); // Proactive clear
        navigate('/patients');
    };

    const handleTherapySelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const therapyId = e.target.value;
        setSelectedTherapyId(therapyId);
        if (therapyId) {
            setIsChecking(true);
            const result = await resourceService.checkFeasibility(therapyId);
            setFeasibility(result);
            setIsChecking(false);
        } else {
            setFeasibility(null);
        }
    };

    const selectedTherapyForPanel = therapies.find(t => t.id === selectedTherapyId);

    return (
        <div className="patient-page">
            {!id ? (
                <div className="management-dashboard-view">
                    <header className="page-header">
                        <h1 className="page-title">Patients Management</h1>
                    </header>
                    <PatientList
                        patients={visiblePatients}
                        onSelect={handleSelectPatient}
                        variant="grid"
                        isLoading={isListLoading}
                    />
                </div>
            ) : (
                <div className="patient-content full-width">
                    <div className="dashboard-navigation">
                        <div className="breadcrumb">
                            <span className="breadcrumb-item clickable" onClick={handleBack}>
                                Patients Management
                            </span>
                            <ChevronRight size={14} className="breadcrumb-separator" />
                            <span className="breadcrumb-item active">
                                {selectedPatient?.name || id}
                            </span>
                        </div>
                    </div>

                    {isDetailLoading || !selectedPatient ? (
                        <div className="nested-dashboard">
                            <PatientProfileHeader loading={true} />
                            <PatientStatsDashboard loading={true} />
                            <div className="patient-grid">
                                <div className="grid-col">
                                    <MedicalHistory loading={true} />
                                </div>
                                <div className="grid-col">
                                    <EligibilityTracker loading={true} />
                                    <AvailabilityManager loading={true} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="nested-dashboard">
                            <PatientProfileHeader patient={selectedPatient} />

                            <PatientStatsDashboard patient={selectedPatient} />

                            <div className="dashboard-actions">
                                <Button variant="primary" onClick={() => setShowAssignModal(true)}>
                                    Assign New Therapy
                                </Button>
                            </div>

                            {showAssignModal && (
                                <div className="assign-modal-wrapper card-container">
                                    <div className="therapy-selector">
                                        <label>Select Therapy Protocol:</label>
                                        <select value={selectedTherapyId} onChange={handleTherapySelect}>
                                            <option value="">-- Choose Therapy --</option>
                                            {therapies.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {isChecking && <p className="loading-text">Checking feasibility...</p>}

                                    {feasibility && selectedTherapyForPanel && (
                                        <FeasibilityPanel
                                            therapy={selectedTherapyForPanel as any}
                                            feasibility={feasibility}
                                            onCancel={() => {
                                                setShowAssignModal(false);
                                                setFeasibility(null);
                                                setSelectedTherapyId('');
                                            }}
                                            onProceed={() => {
                                                alert('Proceeding to schedule...');
                                                setShowAssignModal(false);
                                            }}
                                        />
                                    )}
                                </div>
                            )}

                            <div className="patient-grid">
                                <div className="grid-col">
                                    <MedicalHistory history={selectedPatient?.history || []} />
                                </div>
                                <div className="grid-col">
                                    <EligibilityTracker patientConditions={selectedPatient?.conditions || []} />
                                    <AvailabilityManager windows={selectedPatient?.availability || []} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PatientPage;
