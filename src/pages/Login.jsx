import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('SHOP_KEEPER');
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleQuickDemoLogin = (roleToLogin) => {
    setSubmitting(true);
    setTimeout(() => {
      if (roleToLogin === 'SUPER_ADMIN') {
        login({
          id: 1,
          name: 'Dasari Pavan',
          email: 'admin@easyvyaapaar.com',
          mobile: '+91 9876543210',
          role: 'SUPER_ADMIN',
          shopName: 'All Shops System Access',
          status: 'ACTIVE'
        });
        navigate('/AdminDashboard');
      } else {
        login({
          id: 2,
          name: 'Ramesh Kumar',
          email: 'shopkeeper@easyvyaapaar.com',
          mobile: '+91 9876500111',
          role: 'SHOP_KEEPER',
          shopName: 'Sri Lakshmi Kirana & General Store',
          status: 'ACTIVE'
        });
        navigate('/ShopkeeperDashboard');
      }
      setSubmitting(false);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.emailOrMobile.trim()) {
      setErrorMsg('Please enter your Mobile number or Email address.');
      return;
    }
    if (!formData.password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    setTimeout(() => {
      const isDemoAdmin = formData.emailOrMobile.toLowerCase().includes('admin') || selectedRole === 'SUPER_ADMIN';
      const roleToSet = isDemoAdmin ? 'SUPER_ADMIN' : 'SHOP_KEEPER';

      login({
        id: isDemoAdmin ? 1 : 2,
        name: isDemoAdmin ? 'Dasari Pavan (Admin)' : 'Shop Owner',
        email: formData.emailOrMobile,
        mobile: '+91 9876543210',
        role: roleToSet,
        shopName: isDemoAdmin ? 'System Wide Access' : 'Sri Lakshmi Kirana Store',
        status: 'ACTIVE'
      });

      navigate(isDemoAdmin ? '/AdminDashboard' : '/ShopkeeperDashboard');
      setSubmitting(false);
    }, 400);
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

        {/* Role Toggle Selector */}
        <div className="login-role-tabs">
          <button 
            type="button" 
            className={`role-tab-btn ${selectedRole === 'SHOP_KEEPER' ? 'active-tab' : ''}`}
            onClick={() => setSelectedRole('SHOP_KEEPER')}
          >
            🏪 Shopkeeper
          </button>
          <button 
            type="button" 
            className={`role-tab-btn ${selectedRole === 'SUPER_ADMIN' ? 'active-tab' : ''}`}
            onClick={() => setSelectedRole('SUPER_ADMIN')}
          >
            👑 Admin
          </button>
        </div>

        {errorMsg && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Mobile Number or Email *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder={selectedRole === 'SUPER_ADMIN' ? 'admin@easyvyaapaar.com' : 'Enter mobile number or email'}
              value={formData.emailOrMobile}
              onChange={(e) => setFormData({ ...formData, emailOrMobile: e.target.value })}
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
            />
          </div>

          <div className="login-form-options">
            <label className="remember-me-label">
              <input type="checkbox" defaultChecked /> Remember Me
            </label>
            <a href="#forgot" className="forgot-password-link" onClick={(e) => { e.preventDefault(); alert('Password reset instructions sent to your registered mobile number via SMS.'); }}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={submitting}>
            {submitting ? 'Signing In...' : `Sign In as ${selectedRole === 'SUPER_ADMIN' ? 'Admin' : 'Shopkeeper'}`}
          </button>
        </form>

        {/* One-Click Instant Demo Login Buttons */}
        <div className="demo-login-section">
          <div className="demo-divider"><span>OR ONE-CLICK DEMO LOGIN</span></div>
          <div className="demo-buttons-grid">
            <button 
              type="button" 
              className="btn btn-secondary demo-btn shopkeeper-demo-btn"
              onClick={() => handleQuickDemoLogin('SHOP_KEEPER')}
            >
              🏪 Demo Shopkeeper
            </button>
            <button 
              type="button" 
              className="btn btn-secondary demo-btn admin-demo-btn"
              onClick={() => handleQuickDemoLogin('SUPER_ADMIN')}
            >
              👑 Demo Admin
            </button>
          </div>
        </div>

        {/* Footer Link to Signup */}
        <div className="login-footer">
          Don't have an account yet? <Link to="/signup" className="signup-link">Register New Shop</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
