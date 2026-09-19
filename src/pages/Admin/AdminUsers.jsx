import { useState, useEffect } from 'react';
import { getAdminUsers, getAdminShops } from '../../services/adminService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [shopFilter, setShopFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsersData();
  }, []);

  const loadUsersData = async () => {
    try {
      const [userRes, shopRes] = await Promise.all([
        getAdminUsers(),
        getAdminShops()
      ]);
      setUsers(userRes.data || []);
      setShops(shopRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = !search.trim() || 
      u.name.toLowerCase().includes(search.toLowerCase().trim()) || 
      u.email.toLowerCase().includes(search.toLowerCase().trim()) ||
      u.mobile.includes(search.trim());
    
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesShop = shopFilter === 'ALL' || (u.shopName && u.shopName === shopFilter);

    return matchesSearch && matchesRole && matchesShop;
  });

  if (loading) return <div className="loading-spinner">Loading User Management...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>👥 User & Account Management</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage user accounts, assigned roles, and shop associations</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            className="form-control"
            placeholder="Search name, email, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '200px' }}
          />

          <select 
            className="form-control"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="SHOP_KEEPER">Shopkeeper</option>
          </select>

          <select 
            className="form-control"
            value={shopFilter}
            onChange={(e) => setShopFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="ALL">All Shops</option>
            {shops.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Role</th>
              <th>Assigned Shop</th>
              <th>Status</th>
              <th>Created Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>
                  <div>{u.email}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>📱 {u.mobile}</div>
                </td>
                <td>
                  <span className={`badge ${u.role === 'SUPER_ADMIN' ? 'badge-primary' : 'badge-success'}`}>
                    {u.role === 'SUPER_ADMIN' ? '👑 Super Admin' : '🏪 Shopkeeper'}
                  </span>
                </td>
                <td>{u.shopName || 'System Wide'}</td>
                <td>
                  <span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                    {u.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginRight: '0.4rem' }}
                    onClick={() => setSelectedUser(u)}
                  >
                    👁️ Details
                  </button>
                  {u.role !== 'SUPER_ADMIN' && (
                    <button 
                      className={`btn ${u.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                      onClick={() => handleToggleStatus(u.id)}
                    >
                      {u.status === 'ACTIVE' ? '🚫 Disable' : '✅ Enable'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No users found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '450px' }}>
            <h3>👤 User Profile & Role Authorization</h3>
            <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div><strong>Name:</strong> {selectedUser.name}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Mobile:</strong> {selectedUser.mobile}</div>
              <div><strong>Role:</strong> {selectedUser.role}</div>
              <div><strong>Assigned Shop:</strong> {selectedUser.shopName}</div>
              <div><strong>Account Status:</strong> <span className={`badge ${selectedUser.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{selectedUser.status}</span></div>
            </div>

            <div className="alert alert-info" style={{ fontSize: '0.8rem' }}>
              ℹ️ Ordinary users cannot self-assign Super Admin privileges. Role modifications must be performed by an active Super Admin.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
