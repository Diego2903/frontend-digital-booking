import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Categorias from "./Categorias";
import Recomendaciones from "./Recomendaciones";
import { ModalMapa } from "./ModalMapa";
import { FaMapMarkerAlt, FaRegHeart, FaRegStar } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";
import { RiErrorWarningLine } from "react-icons/ri";
import "./Styles/Recomendaciones.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { DateRangePicker } from "react-date-range";

import "./Styles/Calendar.css";
import "./Styles/Calendar-Booking.css";
import dayjs from "dayjs";
import UserContext from "../context/UserContext";

const Body = () => {
  const [categoriaId, setCategoriaId] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const [productos, setProductos] = useState([]);

  const [showResults, setShowResults] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [urlLocationSelected, setUrlLocationSelected] = useState("");
  const [noProducts, setNoProducts] = useState(false);

  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  const { userInformation, fechasReserva, setFechasReserva } =
    useContext(UserContext);

  const [calendarVisible, setCalendarVisible] = useState(false);
  const calendarRef = useRef(null);

  // const handleDateChange = (dates) => {
  //   const [start, end] = dates;
  //   setStartDate(start);
  //   setEndDate(end);
  // };

  const today = new Date();
  const minDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const handleRangeChange = (ranges) => {
    setFechasReserva(ranges.selection);
    console.log(ranges.selection);
  };

  const { startDate, endDate } = fechasReserva;

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  useEffect(() => {
    axios
      .get("localhost:8080/city/getAll")
      .then((response) => setCities(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleFormSubmit = (event) => {
    const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
    const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");
    event.preventDefault();
    if (
      !selectedCity &&
      formattedStartDate == "Invalid Date" &&
      formattedEndDate == "Invalid Date"
    ) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Debes ingresar al menos un dato para poder hacer la búsqueda.",
        showDenyButton: false,
        confirmButtonText: "Ok",
      });
    } else {
      fetchProducts(selectedCity, formattedStartDate, formattedEndDate);
    }
    setShowResults(true);

    console.log("Fecha de inicio:", formattedStartDate);
    console.log("Fecha de fin:", formattedEndDate);
    setCalendarVisible(false);
  };
  const handleReturn = () => {
    setShowResults(false);
    setNoProducts(false);
    setSelectedCity("");
    setFechasReserva("");
  };

  const fetchProducts = (city, formattedStartDate, formattedEndDate) => {
    setProductos([]);
    let url =
      "http://ec2-18-222-239-12.us-east-2.compute.amazonaws.com:8080/product/getAll?";

    if (city && city.length > 0 && formattedStartDate === "Invalid Date") {
      url += `nameCity=${city}`;
    } else if (
      (city == null || city == "") &&
      formattedStartDate != "Invalid Date"
    ) {
      url += `startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    } else {
      url += `nameCity=${city}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    }

    console.log(url);
    axios
      .get(url)
      .then((response) => {
        // Aquí puedes manejar los productos obtenidos
        // setProductos(response.data.content);

        {
          formattedStartDate != "Invalid Date"
            ? setProductos(
                response.data.content.filter(
                  (product) =>
                    checkDays(formattedStartDate, formattedEndDate, product) ===
                    true
                )
              )
            : setProductos(response.data.content);
        }

        setNoProducts(response.data.content.length === 0);

        console.log(productos);
      })
      .catch((error) => console.log(error));
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleOpenModal = (urlLocation) => {
    console.log(urlLocation);
    setModalOpen(true);
    setUrlLocationSelected(urlLocation);
  };

  const checkDays = (startDate, endDate, product) => {
    if (
      Math.floor(
        dayjs(endDate).diff(dayjs(startDate)) / (1000 * 60 * 60 * 24)
      ) +
        1 >=
      product.duration
    ) {
      console.log(dayjs(endDate).diff(dayjs(startDate)));
      console.log(product.duration);
      return true;
    }
    return false;
  };

  return (
    <div className="body-total grid">
      <div className="movil-buscador flex-column body-buscador">
        <div className="container-text-buscador">
          <p className="text-buscador mb-1 text-2xl text-white py-5 font-bold">
            Busca ofertas en recorridos, aventuras y mucho más
          </p>
        </div>

        <form
          className="movil-buscador-inputs flex pb-5 w-full gap-4"
          onSubmit={handleFormSubmit}
        >
          <div>
            {/* <label htmlFor="cities">Selecciona una ciudad:</label> */}
            <input
              className="input-buscador mb-3 border border-3 rounded-md h-12 px-5"
              list="cityOptions"
              id="cities"
              name="cities"
              value={selectedCity}
              onChange={handleCityChange}
              placeholder="¿A donde quieres ir?"
            />
            <datalist
              id="cityOptions"
              className="input-buscador mb-3 border border-3 rounded-md h-12 px-5"
            >
              {cities.map((city) => (
                <option
                  className="input-buscador mb-3 border border-3 rounded-md h-12 px-5"
                  key={city.nameCity}
                  value={city.nameCity}
                />
              ))}
            </datalist>
          </div>
          <div className="relative">
            <input
              className="input-buscador mb-3 border  border-3 rounded-md h-12 px-5"
              placeholder="Ingresa las fechas del tour"
              type="text"
              onClick={toggleCalendar}
              value={
                startDate
                  ? `${dayjs(startDate).format("YYYY-MM-DD")} - ${dayjs(
                      endDate
                    ).format("YYYY-MM-DD")}`
                  : ""
              }
              readOnly
            />
            {calendarVisible && (
              <div
                ref={calendarRef}
                className="calendar-wrapper border border-red-700 absolute z-40 top-12  mobile-calender"
              >
                <DateRangePicker
                  ranges={[fechasReserva]}
                  onChange={handleRangeChange}
                  minDate={minDate}
                  showDateDisplay={false}
                  inline
                  months={2}
                  direction="horizontal"
                  // disabledDay={disableReservedDates}
                  rangeColors={"#000000"}
                  color="#607D8B"
                />
              </div>
            )}
          </div>
          <button
            onSubmit={handleFormSubmit}
            className="input-buscador mb-3 button-buscador border border-3 rounded-sm h-12 px-5"
          >
            Buscar
          </button>
        </form>
      </div>
      <div className="body-categorias p-3 color-title-body font-bold text-2xl relative">
        <p className="p-categorias mb-3">Buscar por tipo de experiencias</p>
        <Categorias setCategoriaId={setCategoriaId} />
      </div>
      <div className="body-recomendaciones p-3 color-title-body font-bold text-2xl">
        {showResults ? (
          <div className="resultados">
            <p className="p-recomendaciones mb-3">Resultados</p>

            <button className="btn-return" onClick={handleReturn}>
              Volver a las recomendaciones
            </button>
            {noProducts ? (
              <div className="flex flex-col justify-center items-center text-center w-full">
                <RiErrorWarningLine className="text-green-700 text-[180px] " />
                <p className=" p-recomendaciones mb-3">
                  {" "}
                  No hay tours disponibles en la ciudad ingresada.
                </p>
              </div>
            ) : (
              <div className="contenedor-cards-productos">
                {productos.map(
                  ({
                    nameProduct,
                    descriptionProduct,
                    images,
                    idProduct,
                    duration,
                    location,
                  }) => (
                    <div key={idProduct} className="contenedor-productos">
                      <div className="contenedor-imagen">
                        <img src={images[0].urlImage} alt="image" />
                        <div className="contenedor-icono-corazon">
                          <FaRegHeart className="corazon" />
                        </div>
                      </div>
                      <div className="card-contenedor">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            onClick={() =>
                              handleOpenModal(location.urlLocation)
                            }
                            style={{ display: "flex", cursor: "pointer" }}
                          >
                            <FaMapMarkerAlt />
                            <h1 className="card-nombre">{nameProduct}</h1>
                          </div>
                          <div className="texto-duracion">
                            <GiSandsOfTime />
                            <p>Duración: {duration} días</p>
                          </div>
                          <div className="valoracion">
                            <p> Valoración </p>
                            <FaRegStar />
                            <FaRegStar />
                            <FaRegStar />
                            <FaRegStar />
                            <FaRegStar />
                          </div>
                        </div>
                        <div className="contenedor-descripcion-boton">
                          <h1>Descripcion</h1>
                          <p className="texto-producto">
                            {descriptionProduct.length > 20
                              ? descriptionProduct.substring(0, 120) + "..."
                              : descriptionProduct}
                          </p>
                          <Link to={`/recommendation/${idProduct}`}>
                            Ver más
                          </Link>
                          <button className="btn-reserva">
                            {" "}
                            <Link to={`/recommendation/${idProduct}`}>
                              Reservas
                            </Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
                <ModalMapa
                  isOpen={modalOpen}
                  onClose={handleCloseModal}
                  location={urlLocationSelected}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="p-recomendaciones mb-3">Recomendaciones</p>

            <Recomendaciones categoriaId={categoriaId} />
          </>
        )}
      </div>
    </div>
  );
};

export default Body;
