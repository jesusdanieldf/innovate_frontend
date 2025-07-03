import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
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
    <div className="container">
      <h1 className="text-center mb-4">Sales Management</h1>

      {/* Campo de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by client or user name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-3 text-end">
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowSaleModal(true)}
        >
          <i className="bi bi-plus-circle"></i> New Sale
        </button>
      </div>

      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Client</th>
            <th>Email</th>
            <th>Sale Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.user ? sale.user.fullName : "Unknown"}</td>
              <td>{sale.client}</td>
              <td>{sale.email}</td>
              <td>
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(sale.saleDate))}
              </td>
              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => openDetailsModal(sale)}
                >
                  <i className="bi bi-book"></i>
                </button>
                {sale.hasPayment ? (
                  <>
                    <button className="btn btn-secondary btn-sm me-2" disabled>
                      <i className="bi bi-lock"></i>
                    </button>
                    <button className="btn btn-secondary btn-sm me-2" disabled>
                      <i className="bi bi-lock"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => openAddProductModal(sale)}
                    >
                      <i className="bi bi-plus-circle"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => deleteSale(sale.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo;
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
              &raquo;
            </button>
          </li>
        </ul>
      </nav>

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