import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n';
import './CommandConfirmModal.css';

const CommandConfirmModal = ({ parsedCommand, onConfirm, onCancel }) => {
  const { t } = useLanguage();
  const [editedCommand, setEditedCommand] = useState(null);
  const [validationError, setValidationError] = useState('');
  
  useEffect(() => {
    if (parsedCommand) {
      setEditedCommand({
        ...parsedCommand,
        unit: parsedCommand.unit || 'BAG',
        operation: parsedCommand.operation || 'ADD'
      });
      setValidationError('');
    }
  }, [parsedCommand]);

  if (!parsedCommand || !editedCommand) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCommand(prev => ({
      ...prev,
      [name]: name === 'quantity' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleConfirm = () => {
    const qty = parseFloat(editedCommand.quantity);
    if (!editedCommand.product || !editedCommand.product.trim()) {
      setValidationError('Please specify a product name.');
      return;
    }
    if (isNaN(qty) || qty <= 0) {
      setValidationError('Please enter a valid quantity greater than zero.');
      return;
    }

    setValidationError('');
    onConfirm({
      productName: editedCommand.product.trim(),
      quantity: qty,
      unit: (editedCommand.unit && editedCommand.unit.trim()) ? editedCommand.unit.trim() : 'BAG',
      price: editedCommand.price ? parseFloat(editedCommand.price) : null,
      operation: editedCommand.operation || 'ADD',
      originalVoiceText: editedCommand.originalText || ''
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <h3 className="modal-title">I understood:</h3>
        
        {validationError && (
          <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
            {validationError}
          </div>
        )}

        {!editedCommand.parsed && !validationError && (
          <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
            {editedCommand.errorMessage || "Could not fully parse the command. Please check details below."}
          </div>
        )}

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">{t('product_name')}</label>
          <input 
            type="text" 
            className="form-control" 
            name="product" 
            value={editedCommand.product || ''} 
            onChange={handleChange}
            placeholder="e.g. Rice, Sugar"
          />
        </div>
        
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">{t('quantity')}</label>
          <input 
            type="number" 
            step="0.01"
            className="form-control" 
            name="quantity" 
            value={editedCommand.quantity !== undefined && editedCommand.quantity !== null ? editedCommand.quantity : ''} 
            onChange={handleChange}
            placeholder="e.g. 5"
          />
        </div>
        
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">{t('unit')}</label>
          <input 
            type="text" 
            className="form-control" 
            name="unit" 
            value={editedCommand.unit || ''} 
            onChange={handleChange}
            placeholder="e.g. BAG, KG, LITRE"
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Price (₹)</label>
          <input 
            type="number" 
            step="0.01"
            className="form-control" 
            name="price" 
            value={editedCommand.price || ''} 
            onChange={handleChange}
            placeholder="Optional price per unit"
          />
        </div>
        
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">{t('action')}</label>
          <select 
            className="form-control" 
            name="operation" 
            value={editedCommand.operation || 'ADD'} 
            onChange={handleChange}
          >
            <option value="ADD">{t('add_stock')}</option>
            <option value="REMOVE">{t('remove_stock')}</option>
          </select>
        </div>

        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={onCancel}>{t('cancel')}</button>
          <button className="btn btn-primary" onClick={handleConfirm}>{t('confirm')}</button>
        </div>
      </div>
    </div>
  );
};

export default CommandConfirmModal;
