import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Products = () => {
  const { filter } = useParams();  
  const [selectedFilter, setSelectedFilter] = useState(filter || 'all'); // Filtro inicial desde la URL
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);


//
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado.");
      return;
    }

    let url = "http://localhost:3000/api/customers";
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
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error al obtener los productos:", error));
  }, [selectedFilter]);

  const handleAddCustomer = () => {
    navigate('/add-customer');
  };

  const handleEditProduct = async (pk_product) => {
    alert(`Editar producto con ID: ${pk_product}`);
    navigate(`/edit-product/${pk_product}`);
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
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Hubo un error al intentar eliminar el producto.");
    }
  };


  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Gestión de Productos</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Inicio</Nav.Link>
              <Nav.Link href="/products">Productos</Nav.Link>
              <Nav.Link href="/employees">Empleados</Nav.Link>
            </Nav>
            <Button variant="outline-light">Cerrar sesión</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    <Nav variant="pills" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link href="/home">Active</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-1">Option 2</Nav.Link>
      </Nav.Item>
    </Nav>



      <div className="container mt-5">
        <h2 className="mb-4 text-center">Lista de clientes</h2>
        <Button className="mb-3" variant="primary" onClick={handleAddCustomer}>Agregar Nuevo Cliente</Button>
        {message && <div className="alert alert-warning text-center">{message}</div>}
        <table className="table table-hover table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th>Imagen</th>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Telefono</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.pk_customer} className="align-middle text-center">
                  <td><img src={`http://localhost:3000/images/${customer.image}`} alt={customer.customer_name} style={{ width: '100px', height: '100px' }} /></td>
                  <td>{customer.customer_name}</td>
                  <td>{customer.address}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.status ? "Activo" : "Inactivo"}</td>
                  <td>
                    
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
