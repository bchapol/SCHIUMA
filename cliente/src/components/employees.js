import React, { useEffect, useState } from "react";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetch("http://localhost:3000/api/user_employees")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los empleados");
          }
          return response.json();
        })
        .then((data) => setEmployees(data))
        .catch((error) => setError(error.message));
    }, []);
}