import { useState, useEffect } from 'react';
import { getAdminShops } from '../../services/adminService';

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      const res = await getAdminShops();
      setShops(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShopStatus = (id) => {
    setShops(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const filteredShops = shops.filter(s =>
    !search.trim() ||
    s.name.toLowerCase().includes(search.toLowerCase().trim()) ||
    s.ownerName.toLowerCase().includes(search.toLowerCase().trim()) ||
    s.location.toLowerCase().includes(search.toLowerCase().trim())
  );

  if (loading) return <div className="loading-spinner">Loading Shop Management...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>🏪 Registered Shops Overview</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>System-wide shop registry, storekeepers, and active catalog statuses</p>
        </div>

        <input 
          type="text" 
          className="form-control"
          placeholder="Search shop name, owner, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '240px' }}
        />
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Owner Name</th>
              <th>Shopkeeper</th>
              <th>Active Products</th>
              <th>Total Stock Value</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShops.map(s => (
              <tr key={s.id}>
                <td>
                  <strong>{s.name}</strong>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>📍 {s.location}</div>
                </td>
                <td>{s.ownerName}</td>
                <td>{s.shopkeeperName}</td>
                <td><strong>{s.activeProducts}</strong> items</td>
                <td>₹ {s.totalStockValue ? s.totalStockValue.toLocaleString('en-IN') : '0'}</td>
                <td>
                  <span className={`badge ${s.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                    {s.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginRight: '0.3rem' }}>
                    👁️ View
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginRight: '0.3rem' }}>
                    ✏️ Edit
                  </button>
                  <button 
                    className={`btn ${s.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                    onClick={() => handleToggleShopStatus(s.id)}
                  >
                    {s.status === 'ACTIVE' ? '🚫 Disable' : '✅ Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminShops;
