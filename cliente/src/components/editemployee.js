import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        fk_role: '', // Aquí iría el rol
        currentPassword: '',
        newPassword: '',
        image: null, // Para imagen
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [roles, setRoles] = useState([]); // Para los roles
    const navigate = useNavigate();
    const { pk_employee } = useParams();

    // Cargar datos del empleado
    useEffect(() => {
        const fetchEmployeeData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No estás autenticado.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/employees/${pk_employee}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        fk_role: data.fk_role, // Asumimos que este es el ID del rol
                        image: data.image,
                    });
                } else {
                    setError("Error al obtener los datos del empleado.");
                }
            } catch (error) {
                setError('Error en la conexión con el servidor');
            }
        };

        fetchEmployeeData();
    }, [pk_employee]);

    // Cargar los roles disponibles
    useEffect(() => {
        const fetchRoles = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No estás autenticado.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/roles`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setRoles(data); // Asumimos que es un array de roles
                } else {
                    setError("Error al obtener los roles.");
                }
            } catch (error) {
                setError('Error en la conexión con el servidor');
            }
        };

        fetchRoles();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'image') {
            setFormData((prev) => ({
                ...prev,
                image: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
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
        formDataToSend.append('fk_role', formData.fk_role);
        formDataToSend.append('currentPassword', formData.currentPassword);
        formDataToSend.append('newPassword', formData.newPassword);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await fetch(`http://localhost:3000/api/employees/${pk_employee}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Empleado actualizado exitosamente');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    fk_role: '',
                    currentPassword: '',
                    newPassword: '',
                    image: null,
                });
            } else {
                setMessage(data.error || 'Error al actualizar el empleado');
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
            <h2>Editar empleado</h2>
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
                                alt="Empleado"
                                className="img-thumbnail mt-2"
                                width="100"
                            />
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Nombre del empleado</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Número telefónico</label>
                    <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                        name="fk_role"
                        className="form-control"
                        value={formData.fk_role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccionar rol</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Contraseña actual</label>
                    <input
                        type="password"
                        name="currentPassword"
                        className="form-control"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nueva contraseña</label>
                    <input
                        type="password"
                        name="newPassword"
                        className="form-control"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Actualizar empleado</button>
            </form>

            <button className="btn btn-secondary mt-3" onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default EmployeeForm;
