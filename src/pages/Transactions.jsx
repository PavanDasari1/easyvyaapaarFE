import { useState, useEffect } from 'react';
import { getTransactions } from '../services/inventoryService';
import { useLanguage } from '../i18n';

const Transactions = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOp, setFilterOp] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadTransactions();
  }, [page]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await getTransactions(page, 20);
      const data = res.data;
      if (data && data.content) {
        setTransactions(data.content);
        setTotalPages(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        setTransactions(data);
      }
    } catch (err) {
      console.error('Failed to load transactions', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTx = transactions.filter(tx => {
    const matchesOp = filterOp === 'ALL' || tx.operation === filterOp;
    const matchesSearch = !searchTerm.trim() || 
      (tx.productName && tx.productName.toLowerCase().includes(searchTerm.toLowerCase().trim()));
    return matchesOp && matchesSearch;
  });

  if (loading && transactions.length === 0) return <div className="loading-spinner">Loading history...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>🕒 {t('transactions')}</h2>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input 
            type="text"
            className="form-control"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '200px' }}
          />

          <select 
            className="form-control"
            value={filterOp}
            onChange={(e) => setFilterOp(e.target.value)}
            style={{ width: '140px' }}
          >
            <option value="ALL">All Actions</option>
            <option value="ADD">+ {t('add_stock')}</option>
            <option value="REMOVE">- {t('remove_stock')}</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('product_name')}</th>
              <th>{t('action')}</th>
              <th>{t('quantity')}</th>
              <th>Source</th>
              <th>Original Voice / Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredTx.map(tx => (
              <tr key={tx.id}>
                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'N/A'}
                </td>
                <td><strong>{tx.productName}</strong></td>
                <td>
                  <span className={`badge ${tx.operation === 'ADD' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.8rem', padding: '0.3em 0.7em' }}>
                    {tx.operation === 'ADD' ? `+ ${t('add_stock')}` : `- ${t('remove_stock')}`}
                  </span>
                </td>
                <td><strong>{tx.quantity}</strong> {tx.unit ? tx.unit.toLowerCase() : ''}</td>
                <td>
                  <span style={{ fontSize: '0.85rem', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    {tx.source === 'VOICE' ? '🎤 Voice' : '⌨️ Manual'}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', fontStyle: tx.originalVoiceText ? 'italic' : 'normal', color: '#475569' }}>
                  {tx.originalVoiceText ? `"${tx.originalVoiceText}"` : (tx.notes || '-')}
                </td>
              </tr>
            ))}
            {filteredTx.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
          <button 
            className="btn btn-secondary"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            ← Previous
          </button>

          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
            Page {page + 1} of {totalPages}
          </span>

          <button 
            className="btn btn-secondary"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
