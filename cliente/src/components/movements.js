import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './navbar';



const Movements = () => {
  const [movements, setMovements] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No estás autenticado.");
        navigate("/")
        return;
      }
  
      fetch("http://localhost:3000/api/movements", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los movimientos");
          }
          return response.json();
        })
        .then((data) => setMovements(data))
        .catch((error) => setError(error.message));
    }, []);

  const handleAddSales = () => {
    navigate('/sales');
  };

  return (
    <>
      <NavbarComponent/>
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Lista de Movimientos</h2>
        <Button className="mb-3" variant="primary" onClick={handleAddSales}>Agregar salida</Button>
        {message && <div className="alert alert-warning text-center">{message}</div>}
        <table className="table table-hover table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th>Número de transacción</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Tipo</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {movements.length > 0 ? (
              movements.map((movement) => (
                <tr key={movement.num_transaction} className="align-middle text-center">
                <td>{movement.num_transaction}</td>
                  <td>{movement.date === "0000-00-00" ? "0000-00-00" : new Date(movement.date).toISOString().split('T')[0]}</td>
                  <td>{movement.product_name}</td>
                  <td>{movement.type_name}</td>
                  <td>{movement.quantity}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="text-center">No hay movimientos disponibles</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Movements;