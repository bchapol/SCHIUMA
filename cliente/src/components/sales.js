import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const SalidaMercancia = () => {
  const [customers, setCustomers] = useState([]);
  const [pkEmployee, setPkEmployee] = useState("");
  const [products, setProducts] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productsSale, setProductsSales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No estás autenticado.");
        return;
      }

      try{
        const customersRes = await fetch("http://localhost:3000/api/customers", {
          method: 'GET', headers: { Authorization: `Bearer ${token}` }
        });
        if(customersRes.ok){
          const customersData = await customersRes.json();
          setCustomers(Array.isArray(customersData) ? customersData: [])
        }
      }catch(error){
        
      }
      try{
        fetch("http://localhost:3000/api/products", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setProducts(Array.isArray(data) ? data : []);
          })
          .catch((error) => console.error("Error al obtener los productos:", error));
        
      }catch(error){
        
      }

      fetch("http://localhost:3000/api/userdata", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPkEmployee(data.pk_employee); 
        });
      
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("pkEmployee actualizado:", pkEmployee);
  }, [pkEmployee]); 

  useEffect(() => {
    console.log("Seleccionados:", productosSeleccionados);
  }, [productosSeleccionados]);
  
  const agregarProducto = (nuevoProducto) => {
    const yaSeleccionado = productosSeleccionados.find(p => p.pk_product === nuevoProducto.pk_product);
    if (!yaSeleccionado) {
      setProductosSeleccionados([...productosSeleccionados, { ...nuevoProducto, cantidad: 1 }]);
    }
  };




  const eliminarProducto = (pk_product) => {
    setProductosSeleccionados(productosSeleccionados.filter(p => p.pk_product !== pk_product));
  };

  const cambiarCantidad = (pk_product, nuevaCantidad) => {
    setProductosSeleccionados(productosSeleccionados.map(p =>
      p.pk_product === pk_product ? { ...p, cantidad: nuevaCantidad } : p
    ));
  };
  

  const toggleSeleccion = (product) => {
    const yaSeleccionado = productosSeleccionados.find(p => p.pk_product === product.pk_product);
    let nuevosSeleccionados;
  
    if (yaSeleccionado) {
      nuevosSeleccionados = productosSeleccionados.filter(p => p.pk_product !== product.pk_product);
    } else {
      nuevosSeleccionados = [...productosSeleccionados, { ...product, cantidad: 1 }];
    }
    setProductosSeleccionados(nuevosSeleccionados);
  };
  

  const subtotal = productosSeleccionados.reduce((acc, p) => acc + (p.price * p.cantidad), 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">Mi Tienda</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="me-auto">
              <Nav.Link href="#">Inicio</Nav.Link>
              <Nav.Link href="#">Productos</Nav.Link>
              <Nav.Link href="#">Movimientos</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido */}
      <div className="container my-4">
        <h2 className="text-center fw-bold mb-4">Salida de mercancía</h2>
        <div className="row">
          {/* Columna izquierda: tabla */}
          <div className="col-md-8">
            <div className="mb-3">
              <Button variant="primary">Agregar Producto</Button>
            </div>
            <table className="table table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>Seleccionar</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.pk_product}>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!productosSeleccionados.find(p => p.pk_product === product.pk_product)}
                        onChange={() => toggleSeleccion(product)}
                      />
                    </td>
                    <td>{product.product_name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Columna derecha: resumen */}
          <div className="col-md-4">
            <div className="bg-light border rounded shadow-sm p-3">
              <h5 className="fw-bold mb-3">Salida ID #05468</h5>
              {products.length === 0 ? (
                <p className="text-muted">No hay productos seleccionados.</p>
              ) : (
                <>
                  {productosSeleccionados.map(product => (
                    <div
                      key={product.pk_product}
                      className="d-flex justify-content-between align-items-center bg-success bg-opacity-25 rounded p-2 mb-2"
                    >
                      <div>
                        <strong>{product.stock}</strong> {product.product_name}
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                      <input
                        type="number"
                        value={product.cantidad}
                        min={1}
                        max={product.stock}
                        onChange={(e) => {
                          const inputCantidad = parseInt(e.target.value) || 1;
                          const cantidadValida = Math.min(inputCantidad, product.stock);
                          cambiarCantidad(product.pk_product, cantidadValida);
                        }}
                        className="form-control form-control-sm"
                        style={{ width: "60px" }}
                      />
                        <span className="fw-bold text-success">
                          ${(product.price * product.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="mt-3 border-top pt-3">
                    <div className="d-flex justify-content-between">
                      <strong>Subtotal</strong>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <strong>IVA (16%)</strong>
                      <span>${iva.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <strong>Total</strong>
                      <span className="fw-bold text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mb-3 m-2">
                        <label className="form-label">Cliente</label>
                        <select
                            name="fk_category"
                            className="form-control"
                            value={customers.pk_customer}
                            required
                        >
                            <option value="">Seleccione un cliente</option>
                            {customers.map(customer => (
                                <option key={customer.pk_customer} value={customer.pk_customer}>
                                    {customer.customer_name}
                                </option>
                            ))}
                        </select>
                    </div>

                  <Button variant="success" className="w-100 mt-4">
                    Confirmar salida
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalidaMercancia;
