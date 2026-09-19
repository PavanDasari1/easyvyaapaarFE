import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { lang, setLang } = useLanguage();
  const { isSuperAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    setLang(e.target.value);
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
        {/* Read-Only Role Badge */}
        <div className="role-selector-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: isSuperAdmin ? '#eff6ff' : '#f0fdf4', padding: '0.35rem 0.65rem', borderRadius: '8px', border: isSuperAdmin ? '1px solid #bfdbfe' : '1px solid #bbf7d0' }}>
          <span style={{ fontSize: '0.85rem' }}>{isSuperAdmin ? '👑' : '🏪'}</span>
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: isSuperAdmin ? '#1e40af' : '#166534' }}>
            {isSuperAdmin ? 'System Admin' : 'Shopkeeper'}
          </span>
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

        <div className="user-profile" title={user.name || 'User Profile'}>
          <div className="user-avatar" style={{ background: isSuperAdmin ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'linear-gradient(135deg, #16a34a, #15803d)' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : (isSuperAdmin ? 'A' : 'S')}
          </div>
          <div className="user-info-text">
            <span className="user-name-text">{isSuperAdmin ? 'System Admin' : (user.name || 'Shopkeeper')}</span>
            <span className="user-role-subtext">{isSuperAdmin ? 'All Shops Access' : (user.shopName || 'Store Manager')}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="navbar-logout-btn"
          title="Sign Out"
        >
          🚪 Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
