import Skeleton from '../atoms/Skeleton';
import ReactECharts from 'echarts-for-react';
import './TherapyTrendChart.css';

const TherapyTrendChart = ({ dates, values, loading }) => {
    if (loading) {
        return (
            <div className="chart-container">
                <Skeleton width="40%" height="24px" className="mb-4" />
                <Skeleton width="100%" height="300px" />
            </div>
        );
    }

    const options = {
        grid: { top: 20, right: 30, bottom: 20, left: 40, containLabel: true },
        xAxis: {
            type: 'category',
            data: dates,
            axisLine: { lineStyle: { color: '#ccc' } },
            axisLabel: { color: '#6b7280' },
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: '#eee' } },
            axisLabel: { color: '#6b7280' },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#fff',
            borderColor: '#eee',
            textStyle: { color: '#333' },
        },
        series: [
            {
                data: values,
                type: 'line',
                smooth: true,
                symbolSize: 8,
                itemStyle: { color: '#4f46e5' },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(79, 70, 229, 0.3)' },
                            { offset: 1, color: 'rgba(79, 70, 229, 0.0)' },
                        ],
                    },
                },
            },
        ],
    };

    return (
        <div className="chart-container">
            <h3 className="section-title">Weekly Therapy Sessions</h3>
            <ReactECharts option={options} style={{ height: '300px', width: '100%' }} />
        </div>
    );
};

export default TherapyTrendChart;
