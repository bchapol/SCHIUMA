import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomerForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        rfc: '',
        address: '',
        image: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { pk_customer } = useParams();

    useEffect(() => {
        const fetchCustomerData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No estás autenticado.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/customers/${pk_customer}`, { 
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        rfc: data.rfc,
                        address: data.address,
                        image: data.image
                    });
                } else {
                    setError("Error al obtener el cliente.");
                }
            } catch (error) {
                setError('Error en la conexión con el servidor');
            }
        };

        fetchCustomerData();
    }, [pk_customer]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'image') {
            setFormData((prev) => ({
                ...prev,
                image: files[0]
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('rfc', formData.rfc);
        formDataToSend.append('address', formData.address);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await fetch(`http://localhost:3000/api/customers/${pk_customer}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Cliente actualizado exitosamente');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    rfc: '',
                    address: '',
                    image: ''
                });
            } else {
                setMessage(data.error || 'Error al actualizar el cliente');
            }
        } catch (error) {
            setMessage('Error en la conexión con el servidor');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // Redirige al login
    };

    return (
        <div className="container mt-5">
            <h2>Editar cliente</h2>
            {message && <div className="alert alert-info">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label">Imagen</label>
                    <input
                        type="file"
                        name="image"
                        className="form-control"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleChange}
                    />
                    {formData.image && (
                        <div>
                            <img
                                src={
                                    typeof formData.image === "string"
                                        ? `http://localhost:3000/images/${formData.image}`
                                        : URL.createObjectURL(formData.image)
                                }
                                alt="Cliente"
                                className="img-thumbnail mt-2"
                                width="100"
                            />
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">Nombre del cliente</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Número telefónico</label>
                    <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">RFC</label>
                    <input type="text" name="rfc" className="form-control" value={formData.rfc} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar cliente</button>
            </form>
            <button className="btn btn-secondary mt-3" onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default CustomerForm;
