import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ onOpenAddModal }) => {
  const { t } = useLanguage();
  const { isSuperAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-title">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">EasyVyaapaar</span>
        </div>
        <div className="logo-tagline">
          {isSuperAdmin ? '👑 System Administration' : 'Speak • Add • Manage • Grow'}
        </div>
      </div>

      <nav className="sidebar-nav">
        {isSuperAdmin ? (
          /* ================= ADMIN SIDEBAR NAV ================= */
          <>
            <NavLink to="/AdminDashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">📊</span>
              <span className="nav-label">Admin Dashboard</span>
            </NavLink>

            <NavLink to="/AdminUsers" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">👥</span>
              <span className="nav-label">Users & Roles</span>
            </NavLink>

            <NavLink to="/AdminShops" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">🏪</span>
              <span className="nav-label">Shops</span>
            </NavLink>

            <NavLink to="/products" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">📦</span>
              <span className="nav-label">System Products</span>
            </NavLink>

            <NavLink to="/transactions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">🕒</span>
              <span className="nav-label">Audit History</span>
            </NavLink>

            <NavLink to="/AdminReports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">📈</span>
              <span className="nav-label">System Reports</span>
            </NavLink>

            <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">{t('settings')}</span>
            </NavLink>
          </>
        ) : (
          /* ================= SHOPKEEPER SIDEBAR NAV ================= */
          <>
            <NavLink to="/ShopkeeperDashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">🏠</span>
              <span className="nav-label">{t('dashboard')}</span>
            </NavLink>

            <NavLink to="/products" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">📦</span>
              <span className="nav-label">{t('products')}</span>
            </NavLink>

            <button className="sidebar-link sidebar-btn" onClick={onOpenAddModal}>
              <span className="nav-icon">➕</span>
              <span className="nav-label">{t('add_product') || 'Add Product'}</span>
            </button>

            <NavLink to="/ShopkeeperInventory" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">📋</span>
              <span className="nav-label">Inventory Status</span>
            </NavLink>

            <NavLink to="/ShopkeeperSales" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">💰</span>
              <span className="nav-label">Sales Log</span>
            </NavLink>

            <NavLink to="/transactions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">🕒</span>
              <span className="nav-label">{t('transactions')}</span>
            </NavLink>

            <NavLink to="/ShopkeeperReports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">📊</span>
              <span className="nav-label">Shop Reports</span>
            </NavLink>

            <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">{t('settings')}</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-promo">
        <div className="promo-icon">{isSuperAdmin ? '🛡️' : '🏪'}</div>
        <div className="promo-title">
          {isSuperAdmin ? 'Super Admin Control Center' : 'Manage your shop smarter with EasyVyaapaar!'}
        </div>
        <button className="btn btn-promo" onClick={() => window.open('https://easyvyaapaar.com', '_blank')}>
          {isSuperAdmin ? 'System Status →' : 'Learn More →'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
