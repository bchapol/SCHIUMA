import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from './navbar';

const ProductForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        fk_role: '',
        password: '',
        image: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);

    // Obtención de roles
    useEffect(() => {
        const fetchRoles = async () => {
            const token = localStorage.getItem("token");
            console.log(token);
            if (!token) {
                setError("No estás autenticado.");
                navigate("/")
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/roles', {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setRoles(data);
                    } else {
                        console.error("Error: roles no es un array", data);
                    }
                } else {
                    console.error("Error en la solicitud de roles", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
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
    
    
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('fk_role', formData.fk_role);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('image', formData.image);
        for (let pair of formDataToSend.entries()) {
            console.log(pair[0]+ ': ' + pair[1]);
        }
        try {
            const response = await fetch('http://localhost:3000/api/employees', {
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
                    name: '',
                    email: '',
                    phone: '',
                    fk_role: '',
                    password: '',
                    image: ''
                });
            } else {
                setMessage(data.error || 'Error al agregar al empleado');
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
           <NavbarComponent/>

            <div className="container mt-5">
                <h2 className="mb-4">Agregar nuevo empleado</h2>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
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
                    <div className="mb-3">
                        <label className="form-label">Nombre completo</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Correo electronico</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Número de teléfono</label>
                        <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Roles</label>
                        <select
                            name="fk_role"
                            className="form-control"
                            value={formData.fk_role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un proveedor</option>
                            {roles.map(role => (
                                <option key={role.pk_role} value={role.pk_role}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña del usuario empleado</label>
                        <input type="text" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Agregar Producto</button>
                </form>
            </div>
        </>
    );
};

export default ProductForm;
