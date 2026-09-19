import Reports from '../Reports';

const AdminReports = () => {
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
          👑 System-Wide Admin Reports Mode
        </span>
      </div>
      <Reports />
    </div>
  );
};

export default AdminReports;
