import React from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import './ResourceGantt.css';

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

const ResourceGantt = ({ events, resources, onSelectEvent }) => {
    // We strictly use the "Day" view but with Resources to show the timeline
    // RBC has limited true Gantt support but "Day" view with resources columns works well for this

    const resourceMap = resources.map(r => ({ id: r.id, title: r.title }));

    return (
        <div className="gantt-container">
            <Calendar
                localizer={localizer}
                events={events}
                defaultView={Views.DAY}
                views={[Views.DAY, Views.WORK_WEEK]}
                step={30}
                timeslots={2}
                resources={resourceMap}
                resourceIdAccessor="id"
                resourceTitleAccessor="title"
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={onSelectEvent}
                min={new Date(0, 0, 0, 8, 0, 0)}
                max={new Date(0, 0, 0, 20, 0, 0)}
            />
        </div>
    );
};

export default ResourceGantt;
