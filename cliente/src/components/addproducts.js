import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const ProductForm = () => {
    const [formData, setFormData] = useState({
        fk_provider: '',
        fk_category: '',
        name: '',
        price: '',
        stock: '',
        description: '',
        image: ''
    });

    const [providers, setProviders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Obtención de proveedores
    useEffect(() => {
        const fetchProviders = async () => {
            const token = localStorage.getItem("token");
            console.log(token);
            if (!token) {
                setError("No estás autenticado.");
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/providers', {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setProviders(data);
                    } else {
                        console.error("Error: providers no es un array", data);
                    }
                } else {
                    console.error("Error en la solicitud de proveedores", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching providers:", error);
            }
        };
        fetchProviders();
    }, []);

    // Obtención de categorías
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("No estás autenticado.");
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setCategories(data);
                    } else {
                        console.error("Error: categories no es un array", data);
                    }
                } else {
                    console.error("Error en la solicitud de categorías", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? e.target.files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
    
        // Formatear expiration al formato YYYY/MM/DD
        const formattedExpiration = formData.expiration
            ? formData.expiration.split("-").join("/") // Convertir YYYY-MM-DD a YYYY/MM/DD
            : '';
    
        const formDataToSend = new FormData();
        formDataToSend.append('fk_provider', formData.fk_provider);
        formDataToSend.append('fk_category', formData.fk_category);
        formDataToSend.append('expiration', formattedExpiration); // Enviar la fecha formateada
        formDataToSend.append('name', formData.name);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('stock', formData.stock);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('image', formData.image);
        for (let pair of formDataToSend.entries()) {
            console.log(pair[0]+ ': ' + pair[1]);
        }
        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend,
            });
            const data = await response.json();
    
            if (response.ok) {
                setMessage('Producto agregado exitosamente');
                setFormData({
                    fk_provider: '',
                    fk_category: '',
                    name: '',
                    price: '',
                    stock: '',
                    description: '',
                    image: '',
                    expiration: '', // Limpiar el campo expiration
                });
            } else {
                setMessage(data.error || 'Error al agregar el producto');
            }
        } catch (error) {
            setMessage('Error en la conexión con el servidor');
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem("token"); // Si usas token, lo eliminas aquí
        navigate("/"); // Te redirige al login
      };
    

    return (
        <>
            <div className='container-app'>
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#1E8A71' }} data-bs-theme="light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/" style={{ color: 'white' }}>
                        <img src="../images/logo_icono_bla.png" alt="Logo" width="40" height="35" className="d-inline-block align-text-top" />
                        SCHIUMA
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto nav nav-pills">
                            <li className="nav-item" style={{ margin: '0 15px' }}>
                                <a className="nav-link active" aria-current="page" href="/products" style={{ backgroundColor: 'white', color: '#1E8A71' }}>Productos</a>
                            </li>
                            <li className="nav-item" style={{ margin: '0 15px' }}>
                                <a className="nav-link" href="/customers" style={{ color: 'white' }}>Clientes</a>
                            </li>
                            <li className="nav-item" style={{ margin: '0 15px' }}>
                                <a className="nav-link" href="/providers" style={{ color: 'white' }}>Proveedores</a>
                            </li>
                            <li className="nav-item" style={{ margin: '0 15px' }}>
                                <a className="nav-link" href="/employees" style={{ color: 'white' }}>Empleados</a>
                            </li>
                            <li className="nav-item" style={{ margin: '0 15px' }}>
                                <a className="nav-link" href="#" style={{ color: 'white' }}>Salida</a>
                            </li>
                        </ul>
                        <div className="ms-auto">
                            <button className="btn btn-outline-light" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>

            <div className="container mt-5">
                <h2 className="mb-4">Agregar Producto</h2>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
                    <div className="mb-3">
                        <label className="form-label">Proveedor</label>
                        <select
                            name="fk_provider"
                            className="form-control"
                            value={formData.fk_provider}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un proveedor</option>
                            {providers.map(provider => (
                                <option key={provider.pk_provider} value={provider.pk_provider}>
                                    {provider.provider_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Categoría</label>
                        <select
                            name="fk_category"
                            className="form-control"
                            value={formData.fk_category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una categoría</option>
                            {categories.map(category => (
                                <option key={category.pk_category} value={category.pk_category}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Fecha de Expiración</label>
                        <input
                            type="DATE"
                            name="expiration"
                            className="form-control"
                            value={formData.expiration}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Precio</label>
                        <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Stock</label>
                        <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Imagen</label>
                        <input
                            type="file"
                            name="image"
                            className="form-control"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Agregar Producto</button>
                </form>
            </div>
        </>
    );
};

export default ProductForm;
