import React, { useState, useEffect, useContext } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Importar los estilos CSS del componente
import 'react-date-range/dist/theme/default.css'; // Importar los estilos de tema del componente
import "./Styles/Calendar.css"
import digitalBooking from '../api/digitalBooking';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';




const CalendarReservations = ({id}) => {
  const [reservationAttempted, setReservationAttempted] = useState(false);
  const [product, setProduct] = useState()
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const { userInformation, fechasReserva, setFechasReserva } = useContext(UserContext);
  const {jwt, user} = userInformation;
  const navigate = useNavigate()
  const [reservedRanges, setReservedRanges] = useState([]);


  const cargarProducto = async () => {
    try {
      const data = await digitalBooking.get(`/product/${id}`);
      setProduct(data.data);
    
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

    useEffect(() => {
        const fetchReservedRanges = async () => {
          try {
            const data = await digitalBooking.get(`/booking/getAll`);
            setReservedRanges(data.data.filter(booking => booking.product.idProduct === id ));
           
          } catch (error) {
            console.error(error);
          }
        };
        cargarProducto();
        fetchReservedRanges();
        disableReservedDates();
      }, []);

      
      const disableReservedDates = (date) => {
        for (const reservation of reservedRanges) {
          const reservationStartDate = new Date(reservation.initialDate);
          const reservationEndDate = new Date(reservation.finishDate);

          if ((date > reservationStartDate && date < reservationEndDate)|| dayjs(date).format('YYYY-MM-DD') === dayjs(reservationStartDate).format('YYYY-MM-DD')||dayjs(date).format('YYYY-MM-DD') ===dayjs(reservationEndDate).format('YYYY-MM-DD')) {
            return true; 
          }
        }
        return false; 
       
      };

      const checkReservedDates = (startDate, endDate) => {
        for (const reservation of reservedRanges) {
          const reservationStartDate = new Date(reservation.initialDate);
          const reservationEndDate = new Date(reservation.finishDate);

          if (dayjs(startDate).format('YYYY-MM-DD') === dayjs(reservationStartDate).format('YYYY-MM-DD')&&dayjs(endDate).format('YYYY-MM-DD') ===dayjs(reservationEndDate).format('YYYY-MM-DD')) {
            return false; 
          }
        }
        return true; 
       
      };

    const handleRangeChange = (ranges) => {
      setFechasReserva(ranges.selection);
      console.log(ranges.selection);
    
    }

    const { startDate, endDate } = fechasReserva;

  const handleReservation = () => {
  
    if(jwt){ 
      if (startDate && endDate) {
       
      let isAvailable = checkAvailability(startDate, endDate);
      isAvailable = checkDays(startDate, endDate);
      isAvailable = checkReservedDates(startDate, endDate);
  
  
      if (isAvailable) {
        navigate(`/booking/${id}`, { state: { startDate: startDate, endDate: endDate }})

        
      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Atención!',
          text: 'Para realizar la reserva debe seleccionar un rango de '+ product.duration + " día(s) donde no se incluya ningún día reservado.",
          showDenyButton: false,
          confirmButtonText: 'Ok',
        })
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: '¡Atención!',
        text: 'Para realizar la reserva debe seleccionar un rango de fechas válido.',
        showDenyButton: false,
        confirmButtonText: 'Ok',
      })
    }}else{
      Swal.fire({
        icon: 'warning',
        title: '¡Atención!',
        text: 'Para realizar la reserva primero debe loggearse. ¿Desea loggearse?',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          setReservationAttempted(true);
          navigate('/sing-in', { state: { reservationAttempted: true } })
        } else if (result.isDenied) {
        }
      })
    }

    
  };
  
  const checkAvailability = (startDate, endDate) => {

    for (const reservation of reservedRanges) {
      const reservationStartDate = new Date(reservation.initialDate);

      const reservationEndDate = new Date(reservation.finishDate);

      if (startDate <= reservationEndDate && endDate >= reservationStartDate) {
        return false; 
      }
    }
    return true; 
  };

  const checkDays = (startDate, endDate) => {

      if ((Math.floor(dayjs(endDate).diff(dayjs(startDate)) / (1000 * 60 * 60 * 24)) + 1) != product.duration) {
        console.log(dayjs(endDate).diff(dayjs(startDate)))
        console.log(product.duration)
        return false; 
      }
      return true; 
    }
   
  


  return (
    <div className='calendar-conteiner'>
      <div className='calendar'>
      <DateRangePicker
        ranges={[fechasReserva]}
        onChange={handleRangeChange}
        minDate={minDate}
        showDateDisplay={false}
        months={2}
        direction='horizontal'
        disabledDay={disableReservedDates}
        rangeColors={'#000000'}
        color='#607D8B'

      />
      </div>
      <div className='banner'>
        <p className='banner-text'>Seleccioná las fechas que desea entre las que se encuentran disponibles</p>
        {startDate && endDate && (
        <div className='selected-dates'>
          Fecha de inicio: {dayjs(startDate).format('DD/MM/YYYY')} <br />
          Fecha de finalización: {dayjs(endDate).format('DD/MM/YYYY')}
        </div>
      )}
        <button className="btn-reservar" onClick={handleReservation} >Iniciar Reserva</button>
      </div>
    </div>
  );
};

export default CalendarReservations;