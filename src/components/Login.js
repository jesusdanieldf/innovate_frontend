import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../style/styleLogin.css"; 
import axios from "axios";
import ResetPasswordRequest from "./ResetPasswordRequest";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", { email, password });
      if (response && response.data) {
        onLogin({
          id: response.data.id,
          fullName: response.data.fullName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role,
        });
        setLoading(false);
      } else {
        setError("Invalid credentials");
        setLoading(false);
      }
    } catch (error) {
      setError("Error during login, please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center login-container">
      <div className="col-xl-10 col-lg-12 col-md-9">
        <div className="card border-0 shadow-lg login-card">
          <div className="card-body p-0">
            <div className="row g-0">
              {/* Left Panel - Hidden on mobile */}
              <div className="col-lg-6 d-none d-lg-block">
                <div className="d-flex align-items-center justify-content-center text-white rounded-start login-left-panel">
                  <div className="login-overlay"></div>
                  <div className="text-center p-4 login-content">
                    <div className="mb-4">
                      <div className="login-logo">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <h1 className="h2 mb-4 fw-bold">Innovate Group S.A.C</h1>
                    <p className="lead mb-4 opacity-75">"Made for you, thought big."</p>
                    <div className="d-flex justify-content-center gap-3">
                      <div className="login-tag">Innovation</div>
                      <div className="login-tag">Excellence</div>
                      <div className="login-tag">Growth</div>
                    </div>
                  </div>
                </div>
              </div>
                  
              {/* Right Panel - Login Form */}
              <div className="col-lg-6">
                <div className="p-5">
                  {showResetPassword ? (
                    <ResetPasswordRequest setShowResetPassword={setShowResetPassword} />
                  ) : (
                    <div className="login-form-container">
                      <div className="text-center mb-5">
                        <h1 className="h3 text-dark fw-bold mb-2">Welcome Back!</h1>
                        <p className="text-muted">Please sign in to your account</p>
                      </div>
                      
                      <form onSubmit={handleSubmit}>
                        {error && (
                          <div className="alert login-error-alert mb-4" role="alert">
                            <div className="d-flex align-items-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              {error}
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <label htmlFor="email" className="form-label fw-semibold text-dark mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="form-control form-control-lg login-input"
                            id="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="password" className="form-label fw-semibold text-dark mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control form-control-lg login-input"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <div className="form-check">
                            <input 
                              className="form-check-input login-checkbox" 
                              type="checkbox" 
                              id="rememberMe"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="form-check-label text-muted" htmlFor="rememberMe">
                              Remember me
                            </label>
                          </div>
                        </div>
                        
                        <div className="d-grid mb-4">
                          <button
                            type="submit"
                            className="btn btn-lg fw-bold text-white login-button"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2 login-spinner" role="status" aria-hidden="true"></span>
                                Signing In...
                              </>
                            ) : (
                              <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                                  <path d="M15 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <polyline points="10,17 15,12 10,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Sign In
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="text-center">
                          <button
                            type="button"
                            className="btn btn-link text-decoration-none p-0 fw-semibold login-forgot-link"
                            onClick={() => setShowResetPassword(true)}
                          >
                            Forgot your password?
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;