import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Styles/Detail.css";
import iconPlace from "../assets/iconPlace.svg";
import iconClock from "../assets/iconClock.svg";
import iconCategory from "../assets/iconCategory.svg";
import iconFav from "../assets/iconFav.svg";
import iconShare from "../assets/iconShare.svg";
import iconPrice from "../assets/iconPrice.svg";
import iconGuide from "../assets/iconGuide.svg";
import ButtonBack from "../Components/ButtonBack";
import digitalBooking from "../api/digitalBooking";
import Gallery from "../Components/Gallery";
import { ModalMapa } from "../Components/ModalMapa";
import CalendarReservations from "../Components/Calendar";
import CompartirEnRedes from "../Components/CompartirEnRedes";


const Detail = () => {
  const params = useParams();
  const [tour, setTour] = useState();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [urlLocationSelected, setUrlLocationSelected] = useState("");

  useEffect(() => {
    async function fetchData() {
      cargarTour(params.id);
    }
    fetchData();
  }, [params.id]);

  const cargarTour = async (params) => {
    const data = await digitalBooking.get(`/product/${params}`);
    setTour(data.data);
  };

  if (!tour) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const handleVerMasClick = (productoId) => {
    setSelectedProductId(productoId);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalOpen(false);
  };

  const handleOpenModal = (urlLocation) => {
    console.log(urlLocation);
    setModalOpen(true);
    setUrlLocationSelected(urlLocation);
  };

  return (
    <div className="detail">
      <ButtonBack />
      <div className="place">{tour?.nameProduct}</div>
      <div className="tour-location">
        <span>
          {tour?.ciudad.nameCity} - {tour?.ciudad.nameCountry}
        </span>
      </div>
      <div
        className="ver-mapa"
        onClick={() => handleOpenModal(tour?.location.urlLocation)}
      >
        {" "}
        <img src={iconPlace} alt="" /> Abrir Mapa
      </div>
      <div className="share-like">
        <CompartirEnRedes />
        <img src={iconFav} alt="" />
      </div>
      <div className="tour-images">
        <img className="main-photo" src={tour?.images[0].urlImage} alt="" />
        <div className="sub-photos">
          {tour?.images.slice(1, 5).map((img) => (
            <img key={img.idImages} src={img.urlImage} alt="" />
          ))}
          {tour?.images.length > 5 && (
            <button
              className="ver-mas-btn"
              onClick={() => handleVerMasClick(tour.idProducto)}
            >
              Ver más
            </button>
          )}
        </div>
        {modalVisible && <Gallery tour={tour} onClose={handleCloseModal} />}

        <ModalMapa
          isOpen={modalOpen}
          onClose={handleCloseModal}
          location={urlLocationSelected}
        />
      </div>
      <div className="description">
        <h1 className="title">Descripcion</h1>
        <p className="description-text">{tour?.descriptionProduct}</p>
      </div>
      <div className="atributes-conteiner">
        <h1 className="title">Atributos</h1>
        <div className="atributes">
          <div className="atribute">
            <img src={iconClock} alt="" /> <span> Duración del tour:</span>{" "}
            {tour?.duration} día(s)
          </div>
          <div className="atribute">
            <img src={iconCategory} alt="" /> <span> Categoría:</span>{" "}
            {tour?.category.nameCategory}
          </div>
          <div className="atribute">
            <img src={iconPrice} alt="" /> <span> Precio:</span>
            {tour?.price} USD
          </div>
          <div className="atribute">
            <img src={iconGuide} alt="" /> <span> Guía turístico:</span>{" "}
            {tour?.turistGuide}
          </div>
        </div>
      </div>
      <h1 className="title">Políticas</h1>
      <div className="politics-conteiner">
        <div className="politics">
          <div className="politic">
            <h3>Política de Cancelación</h3>
            <p> {tour?.politics.cancellationPolicy}</p>
          </div>
          <div className="politic">
            <h3>Política de Cambios</h3>
            <p>{tour?.politics.changesPolicy}</p>
          </div>
          <div className="politic">
            <h3>Política de Privacidad</h3>
            <p>{tour?.politics.privacyPolicy}</p>
          </div>
          <div className="politic">
            <h3>Política de Reembolso</h3>
            <p>{tour?.politics.refundPolicy}</p>
          </div>
          <div className="politic">
            <h3>Política de Responsabilidad</h3>
            <p>{tour?.politics.responsibilityPolicy}</p>
          </div>
        </div>
      </div>

      <div className="reservations"> Fechas disponibles </div>

      <CalendarReservations id={tour?.idProduct} />
    </div>
  );
};

export default Detail;
