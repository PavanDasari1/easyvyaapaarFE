import { useState, useEffect } from 'react';
import { getAdminSummary } from '../../services/adminService';
import { getAllProducts } from '../../services/productService';
import { useLanguage } from '../../i18n';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopFilter, setShopFilter] = useState('ALL');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [sumRes, prodRes] = await Promise.all([
        getAdminSummary(),
        getAllProducts()
      ]);
      setSummary(sumRes.data || null);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.error('Failed to load admin summary', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading System Overview...</div>;

  const totalShops = summary?.totalShops || 1;
  const totalUsers = summary?.totalUsers || 2;
  const totalShopkeepers = summary?.totalShopkeepers || 1;
  const totalProducts = summary?.totalProducts || products.length;
  const lowStockCount = summary?.lowStockProducts || products.filter(p => p.currentStock <= p.minimumStock).length;
  const totalStockVal = summary?.totalStockValue || products.reduce((sum, p) => sum + ((p.currentStock || 0) * (p.price || 0)), 0);

  const filteredShops = (summary?.shops || []).filter(s => 
    shopFilter === 'ALL' || s.status === shopFilter
  );

  return (
    <div className="dashboard-container">
      {/* Admin Header */}
      <div className="greeting-header">
        <div className="greeting-left">
          <h2>👑 Super Admin Dashboard</h2>
          <p>System-wide overview across all registered shops, users, and inventory.</p>
        </div>
        <div className="greeting-right">
          <span className="today-date">System Status: Active 🟢</span>
          <span className="date-subtext">{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
        <div className="stat-card stat-card-green">
          <div className="stat-icon-wrap bg-light-green">🏪</div>
          <div className="stat-details">
            <span className="stat-title">Total Shops</span>
            <div className="stat-value">{totalShops}</div>
            <span className="stat-subtext">{summary?.activeShops || 3} Active Stores</span>
          </div>
        </div>

        <div className="stat-card stat-card-blue">
          <div className="stat-icon-wrap bg-light-blue">👥</div>
          <div className="stat-details">
            <span className="stat-title">Total Users</span>
            <div className="stat-value">{totalUsers}</div>
            <span className="stat-subtext">Registered accounts</span>
          </div>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-icon-wrap bg-light-purple">🧑‍🌾</div>
          <div className="stat-details">
            <span className="stat-title">Shopkeepers</span>
            <div className="stat-value">{totalShopkeepers}</div>
            <span className="stat-subtext">Active store managers</span>
          </div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-icon-wrap bg-light-green">📦</div>
          <div className="stat-details">
            <span className="stat-title">Total Products</span>
            <div className="stat-value">{totalProducts}</div>
            <span className="stat-subtext">Catalog SKUs</span>
          </div>
        </div>

        <div className="stat-card stat-card-orange">
          <div className="stat-icon-wrap bg-light-orange">⚠️</div>
          <div className="stat-details">
            <span className="stat-title">Low Stock Items</span>
            <div className="stat-value text-orange">{lowStockCount}</div>
            <span className="stat-subtext">Shortage alerts</span>
          </div>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-icon-wrap bg-light-purple">₹</div>
          <div className="stat-details">
            <span className="stat-title">Today's Sales</span>
            <div className="stat-value">₹ {(summary?.todaySales || 0).toLocaleString('en-IN')}</div>
            <span className="stat-subtext">System-wide sales</span>
          </div>
        </div>
      </div>

      {/* System & Inventory Overview Row */}
      <div className="dashboard-main-grid" style={{ marginTop: '1.5rem' }}>
        <div className="main-stock-column">
          {/* Shop Overview Section */}
          <div className="card stock-section-card">
            <div className="section-header-bar">
              <div className="section-title">
                <span className="title-icon">🏪</span>
                <div>
                  <h3>Registered Shops Overview</h3>
                  <p className="subtitle">Real-time status of all stores</p>
                </div>
              </div>

              <div className="section-controls">
                <select 
                  className="category-filter-select"
                  value={shopFilter}
                  onChange={(e) => setShopFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="table-responsive" style={{ marginTop: '1rem' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Shop Name</th>
                    <th>Owner</th>
                    <th>Shopkeeper</th>
                    <th>Active Products</th>
                    <th>Stock Value</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShops.map(shop => (
                    <tr key={shop.id}>
                      <td>
                        <strong>{shop.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>📍 {shop.location}</div>
                      </td>
                      <td>{shop.ownerName}</td>
                      <td>{shop.shopkeeperName}</td>
                      <td><strong>{shop.activeProducts}</strong> items</td>
                      <td>₹ {shop.totalStockValue ? shop.totalStockValue.toLocaleString('en-IN') : '0'}</td>
                      <td>
                        <span className={`badge ${shop.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                          {shop.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginRight: '0.3rem' }}>
                          👁️ View
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginRight: '0.3rem' }}>
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="side-panel-column">
          <div className="card">
            <h3>📊 Sales Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #16a34a' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Today's System Sales</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a' }}>₹ {(summary?.todaySales || 0).toLocaleString('en-IN')}</div>
              </div>
              <div style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Weekly Sales</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>₹ {(summary?.weeklySales || 0).toLocaleString('en-IN')}</div>
              </div>
              <div style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #9333ea' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Monthly Sales</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#9333ea' }}>₹ {(summary?.monthlySales || 0).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>🛡️ Security & Role Rules</h3>
            <ul style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
              <li>Shopkeepers can only view their own assigned store stock.</li>
              <li>Ordinary users cannot elevate themselves to Super Admin.</li>
              <li>Only Super Admins can disable accounts or reassign shops.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
