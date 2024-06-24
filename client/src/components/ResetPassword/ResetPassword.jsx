import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../actions/auth"; 
import "./ResetPassword.css"; 

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(resetPassword(token, newPassword));
      setMessage("Password has been reset successfully.");
      setError("");
      setTimeout(() => {
        navigate("/Auth");
      }, 3000); 
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Set a New Password</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="newPassword">
          New Password:
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="reset-password-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
