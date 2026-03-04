import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import Skeleton from '../atoms/Skeleton';
import './UpcomingSchedule.css';

const UpcomingSchedule = ({ sessions, loading }) => {
    if (loading) {
        return (
            <Card className="upcoming-schedule-card h-full">
                <h3 className="section-title mb-4">Upcoming Schedule</h3>
                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} width="100%" height="70px" borderRadius="12px" />
                    ))}
                </div>
            </Card>
        );
    }

    if (!sessions || sessions.length === 0) {
        return (
            <Card className="upcoming-schedule-card h-full flex flex-col justify-center items-center p-8 text-center text-muted">
                <Calendar size={48} className="mb-4 text-gray-300" />
                <h4>No upcoming sessions for today</h4>
                <p>You have a free schedule! Take some time to review patient charts.</p>
            </Card>
        );
    }

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'success';
            case 'scheduled': return 'primary';
            case 'in progress': return 'warning';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <Card className="upcoming-schedule-card h-full">
            <h3 className="section-title mb-4">Upcoming Schedule</h3>
            <div className="schedule-list">
                {sessions.map((session) => {
                    const start = new Date(session.start);
                    const end = new Date(session.end);
                    const timeString = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    const dateString = start.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

                    return (
                        <div key={session.id} className="schedule-item">
                            <div className="schedule-time">
                                <span className="time-primary">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="time-secondary">{dateString}</span>
                            </div>
                            <div className="schedule-details">
                                <h4 className="patient-name">{session.title}</h4>
                                <div className="schedule-meta">
                                    <span className="meta-item"><Clock size={14} /> {timeString}</span>
                                    <Badge variant={getStatusVariant(session.status)}>{session.status}</Badge>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default UpcomingSchedule;
