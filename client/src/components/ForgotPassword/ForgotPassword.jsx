import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../actions/auth"; 
import "./ForgotPassword.css"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(forgotPassword(email));
      setMessage("Password reset link has been sent to your email.");
      setError("");
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Your Password</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit" className="reset-password-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
