// src/pages/Register.jsx
import "../App.css";
import "./Login.css";
import "./Register.css";

import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="login-page register-page slide-right">
      <div className="login-container">
        {/* Card à ESQUERDA */}
        <div className="login-right register-card">
          <div className="login-card">
            <h2>Create your account</h2>
            <p className="subtitle">Join the collaborative learning community</p>

            <form>
              {/* Full name */}
              <div className="field-group">
                <label>Full name</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <i className="fa-solid fa-user"></i>
                  </span>
                  <input type="text" placeholder="name" />
                </div>
              </div>

              {/* Email */}
              <div className="field-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    placeholder="student@university.pt"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                  <input type="password" placeholder="••••••••••" />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="field-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                  <input type="password" placeholder="••••••••••" />
                </div>
              </div>

              {/* Terms */}
              <div className="terms-row">
                <label>
                  <input type="checkbox" />
                  <span>I accept the terms and the conditions</span>
                </label>
              </div>

              {/* Botão Sign up */}
              <button type="submit" className="primary-button">
                Sign up
              </button>

              {/* Link para login */}
              <p className="create-account">
                Already have an account?{" "}
                <Link to="/login" className="link-button">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* BLOCO LARANJA à DIREITA */}
        <div className="login-left register-orange">
          <div className="logo">
            <div className="logo-icon">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <span className="logo-text">CollabExercises</span>
          </div>

          <div className="welcome-text register-text">
            <h1>Create account!</h1>
            <p>Join the community and start collabing!</p>

            <ul className="register-benefits">
              <li>
                <i className="fa-solid fa-check"></i>
                <span>Access thousands of exercises</span>
              </li>
              <li>
                <i className="fa-solid fa-check"></i>
                <span>Collaborate with other students</span>
              </li>
              <li>
                <i className="fa-solid fa-check"></i>
                <span>Share your solutions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
