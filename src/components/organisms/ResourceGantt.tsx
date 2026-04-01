import React from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './ResourceGantt.css';

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

export interface GanttResource {
    id: string;
    title: string;
}

export interface GanttEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resourceId: string;
    status?: 'scheduled' | 'occupied' | 'maintenance';
}

export interface ResourceGanttProps {
    events: GanttEvent[];
    resources: GanttResource[];
    onSelectEvent?: (event: GanttEvent) => void;
}

const ResourceGantt: React.FC<ResourceGanttProps> = ({ events, resources, onSelectEvent }) => {
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
                onSelectEvent={onSelectEvent as any}
                min={new Date(0, 0, 0, 8, 0, 0)}
                max={new Date(0, 0, 0, 20, 0, 0)}
            />
        </div>
    );
};

export default ResourceGantt;
