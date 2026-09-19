import { useState } from 'react';
import { useLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { t, lang, setLang } = useLanguage();
  const { user, updateUserProfile } = useAuth();

  const [shopName, setShopName] = useState(user.shopName || 'Sri Lakshmi Kirana & General Store');
  const [ownerName, setOwnerName] = useState(user.name || 'Shopkeeper Owner');
  const [mobile, setMobile] = useState(user.mobile || '9876543210');
  const [saveMsg, setSaveMsg] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: ownerName.trim(),
      shopName: shopName.trim(),
      mobile: mobile.trim()
    });
    setSaveMsg('✅ Store settings updated successfully!');
    setTimeout(() => setSaveMsg(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '650px' }}>
      {/* Header */}
      <div className="card">
        <h2>⚙️ Shop & System Settings</h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Configure language preferences and store profile</p>
      </div>

      {/* Language Preference Card */}
      <div className="card">
        <h3>🌐 Application & Voice Language</h3>
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label className="form-label">Voice & UI Language</label>
          <select 
            className="form-control"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">English (India)</option>
            <option value="te">Telugu (తెలుగు)</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="kn">Kannada (కನ್ನಡ)</option>
            <option value="ml">Malayalam (മലയാളം)</option>
          </select>
          <p style={{ marginTop: '0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
            Controls the interface language and voice recognition dialect for stock entry.
          </p>
        </div>
      </div>

      {/* Shopkeeper Profile Card */}
      <div className="card">
        <h3>🏪 Store Profile Settings</h3>
        {saveMsg && <div className="alert alert-success" style={{ margin: '0.75rem 0', fontSize: '0.82rem' }}>{saveMsg}</div>}

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Store / Shop Name *</label>
            <input 
              type="text" 
              className="form-control"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Owner Name *</label>
            <input 
              type="text" 
              className="form-control"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <input 
              type="text" 
              className="form-control"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            💾 Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
