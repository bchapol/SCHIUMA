import React, { useState } from "react";

const Comprobacion_token = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false); // Estado de verificacion del token

  const verificacionT = async (e) => {
    e.preventDefault();
    console.log("Token a verificar:", token);  // Envio de token a consola

    // Envio de comprobacion a la funcion para verificar en estilo json
    try {
      const response = await fetch("http://localhost:3000/verificacion-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),  
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Token verificado:", data);
        setIsVerified(true); // Si el status de la respuesta json es OK se envia a la pagina que el token ha sido verificado 
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
      <form onSubmit={verificacionT}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}  
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
