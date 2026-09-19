import { useState, useEffect } from 'react';
import { getAllProducts, createProduct } from '../services/productService';
import { getRecentTransactions } from '../services/inventoryService';
import { confirmVoiceCommand } from '../services/voiceService';
import { useLanguage } from '../i18n';
import VoiceMic from '../components/VoiceMic/VoiceMic';
import CommandConfirmModal from '../components/CommandConfirmModal/CommandConfirmModal';
import StockCard from '../components/StockCard/StockCard';
import LowStockAlert from '../components/LowStockAlert/LowStockAlert';
import RecentActivity from '../components/RecentActivity/RecentActivity';
import './Dashboard.css';

const Dashboard = ({ searchQuery = '' }) => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [parsedCommand, setParsedCommand] = useState(null);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Filters & Modal
  const [stockSearch, setStockSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTip, setShowTip] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'General',
    unit: 'KG',
    currentStock: 0,
    minimumStock: 5,
    price: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      const [prodRes, txRes] = await Promise.all([
        getAllProducts(),
        getRecentTransactions()
      ]);
      setProducts(prodRes.data || []);
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 10000); // 10s real-time sync
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
      loadData();
    } catch (err) {
      console.error('Confirm failed', err);
      alert(err.message || 'Failed to update stock');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name.trim()) {
      setErrorMsg('Product name is required');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      await createProduct({
        name: newProduct.name.trim(),
        category: newProduct.category || 'General',
        unit: newProduct.unit.toUpperCase(),
        currentStock: parseFloat(newProduct.currentStock) || 0,
        minimumStock: parseFloat(newProduct.minimumStock) || 0,
        price: newProduct.price ? parseFloat(newProduct.price) : null
      });
      setShowAddModal(false);
      setNewProduct({ name: '', category: 'General', unit: 'KG', currentStock: 0, minimumStock: 5, price: '' });
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestockClick = (item) => {
    setParsedCommand({
      product: item.name,
      quantity: item.shortage || 5,
      unit: item.unit,
      operation: 'ADD',
      parsed: true,
      originalText: `Restock ${item.name}`
    });
  };

  // Calculations for Stat Cards
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.currentStock > 0).length;
  const lowStockProducts = products.filter(p => p.currentStock <= p.minimumStock || p.lowStock);
  const lowStockCount = lowStockProducts.length;

  const totalStockValue = products.reduce((sum, p) => {
    const price = p.price || 0;
    const stock = p.currentStock || 0;
    return sum + (stock * price);
  }, 0);

  // Categories list
  const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filtering products for current stock grid
  const effectiveSearch = (searchQuery || stockSearch).toLowerCase().trim();
  const filteredProducts = products.filter(p => {
    const matchesSearch = !effectiveSearch || p.name.toLowerCase().includes(effectiveSearch);
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Time & Greeting
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good Morning!' : hour < 18 ? 'Good Afternoon!' : 'Good Evening!';

  if (loading) return <div className="loading-spinner">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* Greeting Header */}
      <div className="greeting-header">
        <div className="greeting-left">
          <h2>{greeting} 👋</h2>
          <p>Here's what's happening with your store today.</p>
        </div>
        <div className="greeting-right">
          <span className="today-date">{dateStr}</span>
          <span className="date-subtext">Keep your stock updated!</span>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="stat-cards-grid">
        <div className="stat-card stat-card-green">
          <div className="stat-icon-wrap bg-light-green">📦</div>
          <div className="stat-details">
            <span className="stat-title">Total Products</span>
            <div className="stat-value">{totalProducts}</div>
            <span className="stat-subtext">Catalog products</span>
          </div>
        </div>

        <div className="stat-card stat-card-blue">
          <div className="stat-icon-wrap bg-light-blue">📋</div>
          <div className="stat-details">
            <span className="stat-title">In Stock</span>
            <div className="stat-value">{inStockCount}</div>
            <span className="stat-subtext">Products available</span>
          </div>
        </div>

        <div className="stat-card stat-card-orange">
          <div className="stat-icon-wrap bg-light-orange">⚠️</div>
          <div className="stat-details">
            <span className="stat-title">Low Stock</span>
            <div className="stat-value text-orange">{lowStockCount}</div>
            <span className="stat-subtext">Needs attention</span>
          </div>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-icon-wrap bg-light-purple">₹</div>
          <div className="stat-details">
            <span className="stat-title">Total Stock Value</span>
            <div className="stat-value">₹ {totalStockValue.toLocaleString('en-IN')}</div>
            <span className="stat-subtext">Across all products</span>
          </div>
        </div>
      </div>

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

      {/* Voice Mic Section */}
      <VoiceMic 
        onCommandParsed={handleCommandParsed} 
        onAssistantResponse={handleAssistantResponse}
      />

      {/* Main Workspace Layout (Current Stock Grid + Right Side Panel) */}
      <div className="dashboard-main-grid">
        {/* Left Column: Current Stock */}
        <div className="main-stock-column">
          <div className="card stock-section-card">
            <div className="section-header-bar">
              <div className="section-title">
                <span className="title-icon">📦</span>
                <div>
                  <h3>Current Stock</h3>
                  <p className="subtitle">Your product inventory</p>
                </div>
              </div>

              <div className="section-controls">
                <input 
                  type="text" 
                  className="stock-search-input"
                  placeholder="Search in stock..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                />

                <select 
                  className="category-filter-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="ALL">All Categories</option>
                  {categories.filter(c => c !== 'ALL').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <button 
                  className="btn btn-primary add-product-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  + Add Product
                </button>
              </div>
            </div>

            <div className="stock-cards-grid">
              {filteredProducts.map(product => (
                <StockCard key={product.id} product={product} onStockUpdated={loadData} />
              ))}
              {filteredProducts.length === 0 && (
                <div className="empty-products-view">
                  <div className="empty-box-graphic">📦</div>
                  <h4>No products found</h4>
                  <p>Start by adding your first product</p>
                  <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    + Add Your First Product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="side-panel-column">
          <RecentActivity transactions={transactions} />

          <LowStockAlert products={products} onRestockClick={handleRestockClick} />

          {showTip && (
            <div className="card tip-card">
              <div className="tip-header">
                <span>💡</span> <strong>Tip of the Day</strong>
                <button className="close-tip-btn" onClick={() => setShowTip(false)}>×</button>
              </div>
              <p className="tip-text">
                Keep your stock updated regularly to avoid shortages and never miss a sale!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '500px' }}>
            <h3>➕ Add New Product</h3>
            
            {errorMsg && <div className="alert alert-danger" style={{ margin: '1rem 0' }}>{errorMsg}</div>}

            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label className="form-label">{t('product_name')} *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="name" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Rice, Sugar, Almonds"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('category')}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="category" 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  placeholder="e.g. Grains, Pulses, Dairy"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('unit')} *</label>
                <select 
                  className="form-control" 
                  name="unit" 
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                >
                  <option value="BAG">BAG (బస్తా)</option>
                  <option value="KG">KG (కేజీ)</option>
                  <option value="GRAM">GRAM (గ్రాము)</option>
                  <option value="LITRE">LITRE (లీటరు)</option>
                  <option value="ML">ML (మిల్లీ)</option>
                  <option value="PACKET">PACKET (ప్యాకెట్)</option>
                  <option value="PIECE">PIECE (పీస్)</option>
                  <option value="CARTON">CARTON (కార్టన్)</option>
                  <option value="BOX">BOX (బాక్స్)</option>
                  <option value="DOZEN">DOZEN (డజను)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('current_stock')}</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-control" 
                    name="currentStock" 
                    value={newProduct.currentStock}
                    onChange={(e) => setNewProduct({ ...newProduct, currentStock: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('min_stock')}</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-control" 
                    name="minimumStock" 
                    value={newProduct.minimumStock}
                    onChange={(e) => setNewProduct({ ...newProduct, minimumStock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  name="price" 
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Optional price per unit"
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
