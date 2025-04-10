import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarComponent from "./navbar";

const EditProviderForm = () => {
  const { pk_provider } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    provider_name: "",
    email: "",
    phone: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pk_provider) {
      setError("ID del proveedor no válido.");
      navigate("/providers");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado.");
      navigate("/");
      return;
    }

    fetch(`http://localhost:3000/api/providers/${pk_provider}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setError("No se encontraron datos del proveedor.");
          setLoading(false);
          return;
        }

        const provider = data[0];
        setFormData({
          provider_name: provider.provider_name || "",
          email: provider.email || "",
          phone: provider.phone || "",
          image: null, // No necesitamos manejar la imagen aquí
        });

        if (provider.image) {
          setPreviewImage(`http://localhost:3000/images/${provider.image}`);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del proveedor:", error);
        setError(error.message || "Error al cargar los datos.");
        setLoading(false);
      });
  }, [pk_provider, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prevData) => ({ ...prevData, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado.");
      return;
    }

    const formDataToSend = new FormData();
    if (formData.provider_name) {
      formDataToSend.append('provider_name', formData.provider_name);
    }
    if (formData.email) {
      formDataToSend.append("email", formData.email);
    }
    if (formData.phone) {
      formDataToSend.append("phone", formData.phone);
    }

    if (formData.image instanceof File) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/providers/${pk_provider}`, {
        method: pk_provider ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Error al actualizar el proveedor");
      alert("Proveedor actualizado correctamente");
      navigate("/providers");
    } catch (error) {
      console.error("Error al actualizar el proveedor:", error);
      alert("Hubo un error al intentar actualizar el proveedor.");
    }
  };

  if (loading) {
    return <div className="text-center">Cargando datos del proveedor...</div>;
  }

  return (
    <>
      <NavbarComponent />
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Editar Proveedor</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre del Proveedor</label>
            <input
              type="text"
              className="form-control"
              name="provider_name"
              value={formData.provider_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Imagen</label>
            <input type="file" className="form-control" name="image" onChange={handleChange} />
            {previewImage && (
              <img src={previewImage} alt="Vista previa" className="mt-2" style={{ width: "100px", height: "100px" }} />
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Actualizar Proveedor
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProviderForm;
