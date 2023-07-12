import React from 'react';
import successIcon from "../assets/iconSucess.svg"
import './Styles/SuccessBooking.css'; 
import { useNavigate } from 'react-router-dom';



function SuccessBooking() {
    const navigate = useNavigate()
  return (
    <div className="confirmation-container">
      <div className="confirmation-message">
        <img src={successIcon} alt=""className='success-icon'/>
        <h2>¡Muchas gracias!</h2>
        <p>Su reserva ha sido confirmada con éxito</p>
      </div>

      <button onClick={() => navigate('/')} className="ok-button">Volver al Inicio</button>
    </div>
  );
}

export default SuccessBooking;