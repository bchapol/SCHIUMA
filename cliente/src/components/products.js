import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.log("No hay token de autenticación.");
                window.location.href = "/login";
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Datos obtenidos:", data);

                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setMessage("No hay productos disponibles.");
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setMessage('Error al cargar los productos');
            }
        };

        fetchProducts();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = "/login";
    };

    const handleAddProduct = () => {
        navigate('/addproduct');
    };

    const handleEditProduct = (id) => {
        navigate(`/edit-product/${id}`);
    };

    const handleDeleteProduct = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setProducts(products.filter(product => product.pk_product !== id));
            } else {
                console.error("Error al eliminar el producto");
            }
        } catch (error) {
            console.error("Error en la solicitud de eliminación:", error);
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
                        </Nav>
                        <Button variant="outline-light" onClick={handleLogout}>Cerrar sesión</Button>
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
                            <th>ID</th>
                            <th>Proveedor</th>
                            <th>Categoría</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map(product => (
                                <tr key={product.pk_product} className="align-middle text-center">
                                    <td>{product.pk_product}</td>
                                    <td>{product.fk_provider}</td>
                                    <td>{product.fk_category}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.description}</td>
                                    <td>
                                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditProduct(product.pk_product)}>Editar</Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product.pk_product)}>Eliminar</Button>
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

export default ProductTable;
