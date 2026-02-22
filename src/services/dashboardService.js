// Mock data for the dashboard module

const getKPIs = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                totalSessions: 42,
                activePatients: 18,
                todaysRevenue: 12500, // INR
                occupancyRate: 85, // Percent
            });
        }, 800);
    });
};

const getTherapyTrends = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                values: [12, 19, 15, 25, 22, 30, 18],
            });
        }, 1000);
    });
};

const getAvailability = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                therapists: [
                    { id: 1, name: 'Dr. Arya', status: 'Available', specialty: 'Vamana' },
                    { id: 2, name: 'Dr. Rahul', status: 'Busy', specialty: 'Basti' },
                    { id: 3, name: 'Dr. Priya', status: 'Available', specialty: 'Nasya' },
                    { id: 4, name: 'Dr. Amit', status: 'On Leave', specialty: 'General' },
                ],
                rooms: [
                    { id: 101, name: 'Room A (Vamana)', status: 'Occupied' },
                    { id: 102, name: 'Room B (Basti)', status: 'Available' },
                    { id: 103, name: 'Room C (Shirodhara)', status: 'Maintenance' },
                    { id: 104, name: 'Room D (General)', status: 'Occupied' },
                ]
            });
        }, 600);
    });
};

const getAlerts = async () => {
    return new Promise((resolve) => {
        resolve([
            { id: 1, type: 'warning', message: 'Low inventory: Herbal Oil Type B', time: '10 mins ago' },
            { id: 2, type: 'info', message: 'New patient registration: John Doe', time: '1 hour ago' },
            { id: 3, type: 'error', message: 'Room C Maintenance Overdue', time: '2 hours ago' },
            { id: 4, type: 'success', message: 'Dr. Arya completed Vamana session', time: '3 hours ago' },
        ]);
    });
};

const getNotifications = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, type: 'info', title: 'Appointment Warning', message: 'You have 3 appointments starting in 15 mins', time: '5 mins ago', read: false },
                { id: 2, type: 'warning', title: 'Low Stock', message: 'Dhanwantharam Thailam stock is below 10%', time: '20 mins ago', read: false },
                { id: 3, type: 'success', title: 'Report Ready', message: 'Patient Arjun\'s discharge summary is ready', time: '1 hour ago', read: true },
                { id: 4, type: 'error', title: 'System Error', message: 'Automated backup failed last night', time: '3 hours ago', read: false },
            ]);
        }, 500);
    });
};

const dashboardService = {
    getKPIs,
    getTherapyTrends,
    getAvailability,
    getAlerts,
    getNotifications
};

export default dashboardService;
