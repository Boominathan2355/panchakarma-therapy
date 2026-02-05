import React from 'react';
import ReactECharts from 'echarts-for-react';
import './UtilizationChart.css';

const UtilizationChart = ({ data }) => {
    if (!data) return null;

    const options = {
        title: { text: null },
        tooltip: { trigger: 'axis' },
        legend: { data: ['Room Occupancy', 'Staff Utilization'], bottom: 0 },
        grid: { top: 20, left: '3%', right: '4%', bottom: 30, containLabel: true },
        xAxis: { type: 'category', data: data.dates },
        yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
        series: [
            {
                name: 'Room Occupancy',
                type: 'bar',
                data: data.rooms,
                color: '#4f46e5'
            },
            {
                name: 'Staff Utilization',
                type: 'line',
                data: data.staff,
                smooth: true,
                color: '#10b981',
                lineStyle: { width: 3 }
            }
        ]
    };

    return (
        <div className="utilization-card">
            <h3 className="section-title">Resource Utilization</h3>
            <ReactECharts option={options} style={{ height: '300px' }} />
        </div>
    );
};

export default UtilizationChart;
