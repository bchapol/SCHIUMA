import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProviderForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        image: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { pk_provider } = useParams();

    useEffect(() => {
        const fetchProviderData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("No estás autenticado.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/providers/${pk_provider}`, {
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
                        image: data.image
                    });
                } else {
                    setError('Error al obtener el proveedor');
                }
            } catch (err) {
                setError('Error en la conexión con el servidor');
            }
        };

        fetchProviderData();
    }, [pk_provider]);

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
        if (formData.image && typeof formData.image !== 'string') {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await fetch(`http://localhost:3000/api/providers/${pk_provider}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Proveedor actualizado exitosamente');
                navigate('/providers');
            } else {
                setMessage(data.error || 'Error al actualizar proveedor');
            }
        } catch (err) {
            setMessage('Error en la conexión con el servidor');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Editar proveedor</h2>
            {message && <div className="alert alert-info">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="border p-4 rounded shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Imagen (opcional)</label>
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
                                    typeof formData.image === 'string'
                                        ? `http://localhost:3000/images/${formData.image}`
                                        : URL.createObjectURL(formData.image)
                                }
                                alt="Proveedor"
                                className="img-thumbnail mt-2"
                                width="100"
                            />
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">Nombre del proveedor</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar Proveedor</button>
            </form>
            <button className="btn btn-secondary mt-3" onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default EditProviderForm;
