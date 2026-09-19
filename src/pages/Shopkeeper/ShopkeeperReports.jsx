import Reports from '../Reports';

const ShopkeeperReports = () => {
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
          🏪 Shopkeeper Store Reports Mode
        </span>
      </div>
      <Reports />
    </div>
  );
};

export default ShopkeeperReports;
