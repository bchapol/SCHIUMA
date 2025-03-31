import React, { useEffect, useState } from "react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener el token del localStorage
    const token = localStorage.getItem("token");

    // Verificar si el token existe
    if (!token) {
      setError("No estás autenticado.");
      return;
    }

    // Realizar la solicitud con el token en el header
    fetch("http://localhost:3000/api/employees", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Enviar el token en el header Authorization
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los empleados");
        }
        return response.json();
      })
      .then((data) => setEmployees(data))
      .catch((error) => setError(error.message));
  }, []);


  return (
    <div>
      {error && <p>{error}</p>}
      {employees.length > 0 ? (
        employees.map((employee) => (
          <div key={employee.pk_user}>
            <h3>{employee.employee_name}</h3>
            <p>{employee.email}</p>
            <p>{employee.role}</p>
            {employee.image && (
              <div>
              <img src={`http://localhost:3000/${employee.image}`} alt={employee.name} style={{ width: '100px', height: '100px' }} />
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No se encontraron empleados.</p>
      )}
    </div>
  );
};

export default Employees;
