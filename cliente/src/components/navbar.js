import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation(); // Obtén la ruta actual

  // Función para verificar si la ruta actual coincide con alguna de las rutas permitidas
  const isActive = (paths) => {
    // Si paths es un solo string, lo convertimos en un array
    const routes = Array.isArray(paths) ? paths : [paths];
    return routes.some(route => location.pathname.startsWith(route));
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#1E8A71' }} data-bs-theme="light">
      <div className="container-fluid">
        <a className={`navbar-brand`} href="/" style={{ color: 'white' }}>
          <img
            src="../images/logo_icono_bla.png"
            alt="Logo"
            width="40"
            height="35"
            className="d-inline-block align-text-top"
          />
          SCHIUMA
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            {/* Empleados */}
            <li className="nav-item" style={{ margin: '0 15px' }}>
              <a
                className={`nav-link ${isActive(["/employees", "/add-employee"]) ? "active" : ""}`}
                href="/employees"
                style={
                  isActive(["/employees", "/add-employee"])
                    ? { backgroundColor: 'white', color: '#1E8A71', borderRadius: '20px' } // Aquí agregamos border-radius
                    : { color: 'white', borderRadius: '20px' } // Aquí también aseguramos el border-radius
                }
              >
                Empleados
              </a>
            </li>

            {/* Productos */}
            <li className="nav-item" style={{ margin: '0 15px' }}>
              <a
                className={`nav-link ${isActive(["/products", "/add-product"]) ? "active" : ""}`}
                href="/products"
                style={
                  isActive(["/products", "/add-product"])
                    ? { backgroundColor: 'white', color: '#1E8A71', borderRadius: '20px' }
                    : { color: 'white', borderRadius: '20px' }
                }
              >
                Productos
              </a>
            </li>

            {/* Clientes */}
            <li className="nav-item" style={{ margin: '0 15px' }}>
              <a
                className={`nav-link ${isActive("/customers") ? "active" : ""}`}
                href="/customers"
                style={isActive("/customers") ? { backgroundColor: 'white', color: '#1E8A71', borderRadius: '20px' } : { color: 'white', borderRadius: '20px' }}
              >
                Clientes
              </a>
            </li>

            {/* Proveedores */}
            <li className="nav-item" style={{ margin: '0 15px' }}>
              <a
                className={`nav-link ${isActive("/providers") ? "active" : ""}`}
                href="/providers"
                style={isActive("/providers") ? { backgroundColor: 'white', color: '#1E8A71', borderRadius: '20px' } : { color: 'white', borderRadius: '20px' }}
              >
                Proveedores
              </a>
            </li>

            {/* Movimientos */}
            <li className="nav-item" style={{ margin: '0 15px' }}>
              <a
                className={`nav-link ${isActive("/movements") ? "active" : ""}`}
                href="/movements"
                style={isActive("/movements") ? { backgroundColor: 'white', color: '#1E8A71', borderRadius: '20px' } : { color: 'white', borderRadius: '20px' }}
              >
                Movimientos
              </a>
            </li>
          </ul>
          <div className="ms-auto">
            <button className="btn btn-outline-light" onClick={() => alert("Cerrar sesión")}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
