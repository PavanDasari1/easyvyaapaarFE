import { useLanguage } from '../../i18n';
import './Navbar.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { lang, setLang } = useLanguage();

  const handleLanguageChange = (e) => {
    setLang(e.target.value);
  };

  return (
    <header className="top-navbar">
      <div className="navbar-search">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search products... (e.g., rice, sugar, oil)"
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-shortcut">Ctrl + K</span>
      </div>

      <div className="navbar-actions">
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
          <div className="user-avatar">S</div>
          <span className="user-name">Shop Owner</span>
          <span className="dropdown-arrow">▾</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
