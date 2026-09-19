import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login, findUserByCredentials } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('SHOP_KEEPER');
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
      // Look up user in registered database
      const matchedUser = findUserByCredentials(inputStr, passStr, selectedRole);

      if (matchedUser) {
        if (matchedUser.status === 'DISABLED') {
          setErrorMsg('This account has been disabled by the System Admin.');
          setSubmitting(false);
          return;
        }
        login(matchedUser);
        navigate(matchedUser.role === 'SUPER_ADMIN' ? '/AdminDashboard' : '/ShopkeeperDashboard');
      } else {
        // Fallback for default Admin / demo credentials check
        const isAdminEmail = inputStr.toLowerCase() === 'admin@easyvyaapaar.com' || inputStr === '9876543210';
        const isAdminPass = passStr === 'Admin@123';

        if (selectedRole === 'SUPER_ADMIN' && isAdminEmail && isAdminPass) {
          login({
            id: 1,
            name: 'Dasari Pavan (Admin)',
            email: 'admin@easyvyaapaar.com',
            mobile: '+91 9876543210',
            role: 'SUPER_ADMIN',
            shopName: 'All Shops System Access',
            status: 'ACTIVE'
          });
          navigate('/AdminDashboard');
        } else {
          setErrorMsg('Invalid login credentials or role selection. Please verify your Mobile number / User ID and Password.');
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

        {/* Role Toggle Selector */}
        <div className="login-role-tabs">
          <button 
            type="button" 
            className={`role-tab-btn ${selectedRole === 'SHOP_KEEPER' ? 'active-tab' : ''}`}
            onClick={() => { setSelectedRole('SHOP_KEEPER'); setErrorMsg(''); }}
          >
            🏪 Shopkeeper
          </button>
          <button 
            type="button" 
            className={`role-tab-btn ${selectedRole === 'SUPER_ADMIN' ? 'active-tab' : ''}`}
            onClick={() => { setSelectedRole('SUPER_ADMIN'); setErrorMsg(''); }}
          >
            👑 Admin
          </button>
        </div>

        {errorMsg && <div className="alert alert-danger" style={{ marginBottom: '1rem', fontSize: '0.82rem' }}>{errorMsg}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">{selectedRole === 'SUPER_ADMIN' ? 'Admin Email / Username' : 'Mobile Number or Email *'}</label>
            <input 
              type="text" 
              className="form-control"
              placeholder={selectedRole === 'SUPER_ADMIN' ? 'admin@easyvyaapaar.com' : 'Enter mobile number or email'}
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
            {submitting ? 'Signing In...' : `Sign In as ${selectedRole === 'SUPER_ADMIN' ? 'Admin' : 'Shopkeeper'}`}
          </button>
        </form>

        {/* Footer Link to Signup */}
        <div className="login-footer">
          Don't have a shop account yet? <Link to="/signup" className="signup-link">Register New Shop</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
