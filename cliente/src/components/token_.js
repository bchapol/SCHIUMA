import React, { useState } from "react";

const Comprobacion_token = () => {
  const [token, setToken] = useState("");  // Mantén el estado vacío, sin usar el token
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false); // Estado para controlar si el token está verificado

/* prueba */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Token a verificar:", token);  // El token sigue en consola, sin estar en el input

    try {
      const response = await fetch("http://localhost:3000/verificacion-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),  // Usamos el token que está en el estado
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Token verificado:", data);// Se muestra en la consola
        setIsVerified(true); // Marcamos el token como verificado
      } else {
        setError("Token inválido o expirado.");
      }
    } catch (err) {
      console.error("Error al conectar:", err);
      setError("Error al conectar con el servidor: " + err.message);
    }
  };

  return (
    <div>
      <h3>Ingresa el Token de Verificación</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}  // El token se mantiene en el estado pero no se pasa directamente en el formulario
          placeholder="Ingrese su token"
        />
        <button type="submit">Verificar Token</button>
      </form>
      <br></br>
      {error && <p>{error}</p>}
      {isVerified && <p style={{ color: "black" }}>Token verificado</p>}
    </div>
  );
};

export default Comprobacion_token;
