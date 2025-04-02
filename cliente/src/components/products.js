import React, { useEffect, useState } from "react";
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado.");
      return;
    }
    fetch("http://localhost:3000/api/products", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, 
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => setError(error.message));
  }, []);

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleEditProduct = (productId) => {
    // Redirigir a /addproduct con el ID como parte de la URL
    navigate(`/edit-product/${productId}`);
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
                    </Nav>
                    <Button variant="outline-light">Cerrar sesión</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        <div className="container mt-5">
            <h2 className="mb-4 text-center">Lista de Productos</h2>
            <Button className="mb-3" variant="primary" onClick={handleAddProduct}>Agregar Producto</Button>
            {message && <div className="alert alert-warning text-center">{message}</div>}
            <table className="table table-hover table-bordered">
                <thead className="table-dark text-center">
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Expiración</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Proveedor</th>
                      <th>Estado</th>
                      <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map(product => (
                            <tr key={product.pk_product} className="align-middle text-center">
                                <td>
                                    <img src={`http://localhost:3000/images/${product.image}`} alt={product.name} style={{ width: '100px', height: '100px' }} />
                                </td>
                                <td>{product.product_name}</td>
                                <td>{product.product_des}</td>
                                <td>{product.product_exp}</td>
                                <td>{product.category_name}</td>
                                <td>${product.price}</td>
                                <td>{product.stock}</td>
                                <td>{product.pk_provider}</td>
                                <td>{product.status ? "Activo" : "Inactivo"}</td>
                                <td>
                                  <button className="btn btn-warning btn-sm me-2 m-2" onClick={() => handleEditProduct(product.pk_product)}>Editar</button>
                                  <button className="btn btn-danger btn-sm m-2">Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">No hay productos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </>
);
};

export default Products;
