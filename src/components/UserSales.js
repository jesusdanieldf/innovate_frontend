// SalesModal.js
import React from 'react';

function UserSales({ show, sales, userName, onClose }) {
  return (
    show && (
      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Sales of {userName}</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {sales.length > 0 ? (
                <ul>
                  {sales.map((sale) => (
                    <li key={sale.id}>
                      Sale ID: {sale.id}, Amount: ${sale.amount}, Date: {sale.date}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No sales found for this user.</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default UserSales;
