import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login, findUserByCredentials } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputStr = formData.emailOrMobile.trim();
    const passStr = formData.password.trim();

    if (!inputStr) {
      setErrorMsg('Please enter your Mobile number or Email address.');
      return;
    }
    if (!passStr) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    setTimeout(() => {
      // 1. Look up user in registered database strictly by credentials
      const matchedUser = findUserByCredentials(inputStr, passStr);

      if (matchedUser) {
        if (matchedUser.status === 'DISABLED') {
          setErrorMsg('This account has been disabled by the System Admin.');
          setSubmitting(false);
          return;
        }
        login(matchedUser);
        navigate(matchedUser.role === 'SUPER_ADMIN' ? '/AdminDashboard' : '/ShopkeeperDashboard');
      } else {
        // 2. Strict System Admin Credential Check
        const isAdminEmail = inputStr.toLowerCase() === 'admin@easyvyaapaar.com' || inputStr === '9876543210';
        const isAdminPass = passStr === 'Admin@123';

        if (isAdminEmail && isAdminPass) {
          login({
            id: 1,
            name: 'Dasari Pavan (Admin)',
            email: 'admin@easyvyaapaar.com',
            mobile: '+91 9876543210',
            role: 'SUPER_ADMIN',
            shopName: 'System Administration',
            status: 'ACTIVE'
          });
          navigate('/AdminDashboard');
        } else {
          setErrorMsg('Invalid login credentials! Please check your Mobile Number / Email and Password.');
        }
      }

      setSubmitting(false);
    }, 300);
  };

  return (
    <div className="login-page-container">
      <div className="login-card-wrapper card">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="brand-logo-icon">🛍️</div>
          <h1 className="brand-title">EasyVyaapaar</h1>
          <p className="brand-tagline">Speak Your Business. Manage Your Stock.</p>
        </div>

        {errorMsg && <div className="alert alert-danger" style={{ marginBottom: '1rem', fontSize: '0.82rem' }}>{errorMsg}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Mobile Number or Email Address *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. 9876543210 or admin@easyvyaapaar.com"
              value={formData.emailOrMobile}
              onChange={(e) => setFormData({ ...formData, emailOrMobile: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input 
              type="password" 
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="login-form-options">
            <label className="remember-me-label">
              <input type="checkbox" defaultChecked /> Remember Me
            </label>
            <a href="#forgot" className="forgot-password-link" onClick={(e) => { e.preventDefault(); alert('Password reset SMS sent to registered number.'); }}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={submitting}>
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Prominent Demo Accounts & Quick Sign-In Section */}
        <div className="demo-login-section">
          <div className="demo-divider">
            <span>DEMO LOGIN ACCOUNTS</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem', textAlign: 'center' }}>
            Click any button below to instantly populate credentials & test the live UI:
          </p>
          <div className="demo-buttons-grid">
            <button 
              type="button" 
              className="btn demo-btn shopkeeper-demo-btn"
              onClick={() => {
                setFormData({ emailOrMobile: 'shopkeeper@easyvyaapaar.com', password: 'Shopkeeper@123' });
                login({
                  id: 2,
                  name: 'Ramesh Kumar',
                  email: 'shopkeeper@easyvyaapaar.com',
                  mobile: '9123456789',
                  role: 'SHOP_KEEPER',
                  shopName: 'Sri Lakshmi Kirana & General Store',
                  status: 'ACTIVE'
                });
                navigate('/ShopkeeperDashboard');
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.65rem 0.4rem', cursor: 'pointer', textAlign: 'center' }}
            >
              <strong style={{ fontSize: '0.88rem' }}>🏪 Demo Shopkeeper</strong>
              <span style={{ fontSize: '0.72rem', color: '#15803d', marginTop: '0.2rem' }}>shopkeeper@easyvyaapaar.com</span>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Pass: Shopkeeper@123</span>
            </button>

            <button 
              type="button" 
              className="btn demo-btn admin-demo-btn"
              onClick={() => {
                setFormData({ emailOrMobile: 'admin@easyvyaapaar.com', password: 'Admin@123' });
                login({
                  id: 1,
                  name: 'Dasari Pavan (Admin)',
                  email: 'admin@easyvyaapaar.com',
                  mobile: '+91 9876543210',
                  role: 'SUPER_ADMIN',
                  shopName: 'System Administration',
                  status: 'ACTIVE'
                });
                navigate('/AdminDashboard');
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.65rem 0.4rem', cursor: 'pointer', textAlign: 'center' }}
            >
              <strong style={{ fontSize: '0.88rem' }}>👑 Demo Admin</strong>
              <span style={{ fontSize: '0.72rem', color: '#1d4ed8', marginTop: '0.2rem' }}>admin@easyvyaapaar.com</span>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Pass: Admin@123</span>
            </button>
          </div>
        </div>

        {/* Footer Link to Signup */}
        <div className="login-footer">
          Don't have a shop account yet? <Link to="/signup" className="signup-link">Register New Shop</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
