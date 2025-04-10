import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importamos Routes en lugar de Switch
import Login from "./components/login";
import Employees from "./components/employees";
import Products from "./components/products";
import Comprobacion_token from "./components/token_";
import Addproduct from "./components/addproducts";
import Editproduct from "./components/editproduct";
import Sales from "./components/sales";
import Movements from "./components/movements";

function App() {
  return (
    <Router>
      <Routes> {/* Usamos Routes en lugar de Switch */}
        <Route path="/" element={<Login />} />
        <Route path="/employees" element={<Employees/>} />
        <Route path="/comprobacion" element={<Comprobacion_token />} />
        <Route path="/add-product" element={<Addproduct />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:filter" element={<Products />} />
        <Route path="/edit-product/:pk_product" element={<Editproduct />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/movements" element={<Movements />} />
      </Routes>
    </Router>
  );
}

export default App;
