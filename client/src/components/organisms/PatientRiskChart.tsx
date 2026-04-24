import React from 'react';
import ReactECharts from 'echarts-for-react';
import Skeleton from '../atoms/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import Card from '../atoms/Card';
import './PatientRiskChart.scss';

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
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (loading) {
        return (
            <div className="chart-container">
                <Skeleton width="40%" height="24px" className="mb-4" />
                <Skeleton width="100%" height="300px" />
            </div>
        );
    }

    const options = {
        backgroundColor: 'transparent',
        grid: { top: 40, right: 30, bottom: 20, left: 40, containLabel: true },
        tooltip: {
            trigger: 'axis',
            backgroundColor: isDark ? '#1e293b' : '#fff',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#eee',
            textStyle: { color: isDark ? '#f8fafc' : '#333' },
            axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } }
        },
        legend: {
            data: ['Emergency', 'High Risk', 'Medium Risk', 'Low Risk'],
            top: 0,
            textStyle: { color: isDark ? '#94a3b8' : '#64748b' }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: dates,
                axisLabel: { color: isDark ? '#94a3b8' : '#64748b' },
                axisLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.1)' : '#ccc' } }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: { color: isDark ? '#94a3b8' : '#64748b' },
                splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.05)' : '#eee' } }
            }
        ],
        series: [
            {
                name: 'Emergency',
                type: 'line',
                stack: 'Total',
                areaStyle: { opacity: 0.3 },
                emphasis: { focus: 'series' },
                itemStyle: { color: '#ef4444' },
                data: emergency
            },
            {
                name: 'High Risk',
                type: 'line',
                stack: 'Total',
                areaStyle: { opacity: 0.3 },
                emphasis: { focus: 'series' },
                itemStyle: { color: '#f97316' },
                data: high
            },
            {
                name: 'Medium Risk',
                type: 'line',
                stack: 'Total',
                areaStyle: { opacity: 0.3 },
                emphasis: { focus: 'series' },
                itemStyle: { color: '#eab308' },
                data: medium
            },
            {
                name: 'Low Risk',
                type: 'line',
                stack: 'Total',
                areaStyle: { opacity: 0.3 },
                emphasis: { focus: 'series' },
                itemStyle: { color: '#22c55e' },
                data: low
            }
        ]
    };

    return (
        <Card className="risk-trend-card" title="Patient Risk Trends" glass>
            <ReactECharts option={options} style={{ height: '300px', width: '100%' }} />
        </Card>
    );
};

export default PatientRiskChart;
