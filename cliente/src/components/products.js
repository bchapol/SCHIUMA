import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Products = () => {
  const { filter } = useParams();  
  const [selectedFilter, setSelectedFilter] = useState(filter || 'all'); // Filtro inicial desde la URL
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

const [showModal, setShowModal] = useState(false);
const [stockAmount, setStockAmount] = useState(1);
const [selectedProduct, setSelectedProduct] = useState({});
const [initialStock, setInitialStock] = useState(0);

const handleShowModal = (product) => {
  setSelectedProduct(product);
  setInitialStock(product.stock);
  setStockAmount(product.stock);
  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);
};

const increaseStock = () => {
  setStockAmount((prev) => prev + 1);
};

const decreaseStock = () => {
  if (stockAmount > 0) {
    setStockAmount(prev => prev - 1);
  }
};

/*
const decreaseStock = () => {
  if (stockAmount > initialStock) {
    setStockAmount((prev) => prev - 1);
  }
};*/

/*const saveStockChange = () => {
  //alert(`Se añadirá ${stockAmount} al stock del producto: ${selectedProduct?.product_name}`);
  
  
  setShowModal(false);
};*/

const saveStockChange = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No estás autenticado.");
    return;
  }

  const addStock = stockAmount - initialStock;

  if (addStock <= 0) {
    alert("La cantidad de stock a añadir debe ser mayor que 0.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/products/add-stock/${selectedProduct.pk_product}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ addStock }),
    });

    // Verifica si la respuesta es exitosa
    const data = await response.json(); // Obtenemos la respuesta como JSON

    console.log("Response status:", response.status);  // Verifica el código de estado de la respuesta
    console.log("Response message:", data.message);  // Verifica el mensaje del backend

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar el stock");
    } else {
      alert(data.message || "Stock actualizado correctamente");
      navigate('/products');
      setShowModal(false);
    }

  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    alert(error.message || "Hubo un error al actualizar el stock.");
  }
};


const handleLogout = () => {
    localStorage.removeItem("token"); // Si usas token, lo eliminas aquí
    navigate("/"); // Te redirige al login
  };


//
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado.");
      return;
    }

    let url = "http://localhost:3000/api/products";
    if (selectedFilter && selectedFilter !== 'all') {
      url += `/${selectedFilter}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error al obtener los productos:", error));
  }, [selectedFilter]);

  const handleFilterChange = (newFilter) => {
    setSelectedFilter(newFilter); 
    navigate(`/products${newFilter === 'all' ? '' : `/${newFilter}`}`);
  };

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleEditProduct = async (pk_product) => {
    alert(`Editar producto con ID: ${pk_product}`);
    navigate(`/edit-product/${pk_product}`);
  };

  const DeleteProduct = async (pk_product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/products/${pk_product}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el producto");

      alert("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Hubo un error al intentar eliminar el producto.");
    }
  };

  const filterOptions = [
    { key: "all", label: "Todos los productos", icon: "🛒" },
    { key: "best-sellers", label: "Productos más vendidos", icon: "📈" },
    { key: "low-stock", label: "Productos con bajo stock", icon: "⚠️" },
    { key: "new-products", label: "Nuevos productos", icon: "✨" },
    { key: "low-sale", label: "Productos con baja venta", icon: "📉" },
    { key: "high-stock", label: "Productos con alto stock", icon: "📦" },
  ];

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
              <Nav.Link href="/employees">Empleados</Nav.Link>
            </Nav>
            <Button variant="outline-light">Cerrar sesión</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
                                <a className="nav-link" href="#" style={{ color: 'white' }}>Proveedores</a>
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

      <div className="d-flex gap-3 mb-4 justify-content-center flex-wrap m-5">
        {filterOptions.map((filterOption) => (
          <Button
            key={filterOption.key}
            className="p-3"
            variant={selectedFilter === filterOption.key ? "success" : "secondary"}
            onClick={() => handleFilterChange(filterOption.key)} 
          >
            {filterOption.icon} {filterOption.label}
          </Button>
        ))}
      </div>

      <div className="container mt-5">
        <h2 className="mb-4 text-center">Lista de Productos</h2>
        <Button className="mb-3" variant="primary" onClick={handleAddProduct}>Agregar Producto</Button>
        {message && <div className="alert alert-warning text-center">{message}</div>}
        <table className="table table-hover table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Expiración</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Proveedor</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.pk_product} className="align-middle text-center">
                  <td><img src={`http://localhost:3000/images/${product.image}`} alt={product.name} style={{ width: '100px', height: '100px' }} /></td>
                  <td>{product.product_name}</td>
                  <td>{product.product_des}</td>
                  <td>{product.product_exp === "0000-00-00" ? "0000-00-00" : new Date(product.product_exp).toISOString().split('T')[0]}</td>
                  <td>{product.category_name}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.provider_name}</td>
                  <td>{product.status ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2 m-2" onClick={() => handleEditProduct(product.pk_product)}>Editar</button>
                    <button className="btn btn-danger btn-sm m-2" onClick={() => DeleteProduct(product.pk_product)}>Eliminar</button>
                    <button className="btn btn-success btn-sm m-2" onClick={() => handleShowModal(product)}>Añadir stock</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="text-center">No hay productos disponibles</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content text-center p-3">
              <div className="modal-header border-0">
                <h5 className="modal-title w-100">Añadiendo cantidad</h5>
              </div>
              <div className="modal-body">
                <p>Ingrese la cantidad que desea agregar</p>
                <div className="d-flex justify-content-center align-items-center gap-3">
                  <button className="btn btn-danger" onClick={decreaseStock}>−</button>
                  <input type="text" className="form-control text-center" value={stockAmount.toString().padStart(2, '0')} readOnly style={{ width: '70px' }} />
                  <button className="btn btn-success" onClick={increaseStock}>＋</button>
                </div>
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button className="btn btn-primary me-2" onClick={saveStockChange}>Guardar y continuar</button>
                <button className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
};


export default Products;
