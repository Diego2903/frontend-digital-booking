import { useContext, useEffect, useState } from "react";
import digitalBooking from "../api/digitalBooking";
import "./Styles/Recomendaciones.css";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import { ModalMapa } from "./ModalMapa";
import CardRecomendaciones from "./CardRecomendaciones";
import UserContext from "../context/UserContext";

const Recomendaciones = ({ categoriaId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { userInformation } = useContext(UserContext);
  const { user } = userInformation;
  const { jwt } = userInformation;
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [urlLocationSelected, setUrlLocationSelected] = useState("");
  const [favoriteCards, setFavoriteCards] = useState([]);

  const handleOpenModal = (urlLocation) => {
    setModalOpen(true);
    setUrlLocationSelected(urlLocation);
  };

  useEffect(() => {
    async function fetchData() {
      cargarProductos();
      cargarFavoritos();
    }
    fetchData();
  }, [categoriaId]);

  useEffect(() => {
    async function fetchData() {
      cargarProductos();
    }
    fetchData();
  }, [page, pageSize]);

  const cargarProductos = async () => {
    try {
      const data = await digitalBooking.get(
        `/product/getAll?pageSize=${pageSize}&sortField=idProduct&sortOrder=asc&pageNumber=${page}&categoryId=${categoriaId}`
      );
      setProductos(data.data.content);
      setIsLoading(false);
      setTotalPages(data.data.totalPages);
      setTotalElements(data.data.totalElements);
      console.log(categoriaId);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

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
      setFavoriteCards(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handlePageSizeIncrement = () => {
    if (pageSize < totalElements) {
      setPageSize(pageSize + 1);
      setPage(0);
    }
  };

  const handlePageSizeDecrement = () => {
    if (pageSize > 1) {
      setPageSize(pageSize - 1);
      setPage(0);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div className="contenedor-cards-productos">
      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          {productos.map(
            ({
              nameProduct,
              descriptionProduct,
              images,
              idProduct,
              duration,
              location,
            }) => (
              <CardRecomendaciones
                key={idProduct}
                cargarFavoritos={cargarFavoritos}
                favoriteCards={favoriteCards}
                handleOpenModal={handleOpenModal}
                nameProduct={nameProduct}
                descriptionProduct={descriptionProduct}
                images={images}
                idProduct={idProduct}
                duration={duration}
                location={location}
              />
            )
          )}
          <ModalMapa
            isOpen={modalOpen}
            onClose={handleCloseModal}
            location={urlLocationSelected}
          />
          <div className="flex justify-between w-1/4<">
            <div className="align-middle">
              {/* <span className="text-xl mt-5 mx-5">Items por página</span> */}
              <button
                onClick={handlePageSizeDecrement}
                disabled={pageSize === 1}
              >
                <IoIosRemoveCircle className="text-base" />
              </button>
              <span className="mx-5 text-base">Items {pageSize}</span>
              <button
                onClick={handlePageSizeIncrement}
                disabled={pageSize === totalElements}
                className="mt-2"
              >
                <IoIosAddCircle className="text-base" />
              </button>
            </div>
            <div className="align-middle">
              <button onClick={handlePreviousPage} disabled={page === 0}>
                <BsFillArrowLeftCircleFill className="mr-5 text-base" />
              </button>
              <span className="text-base">Página {page + 1}</span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages - 1}
              >
                <BsFillArrowRightCircleFill className="ml-5 text-base" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Recomendaciones;
