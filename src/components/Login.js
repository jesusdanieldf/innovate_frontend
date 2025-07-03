import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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

  const leftPanelStyle = {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    minHeight: '500px'
  };

  return (
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
                    <h1 className="h2 mb-4 fw-bold"> Innovate Group S.A.C </h1>
                    <p className="lead mb-0">"Made for you, thought big."</p>
                  </div>
                </div>
              </div>
                  
              {/* Right Panel - Login Form */}
              <div className="col-lg-6">
                <div className="p-5">
                  {showResetPassword ? (
                    <ResetPasswordRequest setShowResetPassword={setShowResetPassword} />
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <h1 className="h4 text-dark fw-bold">Welcome Back!</h1>
                        <p className="text-muted">Please sign in to your account</p>
                      </div>
                      
                      <form onSubmit={handleSubmit}>
                        {error && (
                          <div className="alert alert-danger mb-4" role="alert">
                            {error}
                          </div>
                        )}
                        
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label fw-semibold">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            id="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label fw-semibold">
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control form-control-lg"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
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
                        
                        <div className="d-grid mb-3">
                          <button
                            type="submit"
                            className="btn btn-dark btn-lg fw-bold"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Signing In...
                              </>
                            ) : (
                              'Sign In'
                            )}
                          </button>
                        </div>
                        
                        <div className="text-center">
                          <button
                            type="button"
                            className="btn btn-link text-decoration-none p-0"
                            onClick={() => setShowResetPassword(true)}
                          >
                            Forgot your password?
                          </button>
                        </div>
                      </form>
                    </>
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