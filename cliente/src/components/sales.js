import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const SalidaMercancia = () => {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado.");
      return;
    }
  
    fetch("http://localhost:3000/api/products", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Productos recibidos:", data);
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Error al obtener los productos:", error));
  }, []);
  

  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const toggleSeleccion = (product) => {
    const yaSeleccionado = productosSeleccionados.find(p => p.pk_product === product.pk_product);
    if (yaSeleccionado) {
      setProductosSeleccionados(productosSeleccionados.filter(p => p.pk_product !== product.pk_product));
    } else {
      setProductosSeleccionados([...productosSeleccionados, { ...product, cantidad: 1 }]);
    }
  };
  

  const cambiarCantidad = (id, cantidad) => {
    setProductosSeleccionados(prev =>
      prev.map(product => product.pk_product === id ? { ...product, cantidad } : product)
    );
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
                          onChange={(e) =>
                            cambiarCantidad(product.pk_product, parseInt(e.target.value) || 1)
                          }
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
