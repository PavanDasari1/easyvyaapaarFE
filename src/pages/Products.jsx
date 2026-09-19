import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { useLanguage } from '../i18n';

const Products = ({ searchQuery = '' }) => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [productForm, setProductForm] = useState({
    name: '',
    category: 'General',
    unit: 'KG',
    currentStock: 0,
    minimumStock: 5,
    price: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'General',
      unit: 'KG',
      currentStock: 0,
      minimumStock: 5,
      price: ''
    });
    setErrorMsg('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category || 'General',
      unit: p.unit,
      currentStock: p.currentStock,
      minimumStock: p.minimumStock,
      price: p.price || ''
    });
    setErrorMsg('');
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete '${name}'?`)) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      setErrorMsg('Product name is required');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      const payload = {
        name: productForm.name.trim(),
        category: productForm.category || 'General',
        unit: productForm.unit.toUpperCase(),
        currentStock: parseFloat(productForm.currentStock) || 0,
        minimumStock: parseFloat(productForm.minimumStock) || 0,
        price: productForm.price ? parseFloat(productForm.price) : null
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setShowAddModal(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean))];
  const activeSearch = (searchQuery || localSearch).toLowerCase().trim();

  const filteredProducts = products.filter(p => {
    const matchesSearch = !activeSearch || p.name.toLowerCase().includes(activeSearch);
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="loading-spinner">Loading products...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>📦 {t('products')}</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage product catalog and inventory thresholds</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input 
            type="text" 
            className="form-control"
            placeholder="Search catalog..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{ width: '180px' }}
          />

          <select 
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '140px' }}
          >
            <option value="ALL">All Categories</option>
            {categories.filter(c => c !== 'ALL').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button 
            className="btn btn-primary"
            onClick={handleOpenCreateModal}
          >
            ➕ {t('add_product') || 'Add Product'}
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>{t('product_name')}</th>
              <th>{t('category')}</th>
              <th>{t('current_stock')}</th>
              <th>{t('min_stock')}</th>
              <th>Price</th>
              <th>{t('status')}</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => {
              const isLow = p.currentStock <= p.minimumStock || p.lowStock;
              return (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>
                    <span style={{ background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>
                      {p.category || 'General'}
                    </span>
                  </td>
                  <td><strong>{p.currentStock}</strong> {(p.unit || '').toLowerCase()}</td>
                  <td>{p.minimumStock} {(p.unit || '').toLowerCase()}</td>
                  <td>{p.price ? `₹ ${p.price}` : '-'}</td>
                  <td>
                    {isLow ? 
                      <span className="badge badge-danger">{t('low_stock')}</span> : 
                      <span className="badge badge-success">{t('ok')}</span>
                    }
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginRight: '0.4rem' }}
                      onClick={() => handleOpenEditModal(p)}
                    >
                      ✏️ {t('edit')}
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                    >
                      🗑️ {t('delete')}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  {t('no_products')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '500px' }}>
            <h3>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
            
            {errorMsg && <div className="alert alert-danger" style={{ margin: '1rem 0' }}>{errorMsg}</div>}

            <form onSubmit={handleSubmitForm}>
              <div className="form-group">
                <label className="form-label">{t('product_name')} *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Rice, Sugar, Almonds"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('category')}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  placeholder="e.g. Grains, Pulses, Dairy"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('unit')} *</label>
                <select 
                  className="form-control" 
                  value={productForm.unit}
                  onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                >
                  <option value="BAG">BAG (బస్తా)</option>
                  <option value="KG">KG (కేజీ)</option>
                  <option value="GRAM">GRAM (గ్రాము)</option>
                  <option value="LITRE">LITRE (లీటరు)</option>
                  <option value="ML">ML (మిల్లీ)</option>
                  <option value="PACKET">PACKET (ప్యాకెట్)</option>
                  <option value="PIECE">PIECE (పీస్)</option>
                  <option value="CARTON">CARTON (కార్టన్)</option>
                  <option value="BOX">BOX (బాక్స్)</option>
                  <option value="DOZEN">DOZEN (డజను)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('current_stock')}</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-control" 
                    value={productForm.currentStock}
                    disabled={!!editingProduct}
                    title={editingProduct ? "Use Voice or + / - quick buttons on Dashboard to adjust stock" : ""}
                    onChange={(e) => setProductForm({ ...productForm, currentStock: e.target.value })}
                  />
                  {editingProduct && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Adjust via voice / dashboard</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">{t('min_stock')}</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-control" 
                    value={productForm.minimumStock}
                    onChange={(e) => setProductForm({ ...productForm, minimumStock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  placeholder="Optional price per unit"
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
