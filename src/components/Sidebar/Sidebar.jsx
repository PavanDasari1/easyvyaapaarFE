import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import './Sidebar.css';

const Sidebar = ({ onOpenAddModal }) => {
  const { t } = useLanguage();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-title">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">EasyVyaapaar</span>
        </div>
        <div className="logo-tagline">Speak • Add • Manage • Grow</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
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

        <NavLink to="/transactions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🕒</span>
          <span className="nav-label">{t('transactions')}</span>
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">Reports</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">{t('settings')}</span>
        </NavLink>
      </nav>

      <div className="sidebar-promo">
        <div className="promo-icon">🏪</div>
        <div className="promo-title">Manage your business smarter with EasyVyaapaar!</div>
        <button className="btn btn-promo" onClick={() => window.open('https://easyvyaapaar.com', '_blank')}>
          Learn More →
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
