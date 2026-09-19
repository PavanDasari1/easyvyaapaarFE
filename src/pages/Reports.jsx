import { useState, useEffect } from 'react';
import { getAllProducts } from '../services/productService';
import { getRecentTransactions } from '../services/inventoryService';
import { useLanguage } from '../i18n';
import './Reports.css';

const Reports = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodRes, txRes] = await Promise.all([
        getAllProducts(),
        getRecentTransactions()
      ]);
      setProducts(prodRes.data || []);
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Analytics calculations
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.currentStock <= p.minimumStock || p.lowStock).length;
  
  const totalStockValue = products.reduce((sum, p) => sum + ((p.currentStock || 0) * (p.price || 0)), 0);

  // Group by category
  const categorySummary = products.reduce((acc, p) => {
    const cat = p.category || 'General';
    if (!acc[cat]) acc[cat] = { count: 0, stock: 0, val: 0 };
    const currentStock = Number(p.currentStock) || 0;
    const price = Number(p.price) || 0;
    acc[cat].count += 1;
    acc[cat].stock += currentStock;
    acc[cat].val += (currentStock * price);
    return acc;
  }, {});

  const exportCSV = () => {
    const headers = ['Product ID,Product Name,Category,Current Stock,Unit,Minimum Stock,Price (INR),Stock Value (INR),Status'];
    const rows = products.map(p => {
      const status = (p.currentStock <= p.minimumStock || p.lowStock) ? 'LOW STOCK' : 'OK';
      const val = (Number(p.currentStock) || 0) * (Number(p.price) || 0);
      return `"${p.id}","${p.name}","${p.category || 'General'}","${p.currentStock}","${p.unit}","${p.minimumStock}","${p.price || 0}","${val}","${status}"`;
    });
    
    const csvContent = 'data:text/csv;charset=utf-8,' + headers.concat(rows).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EasyVyaapaar_Inventory_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading-spinner">Loading analytics...</div>;

  return (
    <div className="reports-container">
      <div className="reports-header card">
        <div>
          <h2>📊 Real-Time Analytics & Inventory Reports</h2>
          <p>Complete summary of shop inventory, valuation, and category breakdown</p>
        </div>
        <button className="btn btn-primary" onClick={exportCSV}>
          📥 Export Inventory to CSV
        </button>
      </div>

      <div className="analytics-summary-grid">
        <div className="stat-card stat-card-green">
          <div className="stat-icon-wrap bg-light-green">💰</div>
          <div className="stat-details">
            <span className="stat-title">Total Inventory Valuation</span>
            <div className="stat-value">₹ {totalStockValue.toLocaleString('en-IN')}</div>
            <span className="stat-subtext">Total worth of current stock</span>
          </div>
        </div>

        <div className="stat-card stat-card-blue">
          <div className="stat-icon-wrap bg-light-blue">📦</div>
          <div className="stat-details">
            <span className="stat-title">Catalog Size</span>
            <div className="stat-value">{totalProducts} Items</div>
            <span className="stat-subtext">Active SKUs listed</span>
          </div>
        </div>

        <div className="stat-card stat-card-orange">
          <div className="stat-icon-wrap bg-light-orange">⚠️</div>
          <div className="stat-details">
            <span className="stat-title">Shortage Items</span>
            <div className="stat-value text-orange">{lowStockCount} Items</div>
            <span className="stat-subtext">Requires immediate reorder</span>
          </div>
        </div>
      </div>

      <div className="card category-breakdown-card">
        <h3>🏷️ Inventory Breakdown by Category</h3>
        <div className="table-responsive" style={{ marginTop: '1rem' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Total Items</th>
                <th>Total Units in Stock</th>
                <th>Category Valuation (₹)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categorySummary).map(([cat, data]) => (
                <tr key={cat}>
                  <td><strong>{cat}</strong></td>
                  <td>{data.count} products</td>
                  <td>{data.stock.toFixed(1)}</td>
                  <td><strong>₹ {data.val.toLocaleString('en-IN')}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
