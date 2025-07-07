import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdatePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtener el correo desde la URL
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Verificar si las contraseñas coinciden
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    } else {
      setConfirmPasswordError("");
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/update-password", {
        email,
        newPassword,
      });

      setSuccessMessage(response.data);
      setErrorMessage("");
      setLoading(false);
      // Redirigir al login después de 2 segundos
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage(error.response.data || "Failed to update password.");
      setSuccessMessage("");
      setLoading(false);
    }
  };

  const leftPanelStyle = {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    minHeight: '500px'
  };

  return (
    <div className="container-fluid" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-xl-10 col-lg-12 col-md-9">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-0">
              <div className="row g-0">
                {/* Left Panel - Hidden on mobile */}
                <div className="col-lg-6 d-none d-lg-block">
                  <div 
                    className="d-flex align-items-center justify-content-center text-muted rounded-start"
                    style={leftPanelStyle}
                  >
                    <div className="text-center p-4">
                      <div className="mb-4">
                        <i className="fas fa-lock" style={{ fontSize: '4rem', color: '#1976d2' }}></i>
                      </div>
                      <h1 className="h2 mb-4 fw-bold text-primary">Secure Password Update</h1>
                      <p className="lead mb-0">Create a strong new password for your account</p>
                    </div>
                  </div>
                </div>
                    
                {/* Right Panel - Update Password Form */}
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center mb-4">
                      <h1 className="h4 text-dark fw-bold">Update Password</h1>
                      <p className="text-muted">Please enter your new password</p>
                      {email && (
                        <p className="text-muted small">
                          <strong>Email:</strong> {email}
                        </p>
                      )}
                    </div>
                    
                    <form onSubmit={handlePasswordUpdate}>
                      {successMessage && (
                        <div className="alert alert-success mb-4" role="alert">
                          <i className="fas fa-check-circle me-2"></i>
                          {successMessage}
                        </div>
                      )}
                      
                      {errorMessage && (
                        <div className="alert alert-danger mb-4" role="alert">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          {errorMessage}
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label fw-semibold">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          id="newPassword"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        {passwordError && (
                          <div className="alert alert-warning mt-2 py-2" role="alert">
                            <small>{passwordError}</small>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label fw-semibold">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          id="confirmPassword"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        {confirmPasswordError && (
                          <div className="alert alert-warning mt-2 py-2" role="alert">
                            <small>{confirmPasswordError}</small>
                          </div>
                        )}
                      </div>

                      <div className="d-grid mb-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg fw-bold"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Updating Password...
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </button>
                      </div>
                      
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-link text-decoration-none p-0"
                          onClick={() => navigate("/login")}
                        >
                          Back to Login
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;