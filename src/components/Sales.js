import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/styleProducts.css";
import "../style/styleSales.css"; // Nuevo archivo de estilos para sales
import AddSale from "./AddSale";
import AddProductToSale from "./AddProductToSale";
import SaleDetailsModal from "./SaleDetailsModal";

function SalesManagement() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [totalSale, setTotalSale] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const salesPerPage = 10;

  // Función para obtener las ventas del backend
  const fetchSales = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/sales");
      const salesData = response.data;
      
      // Ordenar por ID descendente (más reciente primero)
      const sortedSales = salesData.sort((a, b) => b.id - a.id);
      
      // Verificar si cada venta tiene un pago asociado
      const salesWithPaymentStatusPromises = sortedSales.map(async sale => {
        try {
          const paymentResponse = await axios.get(`http://localhost:8080/api/payments/sale/${sale.id}`);
          return {
            ...sale,
            hasPayment: paymentResponse.data
          };
        } catch (error) {
          return {
            ...sale,
            hasPayment: false
          };
        }
      });

      const salesWithPaymentStatus = await Promise.all(salesWithPaymentStatusPromises);
      setSales(salesWithPaymentStatus);
      setFilteredSales(salesWithPaymentStatus);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    // Filtrar las ventas según la consulta de búsqueda
    if (searchQuery) {
      const filtered = sales.filter((sale) =>
        sale.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sale.user && sale.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredSales(filtered);
    } else {
      setFilteredSales(sales);
    }
    // Resetear a la primera página cuando se aplique un filtro
    setCurrentPage(1);
  }, [searchQuery, sales]);

  // Obtener las ventas que se deben mostrar en la página actual
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openAddProductModal = (sale) => {
    setSelectedSale(sale);
    setShowProductModal(true);
  };

  const openDetailsModal = (sale) => {
    setSelectedSale(sale);
    setShowDetailsModal(true);
  };

  const updateTotalSale = (total) => {
    setTotalSale(total);
  };

  // Función para manejar cuando se agrega una nueva venta
  const handleNewSale = (newSale) => {
    // Refrescar todos los datos para obtener la información más actualizada
    fetchSales();
    setShowSaleModal(false);
  };

  // Función para detectar cambios en los modales
  useEffect(() => {
    // Refrescar datos cuando se cierran los modales
    if (!showProductModal && !showDetailsModal && !showSaleModal) {
      const timeoutId = setTimeout(() => {
        fetchSales();
      }, 500); // Pequeño delay para asegurar que las operaciones se completaron
      
      return () => clearTimeout(timeoutId);
    }
  }, [showProductModal, showDetailsModal, showSaleModal]);

  const deleteSale = async (saleId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      try {
        await axios.delete(`http://localhost:8080/api/sales/${saleId}`);
        alert("Venta eliminada exitosamente.");
        // Actualizar el estado removiendo la venta eliminada
        setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));
      } catch (error) {
        console.error("Error al eliminar la venta:", error);
        alert("Error al eliminar la venta. Por favor, inténtalo de nuevo.");
      }
    }
  };

  // Determinar el número de páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredSales.length / salesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="sales-container">
      {/* Header Section */}
      <div className="sales-header">
        <div className="sales-header-content">
          <div className="sales-header-title">
            <h1 className="sales-title">
              <i className="bi bi-cart-check"></i>
              Gestión de Ventas
            </h1>
            <p className="sales-subtitle">Administra todas tus ventas y transacciones</p>
          </div>
          <div className="sales-header-stats">
            <span className="sales-count">
              {filteredSales.length} ventas
            </span>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="sales-controls">
        <div className="sales-search-section">
          <div className="sales-search-container">
            <i className="bi bi-search sales-search-icon"></i>
            <input
              type="text"
              className="sales-search-input"
              placeholder="Buscar por cliente o vendedor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="sales-add-button-section">
          <button 
            className="sales-add-btn"
            onClick={() => setShowSaleModal(true)}
          >
            <i className="bi bi-plus-circle"></i>
            Nueva Venta
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="sales-table-container">
        <div className="sales-table-card">
          <div className="sales-table-responsive">
            <table className="sales-table">
              <thead className="sales-table-header">
                <tr>
                  <th className="sales-table-th">
                    <i className="bi bi-hash"></i>ID
                  </th>
                  <th className="sales-table-th">
                    <i className="bi bi-person-badge"></i>Vendedor
                  </th>
                  <th className="sales-table-th">
                    <i className="bi bi-person"></i>Cliente
                  </th>
                  <th className="sales-table-th">
                    <i className="bi bi-envelope"></i>Email
                  </th>
                  <th className="sales-table-th">
                    <i className="bi bi-calendar3"></i>Fecha
                  </th>
                  <th className="sales-table-th">
                    <i className="bi bi-gear"></i>Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentSales.map((sale) => (
                  <tr key={sale.id} className="sales-table-row">
                    <td className="sales-table-td">
                      <span className="sales-id">#{sale.id}</span>
                    </td>
                    <td className="sales-table-td">
                      <div className="sales-user-info">
                        <div className="sales-user-icon">
                          <i className="bi bi-person-badge"></i>
                        </div>
                        <span className="sales-user-name">
                          {sale.user ? sale.user.fullName : "Desconocido"}
                        </span>
                      </div>
                    </td>
                    <td className="sales-table-td">
                      <div className="sales-client-info">
                        <div className="sales-client-icon">
                          <i className="bi bi-person"></i>
                        </div>
                        <span className="sales-client-name">{sale.client}</span>
                      </div>
                    </td>
                    <td className="sales-table-td">
                      <span className="sales-email-badge">{sale.email}</span>
                    </td>
                    <td className="sales-table-td">
                      <span className="sales-date-badge">
                        {new Intl.DateTimeFormat("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(new Date(sale.saleDate))}
                      </span>
                    </td>
                    <td className="sales-table-td">
                      <div className="sales-action-buttons">
                        <button
                          className="sales-action-btn sales-details-btn"
                          onClick={() => openDetailsModal(sale)}
                          title="Ver detalles"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        {sale.hasPayment ? (
                          <>
                            <button 
                              className="sales-action-btn sales-locked-btn" 
                              disabled
                              title="Venta pagada - bloqueada"
                            >
                              <i className="bi bi-lock"></i>
                            </button>
                            <button 
                              className="sales-action-btn sales-locked-btn" 
                              disabled
                              title="Venta pagada - bloqueada"
                            >
                              <i className="bi bi-lock"></i>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="sales-action-btn sales-add-product-btn"
                              onClick={() => openAddProductModal(sale)}
                              title="Agregar productos"
                            >
                              <i className="bi bi-plus-circle"></i>
                            </button>
                            <button
                              className="sales-action-btn sales-delete-btn"
                              onClick={() => deleteSale(sale.id)}
                              title="Eliminar venta"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </>
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
        <div className="sales-pagination-container">
          <nav aria-label="Navegación de páginas de ventas">
            <ul className="sales-pagination">
              <li className={`sales-page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="sales-page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>

              {pageNumbers.map((number) => (
                <li key={number} className={`sales-page-item ${number === currentPage ? 'active' : ''}`}>
                  <button
                    onClick={() => paginate(number)}
                    className="sales-page-link"
                  >
                    {number}
                  </button>
                </li>
              ))}

              <li className={`sales-page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                <button
                  className="sales-page-link"
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
      {filteredSales.length === 0 && (
        <div className="sales-empty-state">
          <div className="sales-empty-content">
            <i className="bi bi-cart-x sales-empty-icon"></i>
            <h4 className="sales-empty-title">No se encontraron ventas</h4>
            <p className="sales-empty-text">
              {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primera venta'}
            </p>
            {!searchQuery && (
              <button 
                className="sales-empty-add-btn"
                onClick={() => setShowSaleModal(true)}
              >
                <i className="bi bi-plus-circle"></i>
                Crear Primera Venta
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showSaleModal && (
        <AddSale
          setShowSaleModal={setShowSaleModal}
          updateSalesList={handleNewSale}
        />
      )}

      {showProductModal && selectedSale && (
        <AddProductToSale
          sale={selectedSale}
          setShowAddProductModal={setShowProductModal}
        />
      )}

      {showDetailsModal && selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          setShowDetailsModal={setShowDetailsModal}
          updateTotalSale={updateTotalSale}
        />
      )}
    </div>
  );
}

export default SalesManagement;