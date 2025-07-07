// src/components/DetailSale.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ViewDetails({ setShowDetailsModal, sale }) {
    // Asegúrate de que 'sale' tenga la información correcta
    const { productName, client, saleDate, total } = sale; // Desestructura las propiedades correctas
    const handleImport = () => {
        // Lógica para manejar la importación
        console.log("Importing details...");
    }

    return (
        <>
            {/* Fondo oscuro del modal */}
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
            <div className="modal fade show" style={{ display: "block", zIndex: 1050 }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">View Details</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setShowDetailsModal(false)}
                            />
                        </div>
                        <div className="modal-body">
                            {/* Mostrar detalles */}
                            <p><strong>Product Name:</strong> {productName}</p>
                            <p><strong>Client:</strong> {client}</p>
                            <p><strong>Sale Date:</strong> {saleDate}</p>
                            <p><strong>Total Amount:</strong> ${total.toFixed(2)}</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleImport}
                            >
                                Import
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewDetails;

