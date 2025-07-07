import React, { useEffect, useState } from "react";
import axios from "axios";
import AddProduct from "./AddProduct.js";
import EditProduct from "./EditProduct.js";
import TransferModal from "./TransferModal.js";
import "../style/styleProducts.css"; // Importar el archivo CSS

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
    <div className="products-container">
      {/* Header Section */}
      <div className="products-header">
        <div className="header-content">
          <div className="header-title">
            <h1 className="products-title">
              <i className="bi bi-box-seam"></i>
              Gestión de Productos
            </h1>
            <p className="products-subtitle">Administra tu inventario de productos</p>
          </div>
          <div className="header-stats">
            <span className="products-count">
              {filteredProducts.length} productos
            </span>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="products-controls">
        <div className="search-section">
          <div className="search-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar productos por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="add-button-section">
          <button 
            className="add-product-btn"
            onClick={() => setShowProductModal(true)}
          >
            <i className="bi bi-plus-circle"></i>
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="products-table-container">
        <div className="table-card">
          <div className="table-responsive">
            <table className="products-table">
              <thead className="table-header">
                <tr>
                  <th className="table-th">
                    <i className="bi bi-hash"></i>ID
                  </th>
                  <th className="table-th">
                    <i className="bi bi-box"></i>Producto
                  </th>
                  <th className="table-th">
                    <i className="bi bi-currency-dollar"></i>Precio
                  </th>
                  <th className="table-th">
                    <i className="bi bi-building"></i>Almacén
                  </th>
                  <th className="table-th">
                    <i className="bi bi-boxes"></i>Físico
                  </th>
                  <th className="table-th">
                    <i className="bi bi-calculator"></i>Total
                  </th>
                  <th className="table-th">
                    <i className="bi bi-gear"></i>Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id} className="table-row">
                    <td className="table-td">
                      <span className="product-id">#{product.id}</span>
                    </td>
                    <td className="table-td">
                      <div className="product-info">
                        <div className="product-icon">
                          <i className="bi bi-box"></i>
                        </div>
                        <span className="product-name">{product.name}</span>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="price-badge">${product.price}</span>
                    </td>
                    <td className="table-td">
                      <span className="amount-badge">{product.amount}</span>
                    </td>
                    <td className="table-td">
                      <span className="physical-badge">{product.physical || 0}</span>
                    </td>
                    <td className="table-td">
                      <span className="total-badge">
                        {(product.amount || 0) + (product.physical || 0)}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditClick(product)}
                          title="Editar producto"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="action-btn transfer-btn"
                          onClick={() => handleTransferClick(product)}
                          title="Transferir producto"
                        >
                          <i className="bi bi-arrow-left-right"></i>
                        </button>
                        {canDelete ? (
                          <button
                            className="action-btn delete-btn"
                            onClick={() => deleteProduct(product.id)}
                            title="Eliminar producto"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        ) : (
                          <button 
                            className="action-btn disabled-btn" 
                            disabled
                            title="Sin permisos"
                          >
                            <i className="bi bi-lock"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pageNumbers.length > 1 && (
        <div className="pagination-container">
          <nav aria-label="Navegación de páginas">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>

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

              <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pageNumbers.length}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <div className="empty-content">
            <i className="bi bi-box-seam empty-icon"></i>
            <h4 className="empty-title">No se encontraron productos</h4>
            <p className="empty-text">
              {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer producto'}
            </p>
            {!searchQuery && (
              <button 
                className="empty-add-btn"
                onClick={() => setShowProductModal(true)}
              >
                <i className="bi bi-plus-circle"></i>
                Agregar Primer Producto
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modals - Sin cambios */}
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