import React, { useContext, useEffect, useState } from 'react';
import digitalBooking from '../api/digitalBooking';
import UserContext from '../context/UserContext';
import "./Styles/UserInfo.css"
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';



const UserInfo = () => {
  const [users, setUser] = useState({});
  const {userInformation} = useContext(UserContext);
  const {jwt} = userInformation

  // const location = useLocation();
  // const { startDate, endDate } = location.state;
  const {fechasReserva, setFechasReserva } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      cargarUsuarios();
    }
    fetchData();
  }, [jwt]);

  const cargarUsuarios = async () => {
    const data = await digitalBooking.get(`/api/users/${jwt}`);
    setUser(data.data);
    
  };


  const handleEditClick = () => {
    setIsEditMode(true);
    console.log(isEditMode)
  };

  const handleSaveClick = () => {
    setIsEditMode(false);
    console.log(isEditMode)
  };

  return (
    <div className="user-info">
      <h2>Información de la Reserva</h2>

      <div className="user-details">
        <div className="form-field">
          <label htmlFor="name">Nombre y Apellido:</label>
            {/* <input type="text"value={users?.name} readOnly /> */}
            <p>{users?.name}</p>
        </div>

        <div className="form-field">
          <label htmlFor="email">Correo Electrónico:</label>
            {/* <input type="email"value={users?.email} readOnly /> */}
            <p>{users?.email}</p>
        </div>
      </div>

      <div className="form-field">
        <label>Fecha de inicio de reserva:</label>
        {/* <input type="text" value={dayjs(fechasReserva.startDate).format('DD/MM/YYYY')} readOnly /> */}
        <p>{dayjs(fechasReserva.startDate).format('DD/MM/YYYY')}</p>
      </div>
      <div className="form-field">
        <label>Fecha de finalización de reserva:</label>
        {/* <input type="text" value={dayjs(fechasReserva.endDate).format('DD/MM/YYYY')} readOnly /> */}
        <p>{dayjs(fechasReserva.endDate).format('DD/MM/YYYY')}</p>
      </div>
    </div>
  );
};

export default UserInfo;
