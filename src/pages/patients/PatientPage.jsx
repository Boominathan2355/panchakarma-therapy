import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPatients, fetchPatientDetails, clearSelectedPatient } from '../../store/slices/patientSlice';
import { fetchTherapies } from '../../store/slices/therapySlice';
import PatientList from '../../components/organisms/PatientList';
import PatientProfileHeader from '../../components/organisms/PatientProfileHeader';
import PatientStatsDashboard from '../../components/organisms/PatientStatsDashboard';
import MedicalHistory from '../../components/organisms/MedicalHistory';
import EligibilityTracker from '../../components/organisms/EligibilityTracker';
import AvailabilityManager from '../../components/organisms/AvailabilityManager';
import FeasibilityPanel from '../../components/organisms/FeasibilityPanel';
import Button from '../../components/atoms/Button';
import Skeleton from '../../components/atoms/Skeleton';
import resourceService from '../../services/resourceService';
import { ArrowLeft } from 'lucide-react';
import './PatientPage.css';

const PatientPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { patients, selectedPatient, isLoading, isListLoading, isDetailLoading } = useSelector((state) => state.patient);
    const { therapies } = useSelector((state) => state.therapy);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTherapyId, setSelectedTherapyId] = useState('');
    const [feasibility, setFeasibility] = useState(null);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        dispatch(fetchTherapies());
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(fetchPatientDetails(id));
        } else {
            dispatch(clearSelectedPatient());
            dispatch(fetchPatients()); // Re-fetch list when coming back
        }
    }, [id, dispatch]);

    const handleSelectPatient = (patientId) => {
        dispatch(clearSelectedPatient()); // Proactive clear
        navigate(`/patients/${patientId}`);
        setShowAssignModal(false);
        setFeasibility(null);
    };

    const handleBack = () => {
        dispatch(clearSelectedPatient()); // Proactive clear
        navigate('/patients');
    };

    const handleTherapySelect = async (e) => {
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
                        patients={patients}
                        onSelect={handleSelectPatient}
                        variant="grid"
                        isLoading={isListLoading}
                    />
                </div>
            ) : (
                <div className="patient-content full-width">
                    <div className="dashboard-navigation">
                        <button className="back-btn" onClick={handleBack}>
                            <ArrowLeft size={16} /> Back to Patients List
                        </button>
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
                                            therapy={selectedTherapyForPanel}
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
