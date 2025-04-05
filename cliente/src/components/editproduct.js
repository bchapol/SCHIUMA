import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';

const ProductForm = () => {
    const { pk_product } = useParams(); // Obtiene el ID del producto de la URL
    const navigate = useNavigate();

    const [productCurrenly, setProductCurrenly] = useState({
        pk_product: '',
        product_image: '',
        product_name: '',
        product_description: '',
        product_expiration: '',
        pk_category: '',
        product_category: '',
        product_price: '',
        product_stock: '',
        pk_provider: '',
        product_provider: ''
        });
    const [providers, setProviders] = useState([]);
    const [categories, setCategories] = useState([]);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () =>{
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No estás autenticado.");
                return;
            }

            //PROVIDER FETCH
            try{
                const providerResponse = await fetch('http://localhost:3000/api/providers', {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if(providerResponse.ok){
                    const data = await providerResponse.json();
                    if (Array.isArray(data)) {
                        setProviders(data);
                    } else {
                        console.error("Error: providers no es un array", data);
                    }
                }else {
                    console.error("Error al realizar la solicitud de proveedores", providerResponse.statusText);
                }
            }catch (error) {
                console.error("Error fetching providers:", error);
            }

            
            //CATEGORIES

            try {
                const categoryResponse = await fetch('http://localhost:3000/api/categories', {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (categoryResponse.ok) {
                    const data = await categoryResponse.json();
                    if (Array.isArray(data)) {
                        setCategories(data);
                    } else {
                        console.error("Error: categories no es un array", data);
                    }
                } else {
                    console.error("Error en la solicitud de categorías", categoryResponse.statusText);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }

            //PRODUCT BY ID
            if(pk_product){
                try {
                    const productProduct = await fetch(`http://localhost:3000/api/products/${pk_product}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
        
                    if (productProduct.ok) {
                        const data = await productProduct.json();
                        if (Array.isArray(data) && data.length > 0) {
                            const product = data[0];
                            setProductCurrenly({
                                pk_product: product.pk_product,
                                product_image: product.image,
                                product_name: product.product_name,
                                product_description: product.product_des,
                                product_expiration: product.product_exp,
                                pk_category: product.pk_category,
                                product_category: product.category_name,
                                product_price: product.price,
                                product_stock: product.stock,
                                pk_provider: product.pk_provider,
                                product_provider: product.provider_name
                            });
                        } else {
                            console.error("Producto no encontrado o datos incorrectos");
                        }
                    } else {
                        console.error("Error al obtener los datos del producto", productProduct.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching product data:", error);
                }
            }else{
                console.error("No se encuentra el ID");
            }
        }
        fetchData();
    }, [pk_product]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'image') {
            setProductCurrenly((prev) => ({
                ...prev,
                product_image: files[0] // El nuevo archivo
            }));
        } else if (name === 'expiration') {
            setProductCurrenly((prev) => ({
                ...prev,
                product_expiration: value // Actualiza la fecha de expiración
            }));
        } else {
            setProductCurrenly((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };
    
    
    

   const handleSubmit = async (e) => {
    e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No estás autenticado.");
            return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append('fk_provider', productCurrenly.pk_provider);
        formDataToSend.append('fk_category', productCurrenly.pk_category);
        formDataToSend.append('name', productCurrenly.product_name);
        formDataToSend.append('expiration', productCurrenly.product_expiration);
        formDataToSend.append('price', productCurrenly.product_price);
        formDataToSend.append('stock', productCurrenly.product_stock);
        formDataToSend.append('description', productCurrenly.product_description);
        if (productCurrenly.product_image instanceof File) {
            formDataToSend.append('image', productCurrenly.product_image);
        }
        

        try {
            const response = await fetch(`http://localhost:3000/api/products${pk_product ? `/${pk_product}` : ''}`, {
                method: pk_product ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend,
            });
            const data = await response.json();

            if (response.ok) {
                setMessage('Producto actualizado exitosamente');
                setProductCurrenly({
                    pk_product: '',
                    product_image: '',
                    product_name: '',
                    product_description: '',
                    product_expiration: '',
                    pk_category: '',
                    product_category: '',
                    product_price: '',
                    product_stock: '',
                    pk_provider: '',
                    product_provider: ''
                });
            } else {
                setMessage(data.error || 'Error al agregar el producto');
            }
        } catch (error) {
            setMessage('Error en la conexión con el servidor');
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
                        <Button variant="outline-light">Cerrar sesión</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="container mt-5">

                <h2 className="mb-4"> Editar producto </h2>

                {message && <div className="alert alert-info">{message}</div>}
                <form  onSubmit={handleSubmit}  className="border p-4 rounded shadow-sm">

                    <div className="mb-3">
                        <label className="form-label">Imagen</label>
                        <input
                            type="file"
                            name="image"
                            className="form-control"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleChange}
                        />
                        {productCurrenly.product_image && (
                            <div>
                                <img 
                                    src={
                                        typeof productCurrenly.product_image === "string"
                                            ? `http://localhost:3000/images/${productCurrenly.product_image}`
                                            : URL.createObjectURL(productCurrenly.product_image) // Vista previa del archivo seleccionado
                                    } 
                                    alt="Producto" 
                                    className="img-thumbnail mt-2" 
                                    width="100" 
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" name="name" className="form-control" value={productCurrenly.product_name} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea name="description" className="form-control" value={productCurrenly.product_description} onChange={handleChange} required></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Fecha de Expiración</label>
                        <input
                            type="date"
                            name="expiration"
                            className="form-control"
                            value={
                                productCurrenly.product_expiration && !isNaN(new Date(productCurrenly.product_expiration)) // Verificar si la fecha es válida
                                    ? new Date(productCurrenly.product_expiration).toISOString().split('T')[0] // Convertir a formato adecuado si es válida
                                    : "" // Si es null o inválido, dejar el campo vacío
                            }
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Categoría</label>
                        <select
                            name="fk_category"
                            className="form-control"
                            value={productCurrenly.pk_category}
                            onChange={handleChange}
                            required
                        >
                        {categories.map(category => (
                                <option 
                                key={category.pk_category} 
                                value={category.pk_category}
                                defaultValue={category.pk_category === productCurrenly.pk_category}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Precio</label>
                        <input
                            type="number"
                            name="price"
                            className="form-control"
                            value={productCurrenly.product_price}  // Si formData.price es undefined, muestra una cadena vacía
                            onChange={handleChange}
                            required
                            step="0.01"  // Permite decimales
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Stock</label>
                        <input 
                        type="number"
                        name="stock" 
                        className="form-control" 
                        value={productCurrenly.product_stock} 
                        onChange={handleChange} 
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Proveedor</label>
                        <select
                        name="fk_provider"
                        className="form-control"
                        value={productCurrenly.pk_provider}
                        onChange={handleChange}
                        required
                        >
                            {providers.map(provider => (
                        <option 
                            key={provider.pk_provider} 
                            value={provider.pk_provider} 
                            defaultValue={provider.pk_provider === productCurrenly.pk_provider}
                        >
                            {provider.provider_name}
                        </option>
                    ))}
                        </select>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">{pk_product ? 'Actualizar Producto' : 'Agregar Producto'}</button>
                </form>
            </div>
        </>
    );
};

export default ProductForm;
