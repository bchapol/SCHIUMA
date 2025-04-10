import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate} from "react-router-dom";  // Importamos useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import logo from '../logo.svg';


const Login= () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const user_employees = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://localhost:3000/api/user_employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      if (response.ok) {
        const token = data.token;
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
  
        const decoded = jwtDecode(token);
        navigate("/products");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error al conectar con el servidor: " + err);
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Lado Izquierdo - Login */}
      <div className="col-md-6 d-flex flex-column align-items-center justify-content-center bg-white p-5">
        <img
          src={logo}
          alt="Lotus Logo"
          style={{ width: "100px", marginBottom: "20px" }}
        />
        <h4 className="mb-4">Schiuma</h4>
        <p>Ingresa los datos solicitados</p>
        <form onSubmit={user_employees}>
        <input
          type="email"
          className="form-control mb-3"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          id="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-danger text-center">{error}</p>}
        <button
          className="btn btn-primary w-100 mb-2"
          style={{
            background: "linear-gradient(to right, #1E8A71, #CAE0BC)",
            border: "none",
          }}
        >
          Iniciar sesión
        </button>
        </form>
      </div>

      {/* Lado Derecho - Descripción */}
      <div
        className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white text-center"
        style={{
          background: "linear-gradient(to right, #1E8A71, #CAE0BC)",
          color: "#fff",
        }}
      >
        <div className="p-5">
          <h2 className="mb-4 fw-bold"></h2>
          <p>
          </p>
          <p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
