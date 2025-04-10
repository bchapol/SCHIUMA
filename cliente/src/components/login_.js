import React from 'react';
import '../App.css'
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';


function Login() {
  return (
    <MDBContainer fluid className="cont_princ p-3 my-5 h-custom d-flex flex-column justify-content-between">

      <MDBRow className="flex-grow-1">
      <MDBCol col='10' md='6' className="d-flex justify-content-center align-items-center">
  <img src="/images/logo_verde.png" className="img-fluid" alt="Sample image" />
</MDBCol>

        <MDBCol col='4' md='6' className="d-flex flex-column justify-content-center">

          <div className="d-flex flex-row align-items-center justify-content-center">

            <p className="lead fw-normal mb-0 me-3">Iniciar Sesión</p>
          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Bienvenido</p>
          </div>

          <MDBInput wrapperClass='mb-4' label='Correo electronico' id='formControlLg' type='email' size="lg"/>
          <MDBInput wrapperClass='mb-4' label='Contraseña' id='formControlLg' type='password' size="lg"/>

          <div className='text-center  mt-4 pt-2'>
            <MDBBtn className="btn-primary" size='lg'>Iniciar Sesión</MDBBtn>
          </div>

        </MDBCol>

      </MDBRow>

      <div className="footer-login d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 ">
      </div>

    </MDBContainer>
  );
}
export default Login;