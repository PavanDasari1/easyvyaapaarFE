import { useState, useEffect } from 'react';
import { getRecentTransactions } from '../../services/inventoryService';

const ShopkeeperSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const res = await getRecentTransactions();
      // Filter sales/removals
      setSales(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading Sales Log...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2>💰 Shop Sales Log</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Recent customer transactions and payment statuses</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Amount (₹)</th>
              <th>Payment Status</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(tx => (
              <tr key={tx.id}>
                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'N/A'}
                </td>
                <td><strong>{tx.productName}</strong></td>
                <td>{tx.quantity}</td>
                <td>{tx.unit}</td>
                <td>₹ {tx.price ? (tx.quantity * tx.price).toLocaleString('en-IN') : '150'}</td>
                <td>
                  <span className="badge badge-success">
                    Paid
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    {tx.source === 'VOICE' ? '🎤 Voice' : '⌨️ Manual'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShopkeeperSales;
