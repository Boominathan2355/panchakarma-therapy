// src/services/dashboardService.ts

export interface DashboardKPIs {
  totalSessions: number;
  activePatients: number;
  todaysRevenue: number;
  occupancyRate: number;
}

export interface TherapyTrendData {
  dates: string[];
  values: number[];
}

export interface AvailabilityData {
  therapists: { id: number; name: string; status: string; specialty: string }[];
  rooms: { id: string; name: string; status: string }[];
}

export interface DashboardAlert {
  id: number;
  type: 'warning' | 'info' | 'error' | 'success';
  message: string;
  time: string;
}

export interface Notification {
  id: number;
  type: 'warning' | 'info' | 'error' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface RiskTrendData {
  dates: string[];
  high: number[];
  medium: number[];
  low: number[];
  emergency: number[];
}

// Mock data for the dashboard module

const getKPIs = async (): Promise<DashboardKPIs> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                totalSessions: 100,
                activePatients: 78,
                todaysRevenue: 34500,
                occupancyRate: 82,
            });
        }, 800);
    });
};

const getTherapyTrends = async (): Promise<TherapyTrendData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const dates: string[] = [];
            const values: number[] = [];
            const today = new Date();

            for (let i = 29; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

                // Add some randomness to values, simulating 10-40 sessions
                const randomValue = Math.floor(Math.random() * 30) + 10;
                values.push(randomValue);
            }

            resolve({ dates, values });
        }, 1000);
    });
};

const getAvailability = async (): Promise<AvailabilityData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                therapists: [
                    { id: 1, name: 'Dr. Arya Sharma', status: 'Available', specialty: 'Vamana' },
                    { id: 3, name: 'Dr. Rahul Verma', status: 'Busy', specialty: 'Basti' },
                    { id: 4, name: 'Dr. Priya Nair', status: 'Available', specialty: 'Nasya' },
                    { id: 5, name: 'Dr. Amit Patel', status: 'On Leave', specialty: 'General' },
                ],
                rooms: [
                    { id: 'room1', name: 'Room A (Vamana)', status: 'Occupied' },
                    { id: 'room2', name: 'Room B (Basti)', status: 'Available' },
                    { id: 'room3', name: 'Room C (Shirodhara)', status: 'Maintenance' },
                    { id: 'room4', name: 'Room D (General)', status: 'Occupied' },
                ]
            });
        }, 600);
    });
};

const getAlerts = async (): Promise<DashboardAlert[]> => {
    return new Promise((resolve) => {
        resolve([
            { id: 1, type: 'warning', message: 'Low inventory: Mahanarayan Oil — 5 bottles remaining', time: '10 mins ago' },
            { id: 2, type: 'info', message: 'New patient registration: Nandini Saxena', time: '1 hour ago' },
            { id: 3, type: 'error', message: 'Room C (Shirodhara) — Maintenance Overdue', time: '2 hours ago' },
            { id: 4, type: 'success', message: 'Dr. Arya Sharma completed Vamana session with Ramesh Gupta', time: '3 hours ago' },
        ]);
    });
};

const getNotifications = async (role: string): Promise<Notification[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (role?.toLowerCase() === 'physician') {
                resolve([
                    { id: 1, type: 'warning', title: 'Upcoming Session', message: 'Vamana session with Ramesh Gupta starts in 15 mins', time: '5 mins ago', read: false },
                    { id: 2, type: 'error', title: 'Emergency Patient', message: 'Patient Arjun Das (Arthritis) marked as Emergency — immediate review needed', time: '12 mins ago', read: false },
                    { id: 3, type: 'info', title: 'Lab Results Ready', message: 'Blood work results for Sita Verma are now available', time: '30 mins ago', read: false },
                    { id: 4, type: 'success', title: 'Session Completed', message: 'Virechana session with Priya Sharma marked as completed', time: '1 hour ago', read: true },
                    { id: 5, type: 'warning', title: 'Patient Follow-Up', message: 'Kavita Singh requires follow-up consultation — pending 2 days', time: '2 hours ago', read: false },
                    { id: 6, type: 'info', title: 'Schedule Update', message: 'Basti session for Deepak Kumar rescheduled to 3:00 PM tomorrow', time: '3 hours ago', read: true },
                    { id: 7, type: 'warning', title: 'Contraindication Alert', message: 'New condition (Hypertension) flagged for patient Mohan Chauhan — review therapy plan', time: '4 hours ago', read: false },
                    { id: 8, type: 'success', title: 'Discharge Ready', message: 'Patient Meera Reddy has completed full Panchakarma protocol — discharge summary pending', time: '5 ago', read: true },
                ] as Notification[]);
            } else {
                resolve([
                    { id: 1, type: 'info', title: 'Appointment Warning', message: 'You have 3 appointments starting in 15 mins', time: '5 mins ago', read: false },
                    { id: 2, type: 'warning', title: 'Low Stock', message: 'Dhanwantharam Thailam stock is below 10%', time: '20 mins ago', read: false },
                    { id: 3, type: 'success', title: 'Report Ready', message: "Patient Arjun's discharge summary is ready", time: '1 hour ago', read: true },
                    { id: 4, type: 'error', title: 'System Error', message: 'Automated backup failed last night', time: '3 hours ago', read: false },
                    { id: 5, type: 'info', title: 'New Patient', message: '5 new patient registrations today', time: '4 hours ago', read: true },
                    { id: 6, type: 'warning', title: 'Room Maintenance', message: 'Therapy Room B scheduled for maintenance tomorrow', time: '5 hours ago', read: false },
                ] as Notification[]);
            }
        }, 500);
    });
};

const getPatientRiskTrends = async (): Promise<RiskTrendData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const dates: string[] = [];
            const high: number[] = [];
            const medium: number[] = [];
            const low: number[] = [];
            const emergency: number[] = [];
            const today = new Date();

            for (let i = 29; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

                high.push(Math.floor(Math.random() * 8) + 2);
                medium.push(Math.floor(Math.random() * 15) + 5);
                low.push(Math.floor(Math.random() * 20) + 10);
                emergency.push(Math.floor(Math.random() * 3));
            }

            resolve({ dates, high, medium, low, emergency });
        }, 1000);
    });
};

const dashboardService = {
    getKPIs,
    getTherapyTrends,
    getPatientRiskTrends,
    getAvailability,
    getAlerts,
    getNotifications
};

export default dashboardService;
