import React, { useState } from "react";
import axios from "axios";

function AddProduct({ setShowProductModal, addProductToList }) {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [physical, setPhysical] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      name: productName,
      price: parseFloat(price),
      amount: parseInt(amount),
      physical: parseInt(physical) || 0, // Default to 0 if empty
    };

    try {
      const response = await axios.post("http://localhost:8080/api/products", newProduct);
      setProductName("");
      setPrice("");
      setAmount("");
      setPhysical("");
      setSuccessMessage("Product added successfully!");
      addProductToList(response.data); // Add the newly created product to the list
      
      // Auto-close modal after 1.5 seconds
      setTimeout(() => {
        setShowProductModal(false);
      }, 1500);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    }
  };

  return (
    <>
      {/* Modal backdrop */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
      <div className="modal fade show" style={{ display: "block", zIndex: 1050 }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Product</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowProductModal(false)}
              />
            </div>
            <div className="modal-body">
              {successMessage && (
                <div className="alert alert-success mb-3">
                  {successMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="amount" className="form-label">Amount (Warehouse)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter warehouse amount"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="physical" className="form-label">Physical (Store)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="physical"
                        value={physical}
                        onChange={(e) => setPhysical(e.target.value)}
                        placeholder="Enter store amount (optional)"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">Add Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProduct;