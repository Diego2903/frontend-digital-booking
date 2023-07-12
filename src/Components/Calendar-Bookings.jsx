import React, { useState, useEffect, useContext } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Importar los estilos CSS del componente
import 'react-date-range/dist/theme/default.css'; // Importar los estilos de tema del componente
import "./Styles/Calendar.css"
import "./Styles/Calendar-Booking.css"
import digitalBooking from '../api/digitalBooking';
import UserContext from '../context/UserContext';
import dayjs from 'dayjs';


const CalendarBookings = ({id}) => {
  const [product, setProduct] = useState()
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const { userInformation, fechasReserva, setFechasReserva } = useContext(UserContext);
  const [reservedRanges, setReservedRanges] = useState([]);


  const cargarProducto = async () => {
    try {
      const data = await digitalBooking.get(`/product/${id}`);
      setProduct(data.data);

    
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  console.log(product)

    useEffect(() => {
        const fetchReservedRanges = async () => {
          try {
            const data = await digitalBooking.get(`/booking/getAll`);
            setReservedRanges(data.data.filter(booking => booking.product.idProduct == id));
            
          } catch (error) {
            console.error(error);
          }
        };
        cargarProducto();
        console.log(product)
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

    const handleRangeChange = (ranges) => {
      setFechasReserva(ranges.selection);
      console.log(ranges.selection)
    
    }


  return (
    <div className='calendar-conteiner book'>
        <h2>Fecha de tu reserva</h2>
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
    </div>
  );
};

export default CalendarBookings;