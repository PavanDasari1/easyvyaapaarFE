import { useState, useEffect } from 'react';
import { getAllProducts } from '../../services/productService';
import { addStock, removeStock } from '../../services/inventoryService';

const ShopkeeperInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadInventory();
    const interval = setInterval(() => {
      loadInventory();
    }, 5000);

    const handleDataChanged = () => {
      loadInventory();
    };

    window.addEventListener('easyvyaapaar-data-changed', handleDataChanged);

    return () => {
      clearInterval(interval);
      window.removeEventListener('easyvyaapaar-data-changed', handleDataChanged);
    };
  }, []);

  const loadInventory = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (p) => {
    try {
      await addStock({
        productId: p.id,
        quantity: 1,
        unit: p.unit,
        source: 'MANUAL'
      });
      loadInventory();
    } catch (err) {
      alert(err.message || 'Failed to add stock');
    }
  };

  const handleQuickRemove = async (p) => {
    if (p.currentStock <= 0) return;
    try {
      await removeStock({
        productId: p.id,
        quantity: 1,
        unit: p.unit,
        source: 'MANUAL'
      });
      loadInventory();
    } catch (err) {
      alert(err.message || 'Failed to remove stock');
    }
  };

  const getStockStatus = (p) => {
    if (p.currentStock <= 0) return { label: 'Out of Stock', cls: 'badge-danger' };
    if (p.currentStock <= p.minimumStock || p.lowStock) return { label: 'Low Stock', cls: 'badge-warning' };
    return { label: 'In Stock', cls: 'badge-success' };
  };

  const filteredProducts = products.filter(p => {
    const status = getStockStatus(p);
    const matchesSearch = !search.trim() || p.name.toLowerCase().includes(search.toLowerCase().trim());
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'IN_STOCK' && status.label === 'In Stock') ||
      (statusFilter === 'LOW_STOCK' && status.label === 'Low Stock') ||
      (statusFilter === 'OUT_OF_STOCK' && status.label === 'Out of Stock');

    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="loading-spinner">Loading Inventory...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>📋 Shopkeeper Inventory View</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Real-time stock status and quick adjustment actions</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input 
            type="text" 
            className="form-control"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '180px' }}
          />

          <select 
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="ALL">All Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Price (₹)</th>
              <th>Stock Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => {
              const status = getStockStatus(p);
              return (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>
                    <span style={{ background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>
                      {p.category || 'General'}
                    </span>
                  </td>
                  <td><strong>{p.currentStock}</strong></td>
                  <td>{p.unit}</td>
                  <td>{p.price ? `₹ ${p.price}` : '-'}</td>
                  <td>
                    <span className={`badge ${status.cls}`}>
                      {status.label}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', marginRight: '0.3rem' }}
                      onClick={() => handleQuickAdd(p)}
                      title="Add 1 unit"
                    >
                      + Add
                    </button>
                    <button 
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                      disabled={p.currentStock <= 0}
                      onClick={() => handleQuickRemove(p)}
                      title="Remove 1 unit"
                    >
                      - Remove
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No inventory items match search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShopkeeperInventory;
