import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Importamos useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const user_employees = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const response = await fetch("http://localhost:3000/user_employees", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
            const errorText = await response.text(); // Ver la respuesta en caso de error
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();        

        if (response.ok) {
            console.log("Token:", data.token);  // Muestra el token en consola
            navigate('/comprobacion');  
            setIsAuthenticated(true);
            console.log("Usuario autenticado:", data.user);
        } else {
            setError(data.message);
        }
    }catch (err) {
        setError("Error al conectar con el servidor"+ err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4 bg-white rounded-4 shadow-lg login-box">
        <h3 className="text-center mb-4 fw-bold text-primary">Bienvenido</h3>
        <p className="text-center text-muted mb-4">Por favor, inicia sesión para continuar</p>
        
        <form onSubmit={user_employees}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Correo electrónico</label>
            <input
              type="email"
              className="form-control input-style"
              id="email"
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
            <input
              type="password"
              className="form-control input-style"
              id="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger text-center">{error}</p>}
          <button type="submit" className="btn btn-primary w-100 py-2 shadow-sm">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
