import React from 'react';
import '../css/style.css';
import '../js/script.js';

const Productos = () => {
  return (
    <div className="app">
      {/* Menú de hamburguesa */}
      <div className="hamburger-menu">
        <img src="/icons/Hamburguesa.svg" alt="Menú" />
      </div>

      <aside className="sidebar" id="sidebar">
        <div className="logo">
          <img src="/images/logo.jpg" alt="Logo" />
        </div>

        <nav>
          <ul>
            <li className="active">
              <a href="#productos">
                <img className="icon-default" src="/icons/products.svg" alt="Productos" />
                <img className="icon-hover" src="/icons/products-hover.svg" alt="Productos" />
                Productos
              </a>
            </li>
            <li>
              <a href="#clientes">
                <img className="icon-default" src="/icons/cliente.svg" alt="Clientes" />
                <img className="icon-hover" src="/icons/products-hover.svg" alt="Clientes" />
                Clientes
              </a>
            </li>
            <li>
              <a href="#">
                <img className="icon-default" src="/icons/proveedores.svg" alt="Proveedores" />
                <img className="icon-hover" src="/icons/products-hover.svg" alt="Proveedores" />
                Proveedores
              </a>
            </li>
            <li>
              <a href="#">
                <img className="icon-default" src="/icons/ventas.svg" alt="Ventas" />
                <img className="icon-hover" src="/icons/ventas-hover.svg" alt="Ventas" />
                Ventas
              </a>
            </li>
            <li>
              <a href="#">
                <img className="icon-default" src="/icons/reportes.svg" alt="Reportes" />
                <img className="icon-hover" src="/icons/ventas-hover.svg" alt="Reportes" />
                Reportes
              </a>
            </li>
            <li>
              <a href="#">
                <img className="icon-default" src="/icons/empleados.svg" alt="Empleados" />
                <img className="icon-hover" src="/icons/ventas-hover.svg" alt="Empleados" />
                Empleados
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        <header className="search-bar">
          <div className="title-container">
            <h1>Productos</h1>
          </div>
          <div className="search-container">
            <input type="text" placeholder="Buscar producto por nombre o código" />
            <button><img src="/images/img/searchbar.svg" alt="Buscar" /></button>
          </div>
          <div className="notify-userprofile">
            <button><img src="/icons/notification.svg" alt="" /></button>
            <button><img src="/images/UserPhoto.png" alt="" /></button>
          </div>
        </header>

        <section id="productos" className="section-content active">
          <h2>Categorías</h2>
          <div className="category-list">
            <button className="category-item">
              <img src="/images/img/todos.png" alt="Todas las categorías" />
              Todos los productos
            </button>
            <button className="category-item">
              <img src="/images/img/ProductoMasVendido.png" alt="Jabones artesanales" />
              Productos mas vendidos
            </button>
            <button className="category-item">
              <img src="/images/img/BajoStock.png" alt="Champú" />
              Productos con bajo stock
            </button>
            <button className="category-item">
              <img src="/images/img/NuevosProductos.png" alt="Aceite corporal" />
              Nuevos productos
            </button>
            <button className="category-item">
              <img src="/images/img/ProductoBajaVenta.png" alt="Sales de baño" />
              Productos con baja venta
            </button>
            <button className="category-item">
              <img src="/images/img/AltoStock.png" alt="Loción" />
              Producto con alto stock
            </button>
          </div>

          <section className="inventario">
            <div className="inventario-header">
              <h2>Lista de productos</h2>
              <div className="inventario-botones">
                <button className="btn-filtro">
                  <img src="/icons/Filtro.svg" alt="Filtro" />
                  <h4>Filtrar</h4>
                </button>
                <button className="btn-agregar">
                  <img src="/icons/Añadir.svg" alt="Agregar producto" />
                  <h4>Agregar producto</h4>
                </button>
              </div>
            </div>

            <table className="tabla-inventario">
              <thead>
                <tr>
                  <th className="borde-izquierdo"></th>
                  <th><h5>PRODUCTO</h5></th>
                  <th><h5>LOTE</h5></th>
                  <th><h5>EXPIRACIÓN</h5></th>
                  <th><h5>CATEGORÍA</h5></th>
                  <th><h5>COSTO</h5></th>
                  <th><h5>STOCK</h5></th>
                  <th><h5>PRECIO VENTA</h5></th>
                  <th><h5>ESTADO</h5></th>
                  <th className="borde-derecho"><h5>ACCIONES</h5></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><img src="https://via.placeholder.com/180x112" alt="Producto" /></td>
                  <td><h5>001</h5></td>
                  <td><p>Shampoo Herbal</p></td>
                  <td><p>Cuidado Personal</p></td>
                  <td><p>50</p></td>
                  <td><p>$120.00</p></td>
                  <td><p>Proveedor A</p></td>
                  <td><p>2025-03-01</p></td>
                  <td className="estado"><span className="estado-activo">Activo</span></td>
                  <td className="contenedor-acciones">
                    <button className="btn-acciones">
                      <img src="/images/img/Trespuntos.png" alt="Acciones" />
                    </button>
                    <div className="opciones">
                      <img src="/icons/Añadir-hover.svg" alt="Opción 1" />
                      <img src="/images/img/Editar.png" alt="Opción 2" />
                      <img src="/images/img/Eliminar.png" alt="Opción 3" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><img src="https://via.placeholder.com/180x112" alt="Producto" /></td>
                  <td><h5>002</h5></td>
                  <td>Jabón de Coco</td>
                  <td>Higiene</td>
                  <td>30</td>
                  <td>$80.00</td>
                  <td>Proveedor B</td>
                  <td>2025-02-15</td>
                  <td className="estado"><span className="estado-activo">Activo</span></td>
                  <td className="contenedor-acciones">
                    <button className="btn-acciones">
                      <img src="/images/img/Trespuntos.png" alt="Acciones" />
                    </button>
                    <div className="opciones">
                      <img src="/icons/Añadir-hover.svg" alt="Opción 1" />
                      <img src="/images/img/Editar.png" alt="Opción 2" />
                      <img src="/images/img/Eliminar.png" alt="Opción 3" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="pagination">
              <span>Página </span>
              <button id="page-dropdown" className="page-number">
                1 <span className="arrow">›</span>
              </button>
              <span> de <span id="total-pages">5</span></span>
              <ul id="page-list" className="page-list hidden"></ul>
            </div>
          </section>
        </section>

        <section id="clientes" className="section-content">
          <h1>Clientes</h1>
          {/* Contenido de clientes aquí */}
        </section>
      </main>
    </div>
  );
};

export default Productos;
