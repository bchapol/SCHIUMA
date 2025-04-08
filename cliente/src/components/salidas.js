import React from "react";
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Salidas = () => {
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

      <div className="container mt-5">
        <h2 className="mb-4 text-center">Salida de mercancía</h2>

        <Button className="mb-3" variant="primary">Agregar Producto</Button>

        <table className="table table-hover table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th>Checkbox</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input className="form-check-input" type="checkbox" name="aceptar" value="" /></td>
              <td>Image.png</td>
              <td>Producto 1</td>
              <td>$10.00</td>
              <td>10</td>
            </tr>
            <tr>
              <td><input className="form-check-input" type="checkbox" name="aceptar" value="" /></td>
              <td>Image.png</td>
              <td>Producto 2</td>
              <td>$15.00</td>
              <td>20</td>
            </tr>
            <tr>
              <td><input className="form-check-input" type="checkbox" name="aceptar" value="" /></td>
              <td>Image.png</td>
              <td>Producto 3</td>
              <td>$12.00</td>
              <td>30</td>
            </tr>
          </tbody>
        </table>

        {/* Panel de resumen de salida */}
        <div className="card p-3">
          <h5 className="mb-3">Salida ID #05468</h5>

          <div className="mb-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="d-flex justify-content-between align-items-center p-2 mb-2 rounded" style={{ backgroundColor: '#d6ecd9' }}>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-chevron-right"></i>
                  <span className="fw-bold">5</span>
                  <span>Jabón de Lavanda</span>
                </div>
                <div className="fw-bold">$180.00</div>
              </div>
            ))}
          </div>

          <div className="bg-light rounded p-3 mb-3">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>$500.00</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>IVA</span>
              <span>$80.00</span>
            </div>
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span>$580.00</span>
            </div>
          </div>

          <div className="text-end">
            <button className="btn px-4 py-2 text-white" style={{ backgroundColor: '#f7931e' }}>
              Registrar salida <i className="bi bi-arrow-right-short"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Salidas;
