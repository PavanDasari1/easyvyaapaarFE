import { useLanguage } from '../i18n';

const Settings = () => {
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="card">
      <h2>{t('settings')}</h2>
      
      <div className="form-group" style={{ maxWidth: '400px', marginTop: '20px' }}>
        <label className="form-label">Application Language</label>
        <select 
          className="form-control"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="te">Telugu (తెలుగు)</option>
          <option value="hi">Hindi (हिंदी)</option>
          <option value="ta">Tamil (தமிழ்)</option>
          <option value="kn">Kannada (ಕನ್ನಡ)</option>
          <option value="ml">Malayalam (മലയാളം)</option>
        </select>
        <p style={{ marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>
          This changes the interface text and the expected language for voice recognition.
        </p>
      </div>
    </div>
  );
};

export default Settings;
