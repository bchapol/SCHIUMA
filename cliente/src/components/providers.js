import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './navbar';

const Products = () => {
  const { filter } = useParams();  
  const [selectedFilter, setSelectedFilter] = useState(filter || 'all'); // Filtro inicial desde la URL
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);

  const [providers, setProviders] = useState([]);


//
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado.");
      navigate("/")
      return;
    }

    let url = "http://localhost:3000/api/providers";
    if (selectedFilter && selectedFilter !== 'all') {
      url += `/${selectedFilter}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProviders(data))
      .catch((error) => console.error("Error al obtener los productos:", error));
  }, [selectedFilter]);

  const handleAddCustomer = () => {
    navigate('/add-provider');
  };

  const handleEditProvider = async (pk_provider) => {
    console.log("ID enviado a navigate:", pk_provider); // Verifica que el ID es correcto
    if (!pk_provider) {
      console.error("El ID del proveedor es undefined");
      return;
    }

    navigate(`/edit-provider/${pk_provider}`);
};



  const DeleteProduct = async (pk_product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/products/${pk_product}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el producto");

      alert("Producto eliminado correctamente");
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Hubo un error al intentar eliminar el producto.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Si usas token, lo eliminas aquí
    navigate("/"); // Te redirige al login
  };


  return (
    <>
      <NavbarComponent/>

      <div className="container mt-5">
        <h2 className="mb-4 text-center">Lista de Provedores</h2>
        <Button className="mb-3" variant="primary" onClick={handleAddCustomer}>Agregar Nuevo Cliente</Button>
        {message && <div className="alert alert-warning text-center">{message}</div>}
        <table className="table table-hover table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th>Imagen</th>
              <th>Proveedor</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {providers.length > 0 ? (
              providers.map((provider) => (
                <tr key={provider.pk_provider} className="align-middle text-center">
                  <td><img src={`http://localhost:3000/images/${provider.image}`} alt={provider.provider_name} style={{ width: '100px', height: '100px' }} /></td>
                  <td>{provider.provider_name}</td>
                  <td>{provider.email}</td>
                  <td>{provider.phone}</td>
                  <td>{provider.status ? "Activo" : "Inactivo"}</td>
                  <td>
                  <button className="btn btn-warning btn-sm me-2 m-2" onClick={() => handleEditProvider(provider.pk_provider)}>Editar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="text-center">No hay información de los empleados disponible</td></tr>
            )}
          </tbody>
        </table>
      </div>


    </>
  );
};

//<button className="btn btn-warning btn-sm me-2 m-2" onClick={() => handleEditProduct(product.pk_product)}>Editar</button>
//<button className="btn btn-danger btn-sm m-2" onClick={() => DeleteProduct(product.pk_product)}>Eliminar</button>
export default Products;
