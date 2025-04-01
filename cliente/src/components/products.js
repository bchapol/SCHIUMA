import React, { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado.");
      return;
    }
    fetch("http://localhost:3000/api/products", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, 
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => setError(error.message));
  }, []);


  return (
    <div className="container mt-4">
      <h2>Lista de Productos</h2>
      {error && <p>{error}</p>}
      {products.length > 0 ? (
        <table className="table table-striped table-bordered table-hover table-responsive">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Expiración</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Proveedor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.pk_aproduct}>
                <td>{product.pk_aproduct}</td>
                <td>
                    <img src={`http://localhost:3000/product_images/${product.image}`} alt={product.name} style={{ width: '100px', height: '100px' }} />
                </td>
                <td>{product.product_name}</td>
                <td>{product.product_des}</td>
                <td>{product.product_exp}</td>
                <td>{product.category_name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>{product.pk_provider}</td>
                <td>{product.status ? "Activo" : "Inactivo"}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">Editar</button>
                  <button className="btn btn-danger btn-sm">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay productos disponibles.</p>
      )}
    </div>
  );
};

export default Products;
