import React, { useContext, useEffect, useState } from "react";
import TourSummary from "../Components/TourSummary";
import "./Styles/Bookings.css";
import UserInfo from "../Components/UserInfo";
import digitalBooking from "../api/digitalBooking";
import dayjs from "dayjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import CalendarBookings from "../Components/Calendar-Bookings";

const ReservationPage = () => {
  const navigate = useNavigate();
  const { userInformation, fechasReserva, setFechasReserva } =
    useContext(UserContext);
  const { jwt } = userInformation;
  const [users, setUser] = useState({});
  const params = useParams();
  // const location = useLocation();
  // const { startDate, endDate } = location.state;
  const { startDate, endDate } = fechasReserva;
  const [isLoading, setIsLoading] = useState(true);
  const [component1Loaded, setComponent1Loaded] = useState(false);
  const [component2Loaded, setComponent2Loaded] = useState(false);
  const [product, setProduct] = useState();
  const today = new Date();
  const minDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const [reservedRanges, setReservedRanges] = useState([]);

  useEffect(() => {
    const loadComponents = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setComponent1Loaded(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setComponent2Loaded(true);
      setIsLoading(false);
    };

    loadComponents();

    return () => {};
  }, []);

  useEffect(() => {
    async function fetchData() {
      cargarUsuarios();
      cargarProducto();
      fetchReservedRanges();
    }
    fetchData();
  }, [params.id]);

  const cargarUsuarios = async () => {
    const data = await digitalBooking.get(`/api/users/${jwt}`);
    setUser(data.data);
  };

  const cargarProducto = async () => {
    try {
      const data = await digitalBooking.get(`/product/${params.id}`);
      setProduct(data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchReservedRanges = async () => {
    try {
      const data = await digitalBooking.get(`/booking/getAll`);
      setReservedRanges(
        data.data.filter((booking) => booking.product.idProduct == params.id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  // const handleClick = () => {
  //   makeReservation(startDate, endDate);
  // };

  const makeReservation = (startDate, endDate) => {
    const formData = {
      initialDate: dayjs(startDate),
      finishDate: dayjs(endDate),
      product: { idProduct: params.id },
      user: { email: users.email },
    };

    axios;
    digitalBooking
      .post("/booking/create", formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        navigate("/success-booking");
        setFechasReserva({startDate: null,
          endDate: null,
          key: 'selection',});
        console.log(fechasReserva)
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "Se produjo un error al crear la reserva. Por favor, intenta nuevamente.",
        });
      });
  };

  const handleClick = () => {
    if (jwt) {
      if (startDate && endDate) {
        let isAvailable = checkAvailability(startDate, endDate);
        isAvailable = checkDays(startDate, endDate);

        if (isAvailable) {
          makeReservation(startDate, endDate);
        } else {
          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text:
              "Para realizar la reserva debe seleccionar un rango de " +
              product.duration +
              " día(s) donde no se incluya ningún día reservado.",
            showDenyButton: false,
            confirmButtonText: "Ok",
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "Para realizar la reserva debe seleccionar un rango de fechas válido.",
          showDenyButton: false,
          confirmButtonText: "Ok",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Para realizar la reserva primero debe loggearse. ¿Desea loggearse?",
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          setReservationAttempted(true);
          navigate("/sing-in", { state: { reservationAttempted: true } });
        } else if (result.isDenied) {
        }
      });
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
    if (
      Math.floor(
        dayjs(endDate).diff(dayjs(startDate)) / (1000 * 60 * 60 * 24)
      ) +
        1 !=
      product.duration
    ) {
      console.log("Diferencia", dayjs(endDate).diff(dayjs(startDate)));
      console.log(product.duration);
      return false;
    }
    return true;
  };

  return (
    <div className="loading">
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="reservation-page">
          {component1Loaded && component2Loaded ? (
            <div className="reservation-page">
              <div className="left-section">
                <TourSummary />
              </div>

              <div className="right-section">
                <UserInfo />
                <CalendarBookings id={params.id} />
                <div className="button-container">
                  <button className="reserve-button" onClick={handleClick}>
                    Confirmar reserva
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
