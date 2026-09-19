import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { lang, setLang } = useLanguage();
  const { role, setRole, isSuperAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    setLang(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-navbar">
      <div className="navbar-search">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search catalog or system... (e.g., rice, sugar, oil)"
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-shortcut">Ctrl + K</span>
      </div>

      <div className="navbar-actions">
        {/* Role Selector Badge */}
        <div className="role-selector-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: isSuperAdmin ? '#eff6ff' : '#f0fdf4', padding: '0.35rem 0.65rem', borderRadius: '8px', border: isSuperAdmin ? '1px solid #bfdbfe' : '1px solid #bbf7d0' }}>
          <span style={{ fontSize: '0.85rem' }}>{isSuperAdmin ? '👑' : '🏪'}</span>
          <select 
            value={role} 
            onChange={handleRoleChange}
            style={{ border: 'none', background: 'transparent', fontSize: '0.82rem', fontWeight: '600', color: isSuperAdmin ? '#1e40af' : '#166534', cursor: 'pointer', outline: 'none' }}
          >
            <option value="SUPER_ADMIN">Admin View</option>
            <option value="SHOP_KEEPER">Shopkeeper View</option>
          </select>
        </div>

        <div className="lang-dropdown-wrapper">
          <span className="globe-icon">🌐</span>
          <select 
            className="navbar-lang-select" 
            value={lang} 
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="te">తెలుగు</option>
            <option value="hi">हिंदी</option>
            <option value="ta">தமிழ்</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="ml">മലയാളം</option>
          </select>
        </div>

        <button className="icon-btn notification-btn" title="Notifications">
          🔔
          <span className="notification-badge">1</span>
        </button>

        <div className="user-profile">
          <div className="user-avatar" style={{ background: isSuperAdmin ? '#2563eb' : '#16a34a' }}>
            {isSuperAdmin ? 'A' : 'S'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="user-name">{isSuperAdmin ? 'System Admin' : user.name || 'Shopkeeper'}</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{isSuperAdmin ? 'All Shops Access' : user.shopName || 'Kirana Shop'}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          title="Sign Out"
          style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
        >
          🚪 Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
