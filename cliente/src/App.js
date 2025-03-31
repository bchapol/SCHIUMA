import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importamos Routes en lugar de Switch
import Login from "./components/login";
<<<<<<< HEAD
import Employees from "./components/employees";
=======
import Comprobacion_token from "./components/token_";
/*import Productos from "./components/products";*/
import Addproduct from "./components/addproducts";
>>>>>>> 1970a5d6f31b58a51bcf70b5acd1779f3bf236da
//import Empleados from "./components/employees";

function App() {
  return (
    <Router>
      <Routes> {/* Usamos Routes en lugar de Switch */}
        <Route path="/" element={<Login />} /> {/* Cambiar para usar 'element={<Login />}' en lugar de 'element={Login}' */}
<<<<<<< HEAD
        <Route path="/employees" element={<Employees/>} />
=======
        <Route path="/comprobacion" element={<Comprobacion_token />} />
        <Route path="/addproduct" element={<Addproduct />} />
>>>>>>> 1970a5d6f31b58a51bcf70b5acd1779f3bf236da
      </Routes>
    </Router>
  );
}

export default App;
