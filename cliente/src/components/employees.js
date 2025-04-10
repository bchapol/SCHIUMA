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
  
  const [employees, setEmployees] = useState([]);


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




//
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado.");
      return;
    }

    let url = "http://localhost:3000/api/employees";
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
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error al obtener los productos:", error));
  }, [selectedFilter]);

  const handleAddEmployee = () => {
    navigate('/add-employee');
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
                              <a className="nav-link" href="/products" style={{ color: 'white' }}>Productos</a>
                            </li>
                            <li className="nav-item" style={{ margin: '0 15px' }}>
                                <a className="nav-link" href="/customers" style={{ color: 'white' }}>Clientes</a>
                            </li>
                            <li className="nav-item" style={{ margin: '0 15px' }}>
                                <a className="nav-link" href="/providers" style={{ color: 'white' }}>Proveedores</a>
                            </li>
                            <li className="nav-item" style={{ margin: '0 15px' }}>
                              <a className="nav-link active" aria-current="page" href="/employees" style={{ backgroundColor: 'white', color: '#1E8A71' }}>Empleados</a>
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
        <h2 className="mb-4 text-center">Lista de Empleados</h2>
        <Button className="mb-3" variant="primary" onClick={handleAddEmployee}>Agregar Nuevo Empleado</Button>
        {message && <div className="alert alert-warning text-center">{message}</div>}
        <table className="table table-hover table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Role</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.pk_employee} className="align-middle text-center">
                  <td><img src={`http://localhost:3000/images/${employee.image}`} alt={employee.name} style={{ width: '100px', height: '100px' }} /></td>
                  <td>{employee.employee_name}</td>
                  <td>{employee.role}</td>
                  <td>{employee.email}</td>
                  <td>{employee.status ? "Activo" : "Inactivo"}</td>
                  <td>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="text-center">No hay información de los empleados disponible</td></tr>
            )}
          </tbody>
        </table>
      </div>


    </>
  );
};

//<button className="btn btn-warning btn-sm me-2 m-2" onClick={() => handleEditProduct(product.pk_product)}>Editar</button>
//<button className="btn btn-danger btn-sm m-2" onClick={() => DeleteProduct(product.pk_product)}>Eliminar</button>
export default Products;
