import React, { useState } from "react";
import axios from "axios";

const ResetPasswordRequest = ({ setShowResetPassword }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/reset-password", { email });
      setMessage("We have sent you a link to reset your password.");
      setLoading(false);
    } catch (error) {
      setError("Error sending reset password link.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        
        <div className="mb-3">
          <label htmlFor="reset-email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="reset-email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      </form>

      <button
        type="button"
        className="btn btn-link"
        onClick={() => setShowResetPassword(false)}
      >
        Back to Login
      </button>
    </div>
  );
};

export default ResetPasswordRequest;
