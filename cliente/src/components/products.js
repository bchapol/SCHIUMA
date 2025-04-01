import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');

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

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Lista de Productos</h2>
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
                        <th>Imagen</th>
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
                                    {product.image && (
                                        <img 
                                            src={`http://localhost:3000/uploads/${product.image}`} 
                                            alt={product.name} 
                                            className="img-thumbnail" 
                                            width="50" 
                                        />
                                    )}
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
    );
};

export default ProductTable;
