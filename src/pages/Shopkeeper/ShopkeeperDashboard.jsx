import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import { getRecentTransactions, addStock } from '../../services/inventoryService';
import { confirmVoiceCommand } from '../../services/voiceService';
import { useAuth } from '../../context/AuthContext';
import VoiceMic from '../../components/VoiceMic/VoiceMic';
import CommandConfirmModal from '../../components/CommandConfirmModal/CommandConfirmModal';
import StockCard from '../../components/StockCard/StockCard';
import './ShopkeeperDashboard.css';

const ShopkeeperDashboard = ({ searchQuery = '' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [parsedCommand, setParsedCommand] = useState(null);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showRecordSaleModal, setShowRecordSaleModal] = useState(false);

  const [saleForm, setSaleForm] = useState({
    productId: '',
    quantity: 1,
    amount: '',
    paymentStatus: 'PAID'
  });

  const loadShopkeeperData = async () => {
    try {
      const [prodRes, txRes] = await Promise.all([
        getAllProducts(),
        getRecentTransactions()
      ]);
      setProducts(prodRes.data || []);
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShopkeeperData();
    const interval = setInterval(() => {
      loadShopkeeperData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCommandParsed = (parsed) => {
    setParsedCommand(parsed);
    setAssistantMessage('');
  };

  const handleAssistantResponse = (text) => {
    setAssistantMessage(text);
    setParsedCommand(null);
    setTimeout(() => setAssistantMessage(''), 10000);
  };

  const handleConfirmCommand = async (commandToExecute) => {
    try {
      await confirmVoiceCommand(commandToExecute);
      setParsedCommand(null);
      loadShopkeeperData();
    } catch (err) {
      alert(err.message || 'Failed to update stock');
    }
  };

  const handleRecordSale = async (e) => {
    e.preventDefault();
    if (!saleForm.productId) {
      alert('Please select a product');
      return;
    }
    try {
      const selectedProd = products.find(p => p.id === Number(saleForm.productId));
      await addStock({
        productId: Number(saleForm.productId),
        quantity: parseFloat(saleForm.quantity) || 1,
        unit: selectedProd ? selectedProd.unit : 'PIECE',
        price: saleForm.amount ? parseFloat(saleForm.amount) : null,
        source: 'MANUAL',
        notes: `Recorded Sale (${saleForm.paymentStatus})`
      });
      setShowRecordSaleModal(false);
      setSaleForm({ productId: '', quantity: 1, amount: '', paymentStatus: 'PAID' });
      loadShopkeeperData();
    } catch (err) {
      alert(err.message || 'Failed to record sale');
    }
  };

  if (loading) return <div className="loading-spinner">Loading Shopkeeper Dashboard...</div>;

  // Stat Calculations
  const totalProducts = products.length;
  const availableStockCount = products.filter(p => p.currentStock > 0).length;
  const lowStockItems = products.filter(p => p.currentStock <= p.minimumStock && p.currentStock > 0);
  const outOfStockItems = products.filter(p => p.currentStock <= 0);
  const todaySalesVal = transactions
    .filter(t => t.operation === 'REMOVE')
    .reduce((sum, t) => sum + ((t.quantity || 0) * (t.price || 50)), 0);
  const todayOrdersCount = transactions.length;

  const effectiveSearch = searchQuery.toLowerCase().trim();
  const filteredProducts = products.filter(p => 
    !effectiveSearch || p.name.toLowerCase().includes(effectiveSearch)
  );

  return (
    <div className="dashboard-container">
      {/* Shopkeeper Greeting Header */}
      <div className="greeting-header">
        <div className="greeting-left">
          <h2>🏪 {user.shopName || 'Sri Lakshmi Kirana Store'}</h2>
          <p>Managed by <strong>{user.name}</strong> • Real-time Store Management</p>
        </div>
        <div className="greeting-right">
          <span className="today-date">{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <span className="date-subtext">Shopkeeper Mode Active 🟢</span>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="stat-cards-grid">
        <div className="stat-card stat-card-green">
          <div className="stat-icon-wrap bg-light-green">📦</div>
          <div className="stat-details">
            <span className="stat-title">Total Products</span>
            <div className="stat-value">{totalProducts}</div>
            <span className="stat-subtext">Catalog SKUs</span>
          </div>
        </div>

        <div className="stat-card stat-card-blue">
          <div className="stat-icon-wrap bg-light-blue">📋</div>
          <div className="stat-details">
            <span className="stat-title">Available Stock</span>
            <div className="stat-value">{availableStockCount}</div>
            <span className="stat-subtext">In-stock items</span>
          </div>
        </div>

        <div className="stat-card stat-card-orange">
          <div className="stat-icon-wrap bg-light-orange">⚠️</div>
          <div className="stat-details">
            <span className="stat-title">Low Stock</span>
            <div className="stat-value text-orange">{lowStockItems.length}</div>
            <span className="stat-subtext">Needs reorder</span>
          </div>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-icon-wrap bg-light-purple">🚫</div>
          <div className="stat-details">
            <span className="stat-title">Out of Stock</span>
            <div className="stat-value" style={{ color: '#ef4444' }}>{outOfStockItems.length}</div>
            <span className="stat-subtext">Urgent action</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Toolbar */}
      <div className="card quick-actions-bar" style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>⚡</span>
          <strong>Quick Actions:</strong>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            + Add Product
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/ShopkeeperInventory')}>
            + Add Stock
          </button>
          <button className="btn btn-secondary" onClick={() => setShowRecordSaleModal(true)} style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
            💰 Record Sale
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/ShopkeeperInventory')}>
            👁️ View Inventory
          </button>
        </div>
      </div>

      {/* Voice Mic Banner */}
      <VoiceMic 
        onCommandParsed={handleCommandParsed}
        onAssistantResponse={handleAssistantResponse}
      />

      {/* Assistant Voice Message Popup */}
      {assistantMessage && (
        <div className="assistant-popup card">
          <span className="assistant-avatar">🤖</span>
          <span className="assistant-content">{assistantMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {parsedCommand && (
        <CommandConfirmModal 
          parsedCommand={parsedCommand}
          onConfirm={handleConfirmCommand}
          onCancel={() => setParsedCommand(null)}
        />
      )}

      {/* Workspace Grid */}
      <div className="dashboard-main-grid">
        {/* Left Column: Product Cards */}
        <div className="main-stock-column">
          <div className="card stock-section-card">
            <div className="section-header-bar">
              <div className="section-title">
                <span className="title-icon">📦</span>
                <div>
                  <h3>Current Shop Inventory</h3>
                  <p className="subtitle">Real-time product stock level</p>
                </div>
              </div>
            </div>

            <div className="stock-cards-grid">
              {filteredProducts.map(product => (
                <StockCard key={product.id} product={product} onStockUpdated={loadShopkeeperData} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="side-panel-column">
          {/* Low Stock Alert Box */}
          <div className="card low-stock-alert-card">
            <div className="panel-header">
              <div className="panel-title">
                <span className="alert-icon-wrap">⚠️</span>
                <h3>Low Stock Items</h3>
              </div>
              <button className="copy-whatsapp-btn" onClick={() => navigate('/ShopkeeperInventory')}>
                View All →
              </button>
            </div>

            <div className="shortage-alert-list" style={{ marginTop: '0.75rem' }}>
              {lowStockItems.slice(0, 4).map(item => (
                <div key={item.id} className="shortage-alert-item" style={{ padding: '0.6rem 0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{item.name}</strong>
                    <span className="shortage-pill" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                      {item.currentStock} {item.unit ? item.unit.toLowerCase() : ''} remaining
                    </span>
                  </div>
                </div>
              ))}
              {lowStockItems.length === 0 && (
                <p className="no-data" style={{ padding: '1rem 0' }}>All products have sufficient stock!</p>
              )}
            </div>
          </div>

          {/* Recent Sales Table */}
          <div className="card">
            <h3 className="activity-title">🛒 Recent Sales & Transactions</h3>
            <div className="table-responsive" style={{ marginTop: '0.75rem' }}>
              <table className="table" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map(tx => (
                    <tr key={tx.id}>
                      <td><strong>{tx.productName}</strong></td>
                      <td>{tx.quantity} {tx.unit ? tx.unit.toLowerCase() : ''}</td>
                      <td>
                        <span className={`badge ${tx.operation === 'ADD' ? 'badge-success' : 'badge-danger'}`}>
                          {tx.operation}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Paid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Record Sale Modal */}
      {showRecordSaleModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '450px' }}>
            <h3>💰 Record Shop Sale</h3>
            <form onSubmit={handleRecordSale} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Select Product *</label>
                <select 
                  className="form-control"
                  value={saleForm.productId}
                  onChange={(e) => setSaleForm({ ...saleForm, productId: e.target.value })}
                  required
                >
                  <option value="">-- Select Item --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.currentStock} {p.unit})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity Sold *</label>
                <input 
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={saleForm.quantity}
                  onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sale Amount (₹)</label>
                <input 
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="Optional total sale price"
                  value={saleForm.amount}
                  onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRecordSaleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopkeeperDashboard;
