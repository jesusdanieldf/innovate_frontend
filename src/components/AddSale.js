import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function AddSale({ setShowSaleModal, fetchSales }) {
  const [client, setClient] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      console.error("No user found in localStorage");
      alert("Error: No se encontró información del usuario. Por favor, inicie sesión nuevamente.");
      setShowSaleModal(false);
    }
  }, [setShowSaleModal]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!client.trim()) {
      newErrors.client = "El nombre del cliente es requerido";
    }
    
    if (!email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El formato del email no es válido";
    }
    
    if (!user || !user.id) {
      newErrors.user = "No se encontró información del usuario";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const newSale = {
      client: client.trim(),
      email: email.trim().toLowerCase(),
      saleDate: new Date().toISOString().split('T')[0],
      user: { id: user.id },
      total: 0
    };

    console.log("Datos de nueva venta:", newSale);

    try {
      const response = await axios.post("http://localhost:8080/api/sales", newSale);
      console.log("Venta añadida exitosamente:", response.data);
      alert("¡Venta creada exitosamente!");
      
      // Limpiar formulario
      setClient("");
      setEmail("");
      setErrors({});
      
      // Cerrar modal
      setShowSaleModal(false);
      
      // Refrescar la lista completa
      if (fetchSales && typeof fetchSales === 'function') {
        await fetchSales();
      }
    } catch (error) {
      console.error("Error completo:", error);
      
      if (error.response) {
        console.error("Error al añadir venta:", error.response.data);
        console.error("Código de estado:", error.response.status);
        
        // Manejar errores específicos del servidor
        if (error.response.status === 400) {
          setErrors({ submit: error.response.data.message || 'Datos inválidos' });
        } else if (error.response.status === 409) {
          setErrors({ submit: 'Ya existe una venta con estos datos' });
        } else {
          alert(`Error al crear la venta: ${error.response.data.message || 'Error del servidor'}`);
        }
      } else if (error.request) {
        console.error("No se recibió respuesta:", error.request);
        alert("Error: No se pudo conectar con el servidor. Verifique su conexión a internet.");
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setShowSaleModal(false);
    }
  };

  const handleInputChange = (field, value) => {
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    if (field === 'client') {
      setClient(value);
    } else if (field === 'email') {
      setEmail(value);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
      <div className="modal fade show" style={{ display: "block", zIndex: 1050 }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-plus-circle me-2"></i>Add New Sale
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close" 
                onClick={handleClose}
                disabled={loading}
              />
            </div>
            <div className="modal-body">
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {errors.submit}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="user" className="form-label">
                    <i className="bi bi-person me-1"></i>User
                  </label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.user ? 'is-invalid' : ''}`}
                    id="user" 
                    value={user ? `${user.fullName} (${user.username || user.email || 'ID: ' + user.id})` : ""} 
                    placeholder="User information" 
                    readOnly 
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                  {errors.user && <div className="invalid-feedback">{errors.user}</div>}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="client" className="form-label">
                    <i className="bi bi-person-fill me-1"></i>Client *
                  </label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.client ? 'is-invalid' : ''}`}
                    id="client" 
                    value={client} 
                    onChange={(e) => handleInputChange('client', e.target.value)} 
                    placeholder="Enter client full name" 
                    required 
                    disabled={loading}
                    maxLength={100}
                  />
                  {errors.client && <div className="invalid-feedback">{errors.client}</div>}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="bi bi-envelope me-1"></i>Email *
                  </label>
                  <input 
                    type="email" 
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email" 
                    value={email} 
                    onChange={(e) => handleInputChange('email', e.target.value)} 
                    placeholder="Enter client email address" 
                    required 
                    disabled={loading}
                    maxLength={100}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Nota:</strong> Una vez creada la venta, podrás agregar productos desde la tabla principal usando el botón <i className="bi bi-plus-circle"></i>.
                </div>
                
                <div className="modal-footer px-0">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleClose}
                    disabled={loading}
                  >
                    <i className="bi bi-x me-1"></i>Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check me-1"></i>Add Sale
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddSale;