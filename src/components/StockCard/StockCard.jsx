import { addStock, removeStock } from '../../services/inventoryService';
import './StockCard.css';

const StockCard = ({ product, onStockUpdated }) => {
  const isLow = product.currentStock <= product.minimumStock || product.lowStock;
  const shortage = isLow ? Math.max(0, (product.minimumStock || 0) - (product.currentStock || 0)) : 0;

  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    try {
      await addStock({
        productId: product.id,
        quantity: 1,
        unit: product.unit,
        source: 'MANUAL'
      });
      if (onStockUpdated) onStockUpdated();
    } catch (err) {
      alert(err.message || 'Failed to add stock');
    }
  };

  const handleQuickRemove = async (e) => {
    e.stopPropagation();
    try {
      await removeStock({
        productId: product.id,
        quantity: 1,
        unit: product.unit,
        source: 'MANUAL'
      });
      if (onStockUpdated) onStockUpdated();
    } catch (err) {
      alert(err.message || 'Failed to remove stock');
    }
  };

  return (
    <div className={`stock-card ${isLow ? 'card-shortage-alert' : ''}`}>
      {isLow && (
        <div className="shortage-banner">
          ⚠️ Shortage: {shortage % 1 === 0 ? shortage : shortage.toFixed(1)} {product.unit ? product.unit.toLowerCase() : ''} needed
        </div>
      )}

      <div className="card-top-row">
        <div className="stock-info">
          <h4 className="product-name">{product.name}</h4>
          <span className="product-category">{product.category || 'General'}</span>
        </div>
        {product.price && (
          <div className="product-price">
            ₹{product.price} <span className="price-unit">/{product.unit ? product.unit.toLowerCase() : ''}</span>
          </div>
        )}
      </div>

      <div className="card-bottom-row">
        <div className="stock-quantity-display">
          <span className="qty-val">{product.currentStock}</span>
          <span className="qty-lbl">{product.unit}</span>
        </div>

        <div className="quick-action-btns">
          <button 
            className="action-btn remove-btn"
            onClick={handleQuickRemove}
            disabled={product.currentStock <= 0}
            title={product.currentStock <= 0 ? "Out of stock" : "Remove 1 unit"}
          >
            -
          </button>
          <button 
            className="action-btn add-btn"
            onClick={handleQuickAdd}
            title="Add 1 unit"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
