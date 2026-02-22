import Skeleton from '../atoms/Skeleton';
import './StatsCard.css';


const StatsCard = ({ title, value, description, icon: Icon, trend, loading }) => {
    if (loading) {
        return (
            <div className="stat-card">
                <div className="stat-header">
                    <Skeleton width="60%" height="20px" />
                    <Skeleton variant="circle" width="24px" height="24px" />
                </div>
                <div className="stat-content">
                    <Skeleton width="40%" height="32px" className="mb-2" />
                    <Skeleton width="80%" height="16px" />
                </div>
            </div>
        );
    }

    return (
        <div className="stat-card">
            <div className="stat-header">
                <h3 className="stat-title">{title}</h3>
                {Icon && <Icon className="stat-icon" size={20} />}
            </div>
            <div className="stat-content">
                <p className="stat-value">{value}</p>
                {description && <p className="stat-description">{description}</p>}
                {trend && (
                    <span className={`stat-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
