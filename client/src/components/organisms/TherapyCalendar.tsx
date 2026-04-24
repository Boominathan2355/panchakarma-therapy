import React, { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './TherapyCalendar.scss';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    status: 'scheduled' | 'completed' | 'cancelled';
    type?: string;
    patientId?: string;
    therapistId?: string;
    resourceId?: string;
}

export interface TherapyCalendarProps {
    events: CalendarEvent[];
    onEventDrop: (args: { event: any; start: string | Date; end: string | Date; isAllDay?: boolean }) => void;
    onSelectEvent?: (event: CalendarEvent) => void;
    resources?: any[];
}

const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar as any);

const TherapyCalendar: React.FC<TherapyCalendarProps> = ({ 
    events, 
    onEventDrop, 
    onSelectEvent, 
    resources 
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<View>(Views.DAY);

    const handleNavigate = useCallback((newDate: Date) => {
        setCurrentDate(newDate);
    }, []);

    const handleViewChange = useCallback((newView: View) => {
        setCurrentView(newView);
    }, []);

    const eventPropGetter = (event: CalendarEvent) => {
        let className = 'calendar-event';
        if (event.status === 'completed') className += ' event-completed';
        if (event.status === 'scheduled') className += ' event-scheduled';
        if (event.type === 'Vamana') className += ' type-vamana';

        return { className };
    };

    return (
        <div className="calendar-container">
            <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onEventDrop={onEventDrop as any}
                onSelectEvent={onSelectEvent as any}
                resizable
                style={{ height: 'calc(100vh - 160px)' }}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                view={currentView}
                date={currentDate}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                eventPropGetter={eventPropGetter}
                min={new Date(0, 0, 0, 8, 0, 0)}
                max={new Date(0, 0, 0, 20, 0, 0)}
            />
        </div>
    );
};

export default TherapyCalendar;
