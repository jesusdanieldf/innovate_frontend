import React, { useState } from 'react';

function TransferModal({ product, setShowTransferModal, onTransfer }) {
  const [transferType, setTransferType] = useState('TO_PHYSICAL');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      setLoading(false);
      return;
    }

    if (transferType === 'TO_PHYSICAL' && product.amount < quantity) {
      setError(`Not enough storehouse quantity. Available: ${product.amount}`);
      setLoading(false);
      return;
    }

    if (transferType === 'TO_LOGICAL' && product.physical < quantity) {
      setError(`Not enough physical quantity. Available: ${product.physical}`);
      setLoading(false);
      return;
    }

    try {
      await onTransfer(product.id, transferType, parseInt(quantity));
    } catch (error) {
      setError('Error while performing the transfer');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowTransferModal(false);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Transfer Product: {product.name}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="mb-3 p-3 bg-light rounded">
              <div className="row">
                <div className="col-6">
                  <strong>Storehouse Quantity: {product.amount}</strong>
                </div>
                <div className="col-6">
                  <strong>Physical Quantity: {product.physical}</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Transfer Type</label>
                <select 
                  className="form-select"
                  value={transferType}
                  onChange={(e) => setTransferType(e.target.value)}
                >
                  <option value="TO_PHYSICAL">From Storehouse to Physical</option>
                  <option value="TO_LOGICAL">From Physical to Storehouse</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  max={transferType === 'TO_PHYSICAL' ? product.amount : product.physical}
                />
                <div className="form-text">
                  Max available: {transferType === 'TO_PHYSICAL' ? product.amount : product.physical}
                </div>
              </div>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Transferring...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferModal;
