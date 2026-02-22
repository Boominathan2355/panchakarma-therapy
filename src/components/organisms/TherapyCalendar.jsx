import React, { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './TherapyCalendar.css';

const locales = {
    'en-US': import('date-fns/locale/en-US'),
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const DnDCalendar = withDragAndDrop(Calendar);

const TherapyCalendar = ({ events, onEventDrop, onSelectEvent, resources }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState(Views.WEEK);

    const handleNavigate = useCallback((newDate) => {
        setCurrentDate(newDate);
    }, []);

    const handleViewChange = useCallback((newView) => {
        setCurrentView(newView);
    }, []);

    // Style events based on status
    const eventPropGetter = (event) => {
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
                onEventDrop={onEventDrop}
                onSelectEvent={onSelectEvent}
                resizable
                style={{ height: 'calc(100vh - 160px)' }}
                views={['month', 'week', 'day', 'agenda']}
                view={currentView}
                date={currentDate}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                eventPropGetter={eventPropGetter}
                min={new Date(0, 0, 0, 8, 0, 0)} // Start at 8 AM
                max={new Date(0, 0, 0, 20, 0, 0)} // End at 8 PM
            />
        </div>
    );
};

export default TherapyCalendar;
