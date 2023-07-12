import { useContext, useEffect, useState } from "react";
import digitalBooking from "../api/digitalBooking";
import UserContext from "../context/UserContext";
import CardRecomendaciones from "./CardRecomendaciones";
import { ModalMapa } from "./ModalMapa";
// import { FaMapMarkerAlt, FaRegStar } from "react-icons/fa";
// import { GiSandsOfTime } from "react-icons/gi";

const Favoritos = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userInformation } = useContext(UserContext);
  const { jwt } = userInformation;
  const { user } = userInformation;
  const [favoritos, setFavoritos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [urlLocationSelected, setUrlLocationSelected] = useState("");

  const handleOpenModal = (urlLocation) => {
    setModalOpen(true);
    setUrlLocationSelected(urlLocation);
  };

  useEffect(() => {
    async function fetchData() {
      cargarFavoritos();
    }
    fetchData();
  }, []);

  const cargarFavoritos = async () => {
    try {
      const response = await digitalBooking.get(
        `/favorites/getByUser/${user.idUser}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setFavoritos(response.data);
      setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="body-total grid">
       {isLoading ? <div className="loading"><div className='loading-spinner'></div></div> : 
        <div className="body-total grid">
      <div className="body-recomendaciones p-3 color-title-body font-bold text-2xl">
        <div className="contenedor-cards-productos">
          {favoritos.map(
            ({
              nameProduct,
              descriptionProduct,
              images,
              idProduct,
              duration,
              location,
            }) => (
              <CardRecomendaciones
                handleOpenModal={handleOpenModal}
                key={idProduct}
                cargarFavoritos={cargarFavoritos}
                nameProduct={nameProduct}
                descriptionProduct={descriptionProduct}
                images={images}
                idProduct={idProduct}
                duration={duration}
                location={location}
                showFavoriteOption={false}
              />
            )
          )}
          <ModalMapa
            isOpen={modalOpen}
            onClose={handleCloseModal}
            location={urlLocationSelected}
          />
          <div></div>
        </div>
      </div>
      </div>}
    </div>
  );
};

export default Favoritos;
