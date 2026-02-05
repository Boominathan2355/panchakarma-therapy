import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients, fetchPatientDetails } from '../../store/slices/patientSlice';
import { fetchTherapies } from '../../store/slices/therapySlice';
import PatientList from '../../components/organisms/PatientList';
import PatientProfileHeader from '../../components/organisms/PatientProfileHeader';
import MedicalHistory from '../../components/organisms/MedicalHistory';
import EligibilityTracker from '../../components/organisms/EligibilityTracker';
import AvailabilityManager from '../../components/organisms/AvailabilityManager';
import FeasibilityPanel from '../../components/organisms/FeasibilityPanel';
import Button from '../../components/atoms/Button';
import resourceService from '../../services/resourceService';
import './PatientPage.css';

const PatientPage = () => {
    const dispatch = useDispatch();
    const { patients, selectedPatient, isLoading } = useSelector((state) => state.patient);
    const { therapies } = useSelector((state) => state.therapy);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTherapyId, setSelectedTherapyId] = useState('');
    const [feasibility, setFeasibility] = useState(null);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        dispatch(fetchPatients());
        dispatch(fetchTherapies());
    }, [dispatch]);

    useEffect(() => {
        if (patients.length > 0 && !selectedPatient) {
            dispatch(fetchPatientDetails(patients[0].id));
        }
    }, [patients, selectedPatient, dispatch]);

    const handleSelectPatient = (id) => {
        dispatch(fetchPatientDetails(id));
        setShowAssignModal(false);
        setFeasibility(null);
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
            <div className="patient-sidebar-wrapper">
                <PatientList
                    patients={patients}
                    selectedId={selectedPatient?.id}
                    onSelect={handleSelectPatient}
                />
            </div>

            <div className="patient-content">
                {selectedPatient ? (
                    <>
                        <PatientProfileHeader patient={selectedPatient} />

                        <div className="assign-therapy-bar">
                            <Button variant="primary" onClick={() => setShowAssignModal(true)}>
                                Assign Therapy
                            </Button>
                        </div>

                        {showAssignModal && (
                            <div className="assign-modal-wrapper">
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
                                <MedicalHistory history={selectedPatient.history} />
                            </div>
                            <div className="grid-col">
                                <EligibilityTracker patientConditions={selectedPatient.conditions} />
                                <AvailabilityManager windows={selectedPatient.availability} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="loading-state">Loading patient details...</div>
                )}
            </div>
        </div>
    );
};

export default PatientPage;
