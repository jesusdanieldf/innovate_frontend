import React, { useEffect, useState } from "react";
import axios from "axios";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import TransferModal from "./TransferModal.js";


function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State to show edit modal
  const [productToEdit, setProductToEdit] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null); // Store authenticated user
  const [searchQuery, setSearchQuery] = useState(""); // State for search term

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [productToTransfer, setProductToTransfer] = useState(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Number of products per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        setProducts(response.data);
        setFilteredProducts(response.data); // Set filtered products on load
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // Get authenticated user
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setLoggedInUser(storedUser);

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products); // If no query, show all products
    }
  }, [searchQuery, products]); // Execute when search or products change

  // Get products to display on current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteProduct = async (id) => {
  // Mensaje de confirmación antes de eliminar
  const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.");
  
  if (!isConfirmed) {
    return; // Si el usuario cancela, no hacer nada
  }

  try {
    await axios.delete(`http://localhost:8080/api/products/${id}`);
    const filteredProducts = products.filter((product) => product.id !== id);
    setProducts(filteredProducts);
    setFilteredProducts(filteredProducts);
    
    // Mensaje de éxito después de eliminar
    alert("¡Producto eliminado correctamente!");
  } catch (error) {
    console.error("Error deleting product:", error);
    // Mensaje de error si algo sale mal
    alert("Error al eliminar el producto. Inténtalo de nuevo.");
  }
};

  const addProductToList = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setFilteredProducts((prevProducts) => [...prevProducts, newProduct]); // Also add to filtered products
  };

  const handleEditClick = (product) => {

    setProductToEdit(product);
    setShowEditModal(true);
  };
  const handleTransferClick = (product) => {
    setProductToTransfer(product);
    
    setShowTransferModal(true);
  };

  const handleTransfer = async (productId, transferType, quantity) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/products/transfer/${productId}`, {
        transferType,
        quantity
      });

      const updatedProducts = products.map(product =>
        product.id === productId ? response.data : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setShowTransferModal(false);
    } catch (error) {
      console.error("Error transferring product:", error);
      alert("Error during transfer");
    }
  };

  // Check permissions for deletion
  const canDelete = loggedInUser && loggedInUser.role.name !== "Employee";

  // Determine number of pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">Product Management</h1>

      {/* Search field */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by product name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search term
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-outline-primary" onClick={() => setShowProductModal(true)}>
          <i className="bi bi-plus-circle"></i> Add New Product
        </button>
      </div>

      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Storehouse</th>
            <th>Physical </th> 
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.amount}</td>
              <td>{product.physical || 0}</td>
              <td>{(product.amount || 0) + (product.physical || 0)}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditClick(product)}
                >
                  <i className="bi bi-pencil"></i> {/* Pencil */}
                </button>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => handleTransferClick(product)}
                >
                  <i className="bi bi-arrow-left-right"></i>
                </button>
                {canDelete ? (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <i className="bi bi-trash"></i> {/* Trash */}
                  </button>
                ) : (
                  <button className="btn btn-secondary btn-sm" disabled>
                    <i className="bi bi-lock"></i> {/* Lock */}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {/* Previous arrow */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; {/* Left arrow */}
            </button>
          </li>

          {/* Page numbers */}
          {pageNumbers.map((number) => (
            <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
              <button
                onClick={() => paginate(number)}
                className="page-link"
              >
                {number}
              </button>
            </li>
          ))}

          {/* Next arrow */}
          <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
            >
              &raquo; {/* Right arrow */}
            </button>
          </li>
        </ul>
      </nav>

      {showProductModal && (
        <AddProduct
          setShowProductModal={setShowProductModal}
          addProductToList={addProductToList}
        />
      )}

      {showEditModal && (
        <EditProduct
          product={productToEdit}
          setShowEditModal={setShowEditModal}
          setProducts={setProducts}
        />
      )}
      {showTransferModal && (
        <TransferModal
          product={productToTransfer}
          setShowTransferModal={setShowTransferModal}
          onTransfer={handleTransfer}
        />
      )}
    </div>
  );
}

export default Products;
