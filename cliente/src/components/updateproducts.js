import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductForm = () => {
    const { productId } = useParams(); // Obtiene el ID del producto de la URL
    const [formData, setFormData] = useState({
        fk_provider: "",
        fk_category: "",
        name: "",
        price: "",
        stock: "",
        description: "",
        image: ""
    });

    const [providers, setProviders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log("No hay token de autenticación.");
                window.location.href = "/login";
                return;
            }

            try {
                // Cargar proveedores
                const providerRes = await fetch("http://localhost:3000/api/providers", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (providerRes.ok) {
                    const providerData = await providerRes.json();
                    setProviders(Array.isArray(providerData) ? providerData : []);
                }

                // Cargar categorías
                const categoryRes = await fetch("http://localhost:3000/api/categories", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (categoryRes.ok) {
                    const categoryData = await categoryRes.json();
                    setCategories(Array.isArray(categoryData) ? categoryData : []);
                }

                // Si estamos en modo edición, obtener los datos del producto
                if (productId) {
                    const productRes = await fetch(`http://localhost:3000/api/products/${productId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (productRes.ok) {
                        const productData = await productRes.json();
                        setFormData(productData);
                    }
                }
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await fetch(`http://localhost:3000/api/products${productId ? `/${productId}` : ""}`, {
                method: productId ? "PUT" : "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formDataToSend
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(productId ? "Producto actualizado exitosamente" : "Producto agregado exitosamente");
            } else {
                setMessage(data.error || "Error al procesar la solicitud");
            }
        } catch (error) {
            setMessage("Error en la conexión con el servidor");
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">{productId ? "Editar Producto" : "Agregar Producto"}</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Proveedor</label>
                    <select name="fk_provider" className="form-control" value={formData.fk_provider} onChange={handleChange} required>
                        <option value="">Seleccione un proveedor</option>
                        {providers.map((provider) => (
                            <option key={provider.pk_provider} value={provider.pk_provider}>
                                {provider.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select name="fk_category" className="form-control" value={formData.fk_category} onChange={handleChange} required>
                        <option value="">Seleccione una categoría</option>
                        {categories.map((category) => (
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
                    <input type="file" name="image" className="form-control" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                    {formData.image && !formData.image.name && (
                        <div>
                            <img src={`http://localhost:3000/uploads/${formData.image}`} alt="Producto" className="img-thumbnail mt-2" width="100" />
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">
                    {productId ? "Actualizar Producto" : "Agregar Producto"}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
