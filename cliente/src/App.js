import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importamos Routes en lugar de Switch
import Login from "./components/login";
import Employees from "./components/employees";
//import Empleados from "./components/employees";

function App() {
  return (
    <Router>
      <Routes> {/* Usamos Routes en lugar de Switch */}
        <Route path="/" element={<Login />} /> {/* Cambiar para usar 'element={<Login />}' en lugar de 'element={Login}' */}
        <Route path="/employees" element={<Employees/>} />
      </Routes>
    </Router>
  );
}

export default App;
