import { useLanguage } from '../../i18n';
import './RecentActivity.css';

const RecentActivity = ({ transactions }) => {
  const { t } = useLanguage();

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <h3>{t('recent_activity')}</h3>
        <p className="no-data">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="activity-title">{t('recent_activity')}</h3>
      <div className="activity-list">
        {transactions.map(tx => (
          <div key={tx.id} className="activity-item">
            <div className={`activity-icon ${tx.operation === 'ADD' ? 'icon-add' : 'icon-remove'}`}>
              {tx.operation === 'ADD' ? '+' : '-'}
            </div>
            <div className="activity-details">
              <span className="activity-qty">
                {tx.operation === 'ADD' ? '+' : '-'}{tx.quantity} {tx.unit ? tx.unit.toLowerCase() : ''}
              </span>
              <span className="activity-product">{tx.productName}</span>
            </div>
            <div className="activity-source">
              {tx.source === 'VOICE' ? '🎤' : '⌨️'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
