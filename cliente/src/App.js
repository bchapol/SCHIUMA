import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importamos Routes en lugar de Switch
import Login from "./components/login";
import Employees from "./components/employees";
import Comprobacion_token from "./components/token_";
import Addproduct from "./components/addproducts";
import Updateproduct from "./components/updateproducts";
import Products from "./components/products";

function App() {
  return (
    <Router>
      <Routes> {/* Usamos Routes en lugar de Switch */}
        <Route path="/" element={<Login />} /> {/* Cambiar para usar 'element={<Login />}' en lugar de 'element={Login}' */}
        <Route path="/employees" element={<Employees/>} />
        <Route path="/comprobacion" element={<Comprobacion_token />} />
        <Route path="/addproduct" element={<Addproduct />} />
        <Route path="/products" element={<Products />} />
        <Route path="/updateproduct/:id" element={<Updateproduct />} />
      </Routes>
    </Router>
  );
}

export default App;
