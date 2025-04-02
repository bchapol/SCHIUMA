import React, { useState, useEffect } from 'react';

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
    const [categories, setCategories] = useState([]);  // Asegúrate de que categories sea un array
    const [message, setMessage] = useState('');

    // Fetch providers from API
    useEffect(() => {
        const fetchProviders = async () => {
            const token = localStorage.getItem('token');  // Obtener el token de localStorage

            if (!token) {
                console.log("No hay token de autenticación.");
                // Redirigir al login si no hay token
                window.location.href = "/login";
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/providers', {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Enviar el token en la cabecera
                    }
                });

                // Leer solo una vez la respuesta
                if (response.ok) {
                    const data = await response.json();  // Solo leer una vez
                    // Asegurarse de que la respuesta es un array de proveedores
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
    }, []);  // El hook se ejecuta una sola vez al cargar el componente

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');  // Obtener el token de localStorage

            if (!token) {
                console.log("No hay token de autenticación.");
                // Redirigir al login si no hay token
                window.location.href = "/login";
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Enviar el token en la cabecera
                    }
                });

                // Leer solo una vez la respuesta
                if (response.ok) {
                    const data = await response.json();  // Solo leer una vez
                    // Asegurarse de que la respuesta es un array de categorías
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
    }, []);  // El hook se ejecuta una sola vez al cargar el componente

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
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
                    image: ''
                });
            } else {
                setMessage(data.error || 'Error al agregar el producto');
            }
        } catch (error) {
            setMessage('Error en la conexión con el servidor');
        }
    };

    return (
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
                                {provider.name}
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
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map(category => (
                                <option key={category.pk_category} value={category.pk_category}>
                                    {category.name}
                                </option>
                            ))
                        ) : (
                            <option>No hay categorías disponibles</option>
                        )}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
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
    );
};

export default ProductForm;
