import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importamos Routes en lugar de Switch

import Login from "./components/login";

import Products from "./components/products";
import Addproduct from "./components/addproduct";
import Editproduct from "./components/editproducts";

import Employees from "./components/employees";
import Addemployee from "./components/addemployee";

import Customers from "./components/customers";
import Addcustomer from "./components/addcustomer";


function App() {
  return (
    <Router>
      <Routes> {/* Usamos Routes en lugar de Switch */}
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<Addproduct />} />
        <Route path="/edit-product/:pk_product" element={<Editproduct />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/add-employee" element={<Addemployee />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/add-customer" element={<Addcustomer />} />
      </Routes>
    </Router>
  );
}

export default App;
