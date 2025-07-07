import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Products from "./Products";
import Sales from "./Sales";
import Users from "./Users";
import ProductRanking from "./ProductRanking";  
import ReportsManagement from "./ReportsManagement";

import "../style/styleDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebarOverlay, setShowSidebarOverlay] = useState(false);
  
  // Hook para obtener la ubicación actual
  const location = useLocation();

  // Mapeo de rutas a nombres de secciones
  const getSectionName = () => {
    const path = location.pathname;
    const sectionMap = {
      '/dashboard/products': 'Products',
      '/dashboard/sales': 'Sales',
      '/dashboard/users': 'Users',
      '/dashboard/product-ranking': 'Product Ranking',
      '/dashboard/ReportsManagement': 'Reports Management'
    };
    
    return sectionMap[path] || 'Dashboard';
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Detectar el tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // En móvil, mantener sidebar cerrado por defecto
      if (mobile) {
        setIsSidebarCollapsed(true);
        setShowSidebarOverlay(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    if (isMobile) {
      // En móvil, mostrar/ocultar sidebar con overlay
      setIsSidebarCollapsed(!isSidebarCollapsed);
      setShowSidebarOverlay(!isSidebarCollapsed);
    } else {
      // En desktop, solo colapsar
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
      setShowSidebarOverlay(false);
    }
  };

  const handleNavClick = () => {
    // Cerrar sidebar al hacer clic en navegación en móvil
    if (isMobile) {
      closeSidebarOnMobile();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Overlay para móviles */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${showSidebarOverlay ? 'active' : ''}`}
          onClick={closeSidebarOnMobile}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-modern ${isSidebarCollapsed ? "collapsed" : ""}`}
        id="sidebar"
      >
        {/* Decorative gradient bar */}
        <div className="sidebar-gradient-bar"></div>
        
        {/* Header Section */}
        <div className="sidebar-header">
          <div className="collapse-toggle">
            <button
              className="btn-toggle-modern"
              onClick={toggleSidebar}
              aria-label={isSidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              <i className={`bi ${isSidebarCollapsed ? "bi-list" : "bi-arrow-left"}`}></i>
            </button>
            {!isSidebarCollapsed && (
              <div className="user-avatar">
                <span>{user?.fullName?.charAt(0) || "U"}</span>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <div className="user-info">
              <div className="role-badge">
                {user ? user.role.name : "Role"}
              </div>
              <h5 className="user-name">
                {user ? `${user.fullName} ${user.lastName}` : "User Name"}
              </h5>
              <div className="divider-gradient"></div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <Link 
            className="nav-item-modern products" 
            to="/dashboard/products"
            onClick={handleNavClick}
            aria-label="Productos"
          >
            <div className="nav-icon">
              <i className="bi bi-box-seam"></i>
            </div>
            <span className={`nav-label ${isSidebarCollapsed ? "d-none" : ""}`}>Products</span>
            <div className="nav-indicator"></div>
          </Link>
          
          <Link 
            className="nav-item-modern sales" 
            to="/dashboard/sales"
            onClick={handleNavClick}
            aria-label="Ventas"
          >
            <div className="nav-icon">
              <i className="bi bi-receipt"></i>
            </div>
            <span className={`nav-label ${isSidebarCollapsed ? "d-none" : ""}`}>Sales</span>
            <div className="nav-indicator"></div>
          </Link>

          <Link 
            className="nav-item-modern users" 
            to="/dashboard/users"
            onClick={handleNavClick}
            aria-label="Usuarios"
          >
            <div className="nav-icon">
              <i className="bi bi-person"></i>
            </div>
            <span className={`nav-label ${isSidebarCollapsed ? "d-none" : ""}`}>Users</span>
            <div className="nav-indicator"></div>
          </Link>

          <Link 
            className="nav-item-modern ranking" 
            to="/dashboard/product-ranking"
            onClick={handleNavClick}
            aria-label="Ranking"
          >
            <div className="nav-icon">
              <i className="bi bi-bar-chart"></i>
            </div>
            <span className={`nav-label ${isSidebarCollapsed ? "d-none" : ""}`}>Ranking</span>
            <div className="nav-indicator"></div>
          </Link>

          <Link 
            className="nav-item-modern reports" 
            to="/dashboard/ReportsManagement"
            onClick={handleNavClick}
            aria-label="Reportes"
          >
            <div className="nav-icon">
              <i className="bi bi-file-earmark-text"></i>
            </div>
            <span className={`nav-label ${isSidebarCollapsed ? "d-none" : ""}`}>Reports</span>
            <div className="nav-indicator"></div>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button
            className="btn-logout-modern"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
          >
            <i className="bi bi-box-arrow-right"></i>
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content-modern ${isSidebarCollapsed ? "expanded" : ""}`}>
        {/* Top Header Bar */}
       

        {/* Routes Content */}
        <main className="content-area">
          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/users" element={<Users />} />
            <Route path="/product-ranking" element={<ProductRanking />} />
            <Route path="/ReportsManagement" element={<ReportsManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;