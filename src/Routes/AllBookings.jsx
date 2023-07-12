import { useState, useEffect, useContext } from "react";
import digitalBooking from "../api/digitalBooking";
import "./Styles/List.css";
import ButtonBack from "../Components/ButtonBack";
import UserContext from "../context/UserContext";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import dayjs from "dayjs";


function AllBookings() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState()
  const { userInformation } = useContext(UserContext);
  const {user} = userInformation;
  const { jwt } = userInformation;

    useEffect(() => {

        async function fetchData() {
            cargarReservas();
          }
          fetchData();

  }, []);


 

  const cargarReservas = async () => {
    try {
      const data = await digitalBooking.get(
        `/booking/getAll`
      );
      console.error("data", data);
      setBookings(data.data);
      setIsLoading(false)
    
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const deleteProduct = async (bookingId) => {
    try {
      digitalBooking.delete(`/booking/delete/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "¡Exitoso!",
        text: `La reserva se ha eliminado exitosamente.`,
        onClose: cargarReservas(),
      });

      cargarReservas();
    } catch (error) {
      console.log("Error deleting booking:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: `Se produjo un error al eliminar la reserva. Por favor, intenta nuevamente.`,
      });
    }
  };

  return (
    <div className="list">
      {isLoading ? <div className="loading"><div className='loading-spinner'></div></div> :
      <div>
       <ButtonBack />
       <h2 className="page-name">Lista de Reservas</h2>
       <div className="table-container">
         <table className="table-responsive">
           <thead>
             <tr>
               <th>ID</th>
               <th>Tour</th>
               <th>ID del Usuario</th>
               <th>Nombre del Usuario</th>
               <th>Fecha de Inicio</th>
               <th>Fecha de Finalización</th>
               <th>Acciones</th>
             </tr>
           </thead>
           <tbody>
             {bookings.map((booking) => (
               <tr key={booking.idBooking}>
                 <td>#{booking?.idBooking}</td>
                 <td>{booking?.product.nameProduct}</td>
                 <td>{booking?.user.idUser}</td>
                 <td>{booking?.user.name}</td>
                 <td>{dayjs(booking?.initialDate).format('DD/MM/YYYY')}</td>
                 <td>{dayjs(booking?.finishDate).format('DD/MM/YYYY')}</td>
                 <td className="action-column">
                   <button
                     className="btn-delete"
                     onClick={() => deleteProduct(booking.idBooking)}
                   >
                     Eliminar
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
         </div>
       </div>}
    </div>
  );
}

export default AllBookings;