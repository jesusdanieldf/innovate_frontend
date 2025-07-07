import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/styleReports.css"; // Importar el CSS personalizado

function ReportsManagement() {
  const [activeTab, setActiveTab] = useState("caja-chica");
  const [reportData, setReportData] = useState([]);
  const [resumenData, setResumenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getWeekAgoDate = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return weekAgo.toISOString().split("T")[0];
  };

  useEffect(() => {
    setDateRange({
      startDate: getWeekAgoDate(),
      endDate: getCurrentDate()
    });
  }, []);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    setReportData([]);
    setResumenData(null);

    try {
      let response;

      switch (activeTab) {
        case "caja-chica":
          response = await axios.get("http://localhost:8080/api/reports/caja-today-detail");
          setReportData(
            response.data.map(item => ({
              id: item.paymentId,
              client: `${item.userFirstName} ${item.userLastName}`,
              email: item.email,
              amount: item.amount,
              paymentDate: item.paymentDate,
              type: 'user'
            }))
          );
          break;

        case "caja-semanal":
          response = await axios.get("http://localhost:8080/api/reports/semanal");
          setReportData(
            response.data.map(item => ({
              client: item.userFullName,
              totalPaid: item.totalPaid,
              firstPayment: item.minDate,
              lastPayment: item.maxDate,
              type: 'user'
            }))
          );
          break;

        case "caja-fechas":
          if (dateRange.startDate && dateRange.endDate) {
            const params = {
              start: `${dateRange.startDate}T00:00:00`,
              end: `${dateRange.endDate}T23:59:59`,
            };

            response = await axios.get("http://localhost:8080/api/reports/between", { params });
            setReportData(
              response.data.map(item => ({
                id: item.paymentId,
                client: item.client,
                userName: item.userName,
                email: item.email,
                amount: item.amount,
                paymentDate: item.paymentDate,
                type: 'client_user'
              }))
            );

            const resumenResponse = await axios.get("http://localhost:8080/api/reports/resumen", { params });
            const resumen = resumenResponse.data;

            const resumenAdapted = {
              totalAmount: resumen.totalAmount || 0,
              numPayments: resumen.totalPayments || 0,
              firstPayment: resumen.minDate || null,
              lastPayment: resumen.maxDate || null,
            };
            setResumenData(resumenAdapted);
          }
          break;

        default:
          setReportData([]);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al obtener los datos. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    fetchReportData();
    setCurrentPage(1);
  }, [fetchReportData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reportData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(reportData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount || 0);
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exportToCSV = () => {
    if (reportData.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    let headers, csvContent;

    if (activeTab === "caja-fechas") {
      headers = ["ID", "Cliente", "Usuario", "Email", "Monto", "Fecha de Pago"];
      csvContent = [
        headers.join(","),
        ...reportData.map(item => [
          item.id || "",
          `"${item.client || ""}"`,
          `"${item.userName || ""}"`,
          `"${item.email || ""}"`,
          item.amount || 0,
          `"${formatDate(item.paymentDate)}"`
        ].join(","))
      ].join("\n");
    } else {
      headers = ["ID", "Usuario", "Email", "Monto", "Fecha de Pago"];
      csvContent = [
        headers.join(","),
        ...reportData.map(item => [
          item.id || "",
          `"${item.client || ""}"`,
          `"${item.email || ""}"`,
          item.amount || item.totalPaid || 0,
          `"${formatDate(item.paymentDate || item.firstPayment)}"`
        ].join(","))
      ].join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_${activeTab}_${getCurrentDate()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTableHeaders = () => {
    switch (activeTab) {
      case "caja-chica":
        return ["ID", "Usuario", "Email", "Monto", "Fecha de Pago"];
      case "caja-semanal":
        return ["Usuario", "Total Pagado", "Primer Pago", "Último Pago", ""];
      case "caja-fechas":
        return ["ID", "Cliente", "Usuario", "Email", "Monto", "Fecha de Pago"];
      default:
        return ["ID", "Cliente", "Email", "Monto", "Fecha de Pago"];
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1 className="reports-title">
          <i className="fas fa-chart-line"></i>
          Reports Management
        </h1>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "caja-chica" ? "active" : ""}`}
            onClick={() => setActiveTab("caja-chica")}
          >
            <i className="fas fa-cash-register me-2"></i>
            Caja Chica (Hoy)
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "caja-semanal" ? "active" : ""}`}
            onClick={() => setActiveTab("caja-semanal")}
          >
            <i className="fas fa-calendar-week me-2"></i>
            Caja Semanal
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "caja-fechas" ? "active" : ""}`}
            onClick={() => setActiveTab("caja-fechas")}
          >
            <i className="fas fa-calendar-alt me-2"></i>
            Por Rango de Fechas
          </button>
        </li>
      </ul>

      {activeTab === "caja-fechas" && (
        <div className="date-controls">
          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label">
                <i className="fas fa-calendar-plus me-2"></i>
                Fecha Inicio:
              </label>
              <input
                type="date"
                className="form-control"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">
                <i className="fas fa-calendar-minus me-2"></i>
                Fecha Fin:
              </label>
              <input
                type="date"
                className="form-control"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange("endDate", e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-primary me-2"
                onClick={fetchReportData}
                disabled={loading}
              >
                <i className="fas fa-search me-2"></i>
                Buscar
              </button>
              <button
                className="btn btn-success"
                onClick={exportToCSV}
                disabled={reportData.length === 0}
              >
                <i className="fas fa-file-excel me-2"></i>
                Exportar CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "caja-fechas" && (
        <div className="export-section">
          <button
            className="btn btn-success"
            onClick={exportToCSV}
            disabled={reportData.length === 0}
          >
            <i className="fas fa-file-excel me-2"></i>
            Exportar CSV
          </button>
        </div>
      )}

      {activeTab === "caja-fechas" && resumenData && (
        <div className="resumen-card">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fas fa-chart-pie me-2"></i>
              Resumen del Periodo
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <div className="resumen-stat">
                  <strong>Total Ingresos:</strong>
                  <span className="stat-value text-success">
                    {formatCurrency(resumenData.totalAmount)}
                  </span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="resumen-stat">
                  <strong>Número de Pagos:</strong>
                  <span className="stat-value text-info">
                    {resumenData.numPayments}
                  </span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="resumen-stat">
                  <strong>Primer Pago:</strong>
                  <span className="text-muted">
                    {formatDate(resumenData.firstPayment)}
                  </span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="resumen-stat">
                  <strong>Último Pago:</strong>
                  <span className="text-muted">
                    {formatDate(resumenData.lastPayment)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span className="loading-text">Cargando datos...</span>
        </div>
      )}

      <div className="table-card">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                {getTableHeaders().map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item.id || index}>
                    {activeTab === "caja-chica" && (
                      <>
                        <td className="product-id">{item.id || "N/A"}</td>
                        <td>{item.client || "N/A"}</td>
                        <td>{item.email || "N/A"}</td>
                        <td className="text-success fw-bold">{formatCurrency(item.amount)}</td>
                        <td>{formatDate(item.paymentDate)}</td>
                      </>
                    )}
                    {activeTab === "caja-semanal" && (
                      <>
                        <td>{item.client || "N/A"}</td>
                        <td className="text-success fw-bold">{formatCurrency(item.totalPaid)}</td>
                        <td>{formatDate(item.firstPayment)}</td>
                        <td>{formatDate(item.lastPayment)}</td>
                        <td></td>
                      </>
                    )}
                    {activeTab === "caja-fechas" && (
                      <>
                        <td className="product-id">{item.id || "N/A"}</td>
                        <td>{item.client || "N/A"}</td>
                        <td>
                          <span className="badge bg-info">
                            {item.userName || "N/A"}
                          </span>
                        </td>
                        <td>{item.email || "N/A"}</td>
                        <td className="text-success fw-bold">{formatCurrency(item.amount)}</td>
                        <td>{formatDate(item.paymentDate)}</td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={getTableHeaders().length} className="text-center text-muted">
                    {loading ? (
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        Cargando datos...
                      </div>
                    ) : (
                      <div className="empty-state">
                        <i className="fas fa-inbox"></i>
                        <h4>No hay datos disponibles</h4>
                        <p>No se encontraron registros para mostrar</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pageNumbers.length > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </li>

            {pageNumbers.map((number) => (
              <li key={number} className={`page-item ${number === currentPage ? "active" : ""}`}>
                <button
                  onClick={() => paginate(number)}
                  className="page-link"
                >
                  {number}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === pageNumbers.length ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pageNumbers.length}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default ReportsManagement;