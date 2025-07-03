import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Products from "./Products";
import Sales from "./Sales";
import Users from "./Users";
import ProductRanking from "./ProductRanking";  
import ReportsManagement from "./ReportsManagement";



import "../style/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Estado del sidebar

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`sidebar bg-dark text-white shadow-lg d-flex flex-column ${isSidebarCollapsed ? "collapsed" : ""}`}
        id="sidebar"
      >
        {/* Botón para colapsar/expandir */}
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <i className={`bi ${isSidebarCollapsed ? "bi-list" : "bi-arrow-left"} fs-4`}></i>
          </button>
        </div>

        {/* Contenido del sidebar */}
        <div className="text-content px-3 py-2">
          <div className="text-center mb-4">
            <h5 className="fw-bold mb-1 fs-4">{user ? `${user.role.name}` : "Role"}</h5>
            <p className="fs-5">{user ? `${user.fullName} ${user.lastName}` : "User Name"}</p>
            <hr className="border-light" />
          </div>

          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <Link className="nav-link text-white d-flex align-items-center" to="/dashboard/products">
                <i className="bi bi-box-seam fs-4"></i>
                <span className={`ms-2 ${isSidebarCollapsed ? "d-none" : ""}`}>Products</span>
              </Link>
            </li>
            
            <li className="nav-item mb-3">
              <Link className="nav-link text-white d-flex align-items-center" to="/dashboard/sales">
                <i className="bi bi-receipt fs-4"></i>
                <span className={`ms-2 ${isSidebarCollapsed ? "d-none" : ""}`}>Sales</span>
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link className="nav-link text-white d-flex align-items-center" to="/dashboard/users">
                <i className="bi bi-person fs-4"></i>
                <span className={`ms-2 ${isSidebarCollapsed ? "d-none" : ""}`}>Users</span>
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link className="nav-link text-white d-flex align-items-center" to="/dashboard/product-ranking">
                <i className="bi bi-bar-chart fs-4"></i> {/* Nuevo ícono */}
                <span className={`ms-2 ${isSidebarCollapsed ? "d-none" : ""}`}>Ranking</span>
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link className="nav-link text-white d-flex align-items-center" to="/dashboard/ReportsManagement">
                <i className="bi bi-file-earmark-text fs-4"></i>
                <span className={`ms-2 ${isSidebarCollapsed ? "d-none" : ""}`}>Reports</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Botón de logout */}
        <div className="mt-auto px-3 pb-3">
          <button
            className="btn btn-danger w-100"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            {isSidebarCollapsed ? "" : "Logout"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content container-fluid ${isSidebarCollapsed ? "expanded-content" : ""}`} id="main-content">
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/users" element={<Users />} />
          <Route path="/product-ranking" element={<ProductRanking />} /> {/* Nueva ruta */}
          <Route path="/ReportsManagement" element={<ReportsManagement />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
