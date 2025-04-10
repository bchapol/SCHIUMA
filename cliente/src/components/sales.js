import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import NavbarComponent from './navbar';


const SalidaMercancia = () => {
  const [customers, setCustomers] = useState([]);
  const [pkEmployee, setPkEmployee] = useState("");
  const [products, setProducts] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [salesNumber, setSalesNumber] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No estás autenticado.");
        navigate("/")
        return;
      }
  
      try {
        // Obtener clientes
        const customersRes = await fetch("http://localhost:3000/api/customers", {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(Array.isArray(customersData) ? customersData : []);
        }
  
        // Obtener el número de venta
        const response = await fetch("http://localhost:3000/api/salesTransaction", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        }
  
        const data = await response.json();
        
        // Verificamos que data.salesNumber exista antes de asignarlo
        if (data && data.salesNumber) {
          setSalesNumber(data.salesNumber);
        } else {
          console.error("El número de venta no está disponible.");
        }
  
        // Obtener productos
        const productsRes = await fetch("http://localhost:3000/api/products", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        const productsData = await productsRes.json();
        setProducts(Array.isArray(productsData) ? productsData : []);
  
        // Obtener datos del usuario
        const userRes = await fetch("http://localhost:3000/api/userdata", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setPkEmployee(userData.pk_employee);
  
      } catch (error) {
        console.error("Error occurred:", error);
      }
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

  const confirmarSalida = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado.");
      navigate("/")
      return;
    }

    // Asegurar que haya productos seleccionados
    if (productosSeleccionados.length === 0) {
      alert("Debes seleccionar al menos un producto.");
      return;
    }

    // Asegurar que un cliente esté seleccionado
    if (!selectedCustomer) {
      alert("Debes seleccionar un cliente.");
      return;
    }

    // Estructurar los datos a insertar
    const salesData = productosSeleccionados.map(product => ({
      fk_product: product.pk_product,
      fk_customer: selectedCustomer,  // Cliente seleccionado
      fk_employee: pkEmployee,  // Empleado autenticado
      quantity: product.cantidad,
      date: new Date().toISOString().slice(0, 19).replace("T", " "), // Formato 'YYYY-MM-DD HH:MM:SS'
      total_price: product.price * product.cantidad,
      num_transaction: salesNumber // Mantiene el mismo número de transacción
    }));

    try {
      const response = await fetch("http://localhost:3000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(salesData),
      });

      if (response.ok) {
        alert("Salida de mercancía confirmada.");
        navigator("/movements")
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error al registrar la salida.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <>
      
<NavbarComponent/>

      {/* Contenido */}
      <div className="container my-4">
        <h2 className="text-center fw-bold mb-4">Salida de mercancía</h2>
        <div className="row">
          {/* Columna izquierda: tabla */}
          <div className="col-md-8">
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
              <h5 className="fw-bold mb-3">Salida ID #{salesNumber}</h5>
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
                      value={selectedCustomer}
                      onChange={(e) => setSelectedCustomer(e.target.value)}
                    >
                      <option value="">Seleccione un cliente</option>
                      {customers.map(customer => (
                        <option key={customer.pk_customer} value={customer.pk_customer}>
                          {customer.customer_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button variant="success" className="w-100 mt-4" onClick={confirmarSalida}>
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
