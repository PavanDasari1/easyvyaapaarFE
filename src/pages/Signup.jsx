import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Signup = () => {
  const { signup } = useAuth();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.mobile.trim() || !formData.password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    setTimeout(() => {
      signup({
        id: Date.now(),
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        role: formData.role,
        shopName: formData.shopName.trim() || 'My Kirana Shop',
        status: 'ACTIVE'
      });

      navigate(formData.role === 'SUPER_ADMIN' ? '/AdminDashboard' : '/ShopkeeperDashboard');
      setSubmitting(false);
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
              placeholder="e.g. Dasari Pavan"
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
            <label className="form-label">Account Role *</label>
            <select 
              className="form-control"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="SHOP_KEEPER">Shopkeeper (Store Owner / Manager)</option>
              <option value="SUPER_ADMIN">System Administrator</option>
            </select>
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
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Create Account & Open Dashboard'}
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
