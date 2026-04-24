import React from 'react';
import ReactECharts from 'echarts-for-react';
import Skeleton from '../atoms/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import Card from '../atoms/Card';
import './TherapyTrendChart.scss';

export interface TherapyTrendChartProps {
    dates: string[];
    values: number[];
    loading?: boolean;
}

const TherapyTrendChart: React.FC<TherapyTrendChartProps> = ({ dates, values, loading = false }) => {
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
        grid: { top: 20, right: 30, bottom: 20, left: 40, containLabel: true },
        xAxis: {
            type: 'category',
            data: dates,
            axisLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.1)' : '#ccc' } },
            axisLabel: { color: isDark ? '#94a3b8' : '#64748b' },
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.05)' : '#eee' } },
            axisLabel: { color: isDark ? '#94a3b8' : '#64748b' },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: isDark ? '#1e293b' : '#fff',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#eee',
            textStyle: { color: isDark ? '#f8fafc' : '#333' },
        },
        series: [
            {
                data: values,
                type: 'line',
                smooth: true,
                symbolSize: 8,
                itemStyle: { color: '#0070f3' },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 112, 243, 0.3)' },
                            { offset: 1, color: 'rgba(0, 112, 243, 0.0)' },
                        ],
                    },
                },
            },
        ],
    };
    return (
        <Card className="therapy-trend-card" title="Weekly Therapy Sessions" glass>
            <ReactECharts option={options} style={{ height: '300px', width: '100%' }} />
        </Card>
    );
};

export default TherapyTrendChart;
