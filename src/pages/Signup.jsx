import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Signup = () => {
  const { signup, checkUserExists } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    shopName: '',
    role: 'SHOP_KEEPER',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Live Password Constraint Validation Rules
  const hasMinLength = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumberOrSpecial;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.mobile.trim() || !formData.password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    // 1. Password Constraint Check
    if (!isPasswordValid) {
      setErrorMsg('Password does not meet safety constraints. Must be at least 8 characters with uppercase, lowercase, and a number or special symbol.');
      return;
    }

    // 2. Unique Phone Number & Email / User ID Check
    const { phoneExists, emailExists } = checkUserExists(formData.mobile, formData.email);
    if (phoneExists) {
      setErrorMsg(`Phone number "${formData.mobile}" is already registered with an existing account. Duplicate phone numbers are not allowed.`);
      return;
    }
    if (emailExists) {
      setErrorMsg(`Email / User ID "${formData.email}" is already registered. Duplicate User IDs are not allowed.`);
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      try {
        signup({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim(),
          password: formData.password,
          role: 'SHOP_KEEPER',
          shopName: formData.shopName.trim() || 'My Kirana Shop'
        });
        navigate('/ShopkeeperDashboard');
      } catch (err) {
        setErrorMsg(err.message || 'Signup failed.');
      } finally {
        setSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className="login-page-container">
      <div className="login-card-wrapper card" style={{ maxWidth: '480px' }}>
        <div className="login-brand-header">
          <div className="brand-logo-icon">🏪</div>
          <h1 className="brand-title">Register Your Shop</h1>
          <p className="brand-tagline">Join EasyVyaapaar & manage stock with your voice</p>
        </div>

        {errorMsg && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input 
              type="text"
              className="form-control"
              placeholder="e.g. Ramesh Kumar"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input 
                type="email"
                className="form-control"
                placeholder="name@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input 
                type="tel"
                className="form-control"
                placeholder="+91 9876543210"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Shop / Store Name *</label>
            <input 
              type="text"
              className="form-control"
              placeholder="e.g. Sri Lakshmi Kirana & General Store"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Type</label>
            <input 
              type="text"
              className="form-control"
              value="🏪 Shopkeeper (Store Owner / Manager)"
              disabled
              style={{ background: '#f8fafc', color: '#166534', fontWeight: 600 }}
            />
            <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
              ℹ️ Admin accounts are pre-configured system accounts and cannot be registered via public signup.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Create Password *</label>
            <input 
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            {/* Live Password Constraint Rules Indicator */}
            <div style={{ marginTop: '0.4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', fontSize: '0.73rem' }}>
              <div style={{ color: hasMinLength ? '#16a34a' : '#64748b', fontWeight: hasMinLength ? 600 : 400 }}>
                {hasMinLength ? '✓' : '○'} At least 8 characters
              </div>
              <div style={{ color: hasUpper ? '#16a34a' : '#64748b', fontWeight: hasUpper ? 600 : 400 }}>
                {hasUpper ? '✓' : '○'} One UPPERCASE letter
              </div>
              <div style={{ color: hasLower ? '#16a34a' : '#64748b', fontWeight: hasLower ? 600 : 400 }}>
                {hasLower ? '✓' : '○'} One lowercase letter
              </div>
              <div style={{ color: hasNumberOrSpecial ? '#16a34a' : '#64748b', fontWeight: hasNumberOrSpecial ? 600 : 400 }}>
                {hasNumberOrSpecial ? '✓' : '○'} One number / symbol
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Register Shopkeeper Account'}
          </button>
        </form>

        <div className="login-footer">
          Already have an account? <Link to="/login" className="signup-link">Sign In Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
