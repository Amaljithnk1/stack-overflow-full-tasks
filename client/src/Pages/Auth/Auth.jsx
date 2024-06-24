import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import icon from "../../assets/icon.png";
import AboutAuth from "./AboutAuth";
import { signup, login } from "../../actions/auth";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSwitch = () => {
    setIsSignup(!isSignup);
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    if (isSignup && !name) {
      setError("Please enter a name to continue.");
      return;
    }
    setError("incorrect email or password");

    if (isSignup) {
      dispatch(signup({ name, email, password }, navigate));
    } else {
      dispatch(login({ email, password }, navigate));
    }
  };

  return (
    <section className="auth-section">
      {isSignup && <AboutAuth />}
      <div className="auth-container-2">
        <img src={icon} alt="stack overflow" className="login-logo" />
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {isSignup && (
            <label htmlFor="name">
              <h4>Display Name</h4>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}
          <label htmlFor="email">
            <h4>Email</h4>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="password">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>Password</h4>
              {!isSignup && (
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </Link>
              )}
            </div>
            <input type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {isSignup && (
              <p style={{ color: "#666767", fontSize: "13px" }}>
                Password must contain at least eight<br />characters, including at least 1 letter and 1<br /> number.
              </p>
            )}
          </label>
          {isSignup && (
            <label htmlFor="check">
              <input type="checkbox" id="check" className="checkbox-input" />
              <p style={{ fontSize: "13px" }}>
                Opt-in to receive occasional,<br />product updates, user research invitations,<br />company announcements, and digests.
              </p>
            </label>
          )}
          <button type="submit" className="auth-btn">
            {isSignup ? "Sign up" : "Log in"}
          </button>
          {isSignup && (
            <p style={{ color: "#666767", fontSize: "13px" }}>
              By clicking "Sign up", you agree to our{" "}
              <span style={{ color: "#007ac6" }}>terms of <br />service</span>,
              <span style={{ color: "#007ac6" }}> privacy policy</span> and
              <span style={{ color: "#007ac6" }}> cookie policy</span>
            </p>
          )}
        </form>
        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            type="button"
            className="handle-switch-btn"
            onClick={handleSwitch}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </section>
  );
};

export default Auth;
