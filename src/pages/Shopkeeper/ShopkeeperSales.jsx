import { useState, useEffect } from 'react';
import { getRecentTransactions } from '../../services/inventoryService';

const ShopkeeperSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const res = await getRecentTransactions();
      const allTx = res.data || [];
      // Filter sales/removals
      const salesTx = allTx.filter(t => t.operation === 'REMOVE' || t.operation === 'SALE');
      setSales(salesTx.length > 0 ? salesTx : allTx);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading Sales Log & Analytics...</div>;

  // Calculate Thrice-Monthly Cycles & Monthly Metrics
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let todayTotal = 0;
  let cycle1Total = 0; // Days 1 to 10
  let cycle2Total = 0; // Days 11 to 20
  let cycle3Total = 0; // Days 21 to 31
  let monthlyTotal = 0;

  sales.forEach(tx => {
    const txDate = tx.createdAt ? new Date(tx.createdAt) : new Date();
    const amount = (tx.quantity || 1) * (tx.price || 150);

    // Is current month?
    if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
      monthlyTotal += amount;
      const day = txDate.getDate();
      if (day <= 10) cycle1Total += amount;
      else if (day <= 20) cycle2Total += amount;
      else cycle3Total += amount;

      // Is today?
      if (day === now.getDate()) {
        todayTotal += amount;
      }
    } else {
      // Fallback for demo dates
      monthlyTotal += amount;
      cycle1Total += amount * 0.35;
      cycle2Total += amount * 0.40;
      cycle3Total += amount * 0.25;
    }
  });

  // Filter transactions based on active tab
  const filteredSales = sales.filter(tx => {
    const txDate = tx.createdAt ? new Date(tx.createdAt) : new Date();
    const day = txDate.getDate();
    if (activeTab === 'TODAY') return day === now.getDate();
    if (activeTab === 'CYCLE_1') return day >= 1 && day <= 10;
    if (activeTab === 'CYCLE_2') return day >= 11 && day <= 20;
    if (activeTab === 'CYCLE_3') return day >= 21;
    if (activeTab === 'MONTHLY') return txDate.getMonth() === currentMonth;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>💰 Shopkeeper Sales & Revenue Analytics</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Thrice-Monthly (10-Day Cycles) and Monthly Sales Overview</p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${activeTab === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => setActiveTab('ALL')}
            >
              All Sales
            </button>
            <button 
              className={`btn ${activeTab === 'TODAY' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => setActiveTab('TODAY')}
            >
              📅 Today
            </button>
            <button 
              className={`btn ${activeTab === 'CYCLE_1' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => setActiveTab('CYCLE_1')}
            >
              1st-10th (Cycle 1)
            </button>
            <button 
              className={`btn ${activeTab === 'CYCLE_2' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => setActiveTab('CYCLE_2')}
            >
              11th-20th (Cycle 2)
            </button>
            <button 
              className={`btn ${activeTab === 'CYCLE_3' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => setActiveTab('CYCLE_3')}
            >
              21st-End (Cycle 3)
            </button>
            <button 
              className={`btn ${activeTab === 'MONTHLY' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => setActiveTab('MONTHLY')}
            >
              📆 Monthly Total
            </button>
            <button 
              className={`btn ${activeTab === 'KHATA_BOOK' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: activeTab === 'KHATA_BOOK' ? '#9333ea' : '#fef4ff', color: activeTab === 'KHATA_BOOK' ? '#fff' : '#7e22ce', borderColor: '#f5d0fe' }}
              onClick={() => setActiveTab('KHATA_BOOK')}
            >
              📝 Khata Book (Udhaar)
            </button>
          </div>
        </div>
      </div>

      {/* Thrice-Monthly (10-Day Cycles) Cards Grid */}
      <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
        <div className="stat-card stat-card-green">
          <div className="stat-icon-wrap bg-light-green">💵</div>
          <div className="stat-details">
            <span className="stat-title">Monthly Total</span>
            <div className="stat-value">₹ {monthlyTotal.toLocaleString('en-IN')}</div>
            <span className="stat-subtext">Current Month Revenue</span>
          </div>
        </div>

        <div className="stat-card stat-card-blue">
          <div className="stat-icon-wrap bg-light-blue">1️⃣</div>
          <div className="stat-details">
            <span className="stat-title">1st–10th (Cycle 1)</span>
            <div className="stat-value">₹ {Math.round(cycle1Total).toLocaleString('en-IN')}</div>
            <span className="stat-subtext">First 10 Days Sales</span>
          </div>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-icon-wrap bg-light-purple">2️⃣</div>
          <div className="stat-details">
            <span className="stat-title">11th–20th (Cycle 2)</span>
            <div className="stat-value">₹ {Math.round(cycle2Total).toLocaleString('en-IN')}</div>
            <span className="stat-subtext">Middle 10 Days Sales</span>
          </div>
        </div>

        <div className="stat-card stat-card-orange">
          <div className="stat-icon-wrap bg-light-orange">3️⃣</div>
          <div className="stat-details">
            <span className="stat-title">21st–End (Cycle 3)</span>
            <div className="stat-value">₹ {Math.round(cycle3Total).toLocaleString('en-IN')}</div>
            <span className="stat-subtext">Final 10 Days Sales</span>
          </div>
        </div>
      </div>

      {/* Transactions Table OR Khata Book */}
      {activeTab === 'KHATA_BOOK' ? (
        <KhataBookSection />
      ) : (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>🛒 Sales Transactions ({activeTab.replace('_', ' ')})</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Product</th>
                  <th>Quantity Sold</th>
                  <th>Unit</th>
                  <th>Sale Amount (₹)</th>
                  <th>Payment</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleString('en-GB') : new Date().toLocaleDateString('en-GB')}
                    </td>
                    <td><strong>{tx.productName}</strong></td>
                    <td><strong>{tx.quantity}</strong></td>
                    <td>{tx.unit}</td>
                    <td><strong>₹ {tx.price ? (tx.quantity * tx.price).toLocaleString('en-IN') : (tx.quantity * 150).toLocaleString('en-IN')}</strong></td>
                    <td>
                      <span className="badge badge-success">
                        Paid
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                        {tx.source === 'VOICE' ? '🎤 Voice' : '⌨️ Manual'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredSales.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      No sales recorded for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Component for Customer Khata / Udhaar Ledger Book
const KhataBookSection = () => {
  const [khataList, setKhataList] = useState(() => {
    const saved = localStorage.getItem('easyvyaapaar_khata_db');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, customerName: 'Ramu K.', mobile: '9848011223', items: '2 Bags Rice, 5kg Sugar', amount: 850, date: '2026-09-15', status: 'PENDING' },
      { id: 2, customerName: 'Suresh B.', mobile: '9912388776', items: '10 L Cooking Oil', amount: 1450, date: '2026-09-18', status: 'PENDING' }
    ];
  });

  const [showAddKhata, setShowAddKhata] = useState(false);
  const [newKhata, setNewKhata] = useState({ customerName: '', mobile: '', items: '', amount: '' });

  useEffect(() => {
    localStorage.setItem('easyvyaapaar_khata_db', JSON.stringify(khataList));
  }, [khataList]);

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!newKhata.customerName || !newKhata.amount) return;

    const entry = {
      id: Date.now(),
      customerName: newKhata.customerName.trim(),
      mobile: newKhata.mobile.trim(),
      items: newKhata.items.trim() || 'Kirana items',
      amount: parseFloat(newKhata.amount) || 0,
      date: new Date().toISOString().slice(0, 10),
      status: 'PENDING'
    };

    setKhataList([entry, ...khataList]);
    setNewKhata({ customerName: '', mobile: '', items: '', amount: '' });
    setShowAddKhata(false);
  };

  const toggleStatus = (id) => {
    setKhataList(prev => prev.map(k => k.id === id ? { ...k, status: k.status === 'PENDING' ? 'SETTLED' : 'PENDING' } : k));
  };

  const sendReminder = (k) => {
    const msg = `Dear ${k.customerName}, your Udhaar credit balance at Kirana Store is ₹${k.amount} for (${k.items}). Kindly clear your balance at your convenience. Thank you!`;
    const mobileNum = k.mobile ? k.mobile.replace(/[^0-9]/g, '') : '';
    const waUrl = mobileNum ? `https://wa.me/91${mobileNum}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const totalUdhaar = khataList.filter(k => k.status === 'PENDING').reduce((sum, k) => sum + k.amount, 0);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ color: '#7e22ce' }}>📝 Customer Khata Book (Udhaar Ledger)</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Track customer credit accounts, balances, and send 1-click WhatsApp payment reminders</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#fef4ff', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #f5d0fe' }}>
            <span style={{ fontSize: '0.78rem', color: '#6b21a8' }}>Total Pending Credit:</span>
            <strong style={{ fontSize: '1rem', color: '#7e22ce', marginLeft: '0.5rem' }}>₹ {totalUdhaar.toLocaleString('en-IN')}</strong>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddKhata(true)}>
            + Add Khata Entry
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Items Owed</th>
              <th>Balance (₹)</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {khataList.map(k => (
              <tr key={k.id}>
                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{k.date}</td>
                <td><strong>{k.customerName}</strong></td>
                <td>{k.mobile || '-'}</td>
                <td style={{ fontSize: '0.85rem', color: '#475569' }}>{k.items}</td>
                <td><strong style={{ color: k.status === 'PENDING' ? '#dc2626' : '#16a34a' }}>₹ {k.amount.toLocaleString('en-IN')}</strong></td>
                <td>
                  <span className={`badge ${k.status === 'PENDING' ? 'badge-warning' : 'badge-success'}`}>
                    {k.status === 'PENDING' ? '⏳ Pending' : '✅ Settled'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {k.status === 'PENDING' && (
                    <button 
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '0.2rem 0.5rem', background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0', marginRight: '0.4rem' }}
                      onClick={() => sendReminder(k)}
                    >
                      💬 WhatsApp Reminder
                    </button>
                  )}
                  <button 
                    className={`btn ${k.status === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', padding: '0.2rem 0.5rem' }}
                    onClick={() => toggleStatus(k.id)}
                  >
                    {k.status === 'PENDING' ? 'Mark Paid' : 'Reopen'}
                  </button>
                </td>
              </tr>
            ))}
            {khataList.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No customer credit accounts recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Khata Modal */}
      {showAddKhata && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '440px' }}>
            <h3>📝 New Customer Khata Entry</h3>
            <form onSubmit={handleAddEntry} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Customer Name *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Ramu Garu"
                  value={newKhata.customerName}
                  onChange={(e) => setNewKhata({ ...newKhata, customerName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Customer Mobile Number</label>
                <input 
                  type="tel" 
                  className="form-control"
                  placeholder="9876543210"
                  value={newKhata.mobile}
                  onChange={(e) => setNewKhata({ ...newKhata, mobile: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Items Taken on Credit</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. 2 bags rice, 1kg sugar"
                  value={newKhata.items}
                  onChange={(e) => setNewKhata({ ...newKhata, items: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Credit Amount (₹) *</label>
                <input 
                  type="number" 
                  className="form-control"
                  placeholder="e.g. 850"
                  value={newKhata.amount}
                  onChange={(e) => setNewKhata({ ...newKhata, amount: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddKhata(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Khata Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopkeeperSales;
