import { useContext, useEffect, useState } from "react";
import { FaHeart, FaMapMarkerAlt, FaRegHeart, FaRegStar } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import digitalBooking from "../api/digitalBooking";
import Swal from "sweetalert2";


const CardRecomendaciones = ({
  idProduct,
  images = [],
  nameProduct,
  duration,
  location,
  descriptionProduct,
  handleOpenModal,
  favoriteCards = [],
  cargarFavoritos,
  showFavoriteOption = true
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { userInformation, setUserInformation } = useContext(UserContext);
  const { user, jwt } = userInformation;
  const navigate = useNavigate();
  const { isLogged } = userInformation;
  const [isLoading, setIsLoading] = useState(false);


  const deleteFavorite = async() => {
    setIsLoading(true)
    await digitalBooking.delete(
      `/favorites/delete/${user.idUser}/${idProduct}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    cargarFavoritos();
    setIsLoading(false)
  }

  const clickFav = async () => {
    if (isLogged && user.role === "USER") {
      if (favoriteCards && favoriteCards.length > 0) {
        const cardEncontrada = favoriteCards.find((card) => card.idProduct === idProduct);
        
        if (cardEncontrada) {
          deleteFavorite()
        } else {
          setIsLoading(true);
          await digitalBooking.post(
            `/favorites/create`,
            {
              user: {
                idUser: user.idUser,
              },
              product: {
                idProduct: idProduct,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          cargarFavoritos();
          setIsLoading(false);
        }
      } else {
        setIsLoading(true);
          await digitalBooking.post(
            `/favorites/create`,
            {
              user: {
                idUser: user.idUser,
              },
              product: {
                idProduct: idProduct,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          cargarFavoritos();
          setIsLoading(false);
      }
    } else {
      if(userInformation.user != undefined){
        Swal.fire({
          customClass: {
            popup: 'alerts'},
          icon: 'warning',
          title: '¡Atención!',
          text: 'Para agregar tours a favoritos debe loggearse como un usuario tipo "USER".',
          showDenyButton: false,
          confirmButtonText: 'Ok',
          denyButtonText: `No`,
        })
      }else{
        Swal.fire({
          customClass: {
            popup: 'alerts'},
          icon: 'warning',
          title: '¡Atención!',
          text: 'Para agregar tours a favoritos primero debe loggearse. ¿Desea loggearse?',
          showDenyButton: true,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/sing-in");
          } else if (result.isDenied) {
          }
        })
      }
     
    }
  };

  useEffect(() => {
    if (favoriteCards) {
      const favorito = favoriteCards.find((card) => card.idProduct === idProduct);
      setIsFavorite(!!favorito);
    } else {
      setIsFavorite(false);
    }
  }, [favoriteCards]);

  return (
    <div>
      <div className="contenedor-productos">
        <div className="contenedor-imagen">
          <img src={images[0].urlImage} alt="image" />
          <div className="contenedor-icono-corazon">
            <button onClick={clickFav} className="flex text-red-600">
              {showFavoriteOption && (isFavorite ? <FaHeart /> : <FaRegHeart />)}
              {isLoading && <div className="loader ml-1"></div> }
            </button>
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
              onClick={() => handleOpenModal(location.urlLocation)}
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
            <Link to={`/recommendation/${idProduct}`}>Ver más</Link>
            <button className="btn-reserva">
              {" "}
              <Link to={`/recommendation/${idProduct}`}>Reservas</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardRecomendaciones;
