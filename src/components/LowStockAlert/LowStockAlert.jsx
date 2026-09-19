import { useLanguage } from '../../i18n';
import './LowStockAlert.css';

const LowStockAlert = ({ products, onRestockClick }) => {
  const { t } = useLanguage();

  // Filter items running low (currentStock <= minimumStock)
  const lowStockItems = (products || [])
    .filter(p => p.currentStock <= p.minimumStock || p.lowStock)
    .map(p => {
      const shortage = Math.max(0, (p.minimumStock || 0) - (p.currentStock || 0));
      const percentage = p.minimumStock > 0 
        ? Math.min(100, Math.round((p.currentStock / p.minimumStock) * 100))
        : 0;
      return { ...p, shortage, percentage };
    })
    // Sort by shortage amount descending (highest shortage needed at the top!)
    .sort((a, b) => b.shortage - a.shortage);

  const copySupplierOrderList = () => {
    if (lowStockItems.length === 0) return;
    const lines = lowStockItems.map((item, idx) => 
      `${idx + 1}. ${item.name}: ${item.shortage % 1 === 0 ? item.shortage : item.shortage.toFixed(1)} ${item.unit || ''}`
    );
    const orderText = `🛒 *Stock Re-Order List (EasyVyaapaar)*\nDate: ${new Date().toLocaleDateString()}\n\n` + lines.join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(orderText);
      alert('📋 Reorder list copied to clipboard! You can paste it directly into WhatsApp to send to your supplier.');
    } else {
      alert('Order List:\n\n' + orderText);
    }
  };

  return (
    <div className="card low-stock-alert-card">
      <div className="panel-header">
        <div className="panel-title">
          <span className="alert-icon-wrap">⚠️</span>
          <h3>Low Stock Alerts</h3>
        </div>
        {lowStockItems.length > 0 && (
          <button className="copy-whatsapp-btn" onClick={copySupplierOrderList} title="Copy WhatsApp order list">
            📋 Copy Order
          </button>
        )}
      </div>

      {lowStockItems.length === 0 ? (
        <div className="empty-alert-state">
          <div className="empty-box-icon">📦</div>
          <h4>No low stock items</h4>
          <p>You're all set!</p>
        </div>
      ) : (
        <div className="shortage-alert-list">
          {lowStockItems.map(item => (
            <div key={item.id} className="shortage-alert-item">
              <div className="alert-item-header">
                <div className="item-title-group">
                  <span className="item-name">{item.name}</span>
                  <span className="item-cat">{item.category || 'General'}</span>
                </div>
                <div className="shortage-pill">
                  Need {item.shortage % 1 === 0 ? item.shortage : item.shortage.toFixed(1)} {item.unit ? item.unit.toLowerCase() : ''}
                </div>
              </div>

              <div className="progress-bar-container">
                <div 
                  className={`progress-bar-fill ${item.percentage < 30 ? 'critical' : 'warning'}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <div className="alert-item-footer">
                <span className="stock-ratio">
                  Stock: <strong>{item.currentStock}</strong> / {item.minimumStock} {item.unit ? item.unit.toLowerCase() : ''}
                </span>
                <button 
                  className="btn-restock"
                  onClick={() => onRestockClick && onRestockClick(item)}
                >
                  + Restock
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;
