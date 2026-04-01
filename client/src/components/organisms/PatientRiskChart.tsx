import React from 'react';
import ReactECharts from 'echarts-for-react';
import Skeleton from '../atoms/Skeleton';
import './PatientRiskChart.css';

export interface PatientRiskChartProps {
    dates: string[];
    high: number[];
    medium: number[];
    low: number[];
    emergency: number[];
    loading?: boolean;
}

const PatientRiskChart: React.FC<PatientRiskChartProps> = ({ 
    dates, 
    high, 
    medium, 
    low, 
    emergency, 
    loading = false 
}) => {
    if (loading) {
        return (
            <div className="chart-container">
                <Skeleton width="40%" height="24px" className="mb-4" />
                <Skeleton width="100%" height="300px" />
            </div>
        );
    }

    const options = {
        grid: { top: 40, right: 30, bottom: 20, left: 40, containLabel: true },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } }
        },
        legend: {
            data: ['Emergency', 'High Risk', 'Medium Risk', 'Low Risk'],
            top: 0
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: dates,
                axisLabel: { color: '#6b7280' },
                axisLine: { lineStyle: { color: '#ccc' } }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: { color: '#6b7280' },
                splitLine: { lineStyle: { color: '#eee' } }
            }
        ],
        series: [
            {
                name: 'Emergency',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: { focus: 'series' },
                itemStyle: { color: '#ef4444' }, // Red
                data: emergency
            },
            {
                name: 'High Risk',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: { focus: 'series' },
                itemStyle: { color: '#f97316' }, // Orange
                data: high
            },
            {
                name: 'Medium Risk',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: { focus: 'series' },
                itemStyle: { color: '#eab308' }, // Yellow
                data: medium
            },
            {
                name: 'Low Risk',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: { focus: 'series' },
                itemStyle: { color: '#22c55e' }, // Green
                data: low
            }
        ]
    };

    return (
        <div className="chart-container">
            <h3 className="section-title">Patient Risk Trends</h3>
            <ReactECharts option={options} style={{ height: '300px', width: '100%' }} />
        </div>
    );
};

export default PatientRiskChart;
