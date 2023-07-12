import { useState, useEffect, useContext } from "react";
import digitalBooking from "../api/digitalBooking";
import "./Styles/List.css";
import ButtonBack from "../Components/ButtonBack";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import UserContext from "../context/UserContext";
import CreateCiudad from "../Components/CreateCiudad";
import Swal from "sweetalert2";

function ListaCiudades() {
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [ciudades, setCiudades] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [selectedCiudad, setSelectedCiudad] = useState("");
  const { userInformation } = useContext(UserContext);
  const { jwt } = userInformation;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    cargarCiudades();
    setModalOpen(false);
  };

  const cargarCiudades = async () => {
    try {
      const data = await digitalBooking.get(`/city/getAll`);
      console.error("data", data);
      setCiudades(data.data);
      setIsLoading(false)
      setTotalPages(data.data.totalPages);
      setTotalElements(data.data.totalElements);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      cargarCiudades();
    }
    fetchData();
  }, [ciudades.idCity]);

  useEffect(() => {
    async function fetchData() {
      cargarCiudades();
    }
    fetchData();
  }, [page, pageSize]);

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

  const deleteCiudad = async (ciudadId) => {
    try {
      await digitalBooking.delete(`/city/delete/${ciudadId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      Swal.fire({
        customClass: {
          popup: 'alerts'},
        icon: "success",
        title: "¡Exitoso!",
        text: `La ciudad se ha eliminado exitosamente.`,
        onClose: cargarCiudades()
      });
    } catch (error) {
      console.log("Error deleting product:", error);
      Swal.fire({
        customClass: {
          popup: 'alerts'},
        icon: "error",
        title: "¡Error!",
        text: `Existen tours en esta ciudad, por favor eliminalos antes de continuar.`,
      });
    }
  };

  const handleCiudadChange = (idCity) => {
    const seleccionarCiudad = ciudades.find((item) => item.idCity == idCity);
    if (seleccionarCiudad) setSelectedCiudad(seleccionarCiudad);
    setModalOpen(true);
  };

  return (
    <div className="list">
        {isLoading ? <div className="loading"><div className='loading-spinner'></div></div> :
      <div className="list">
      <ButtonBack />
      <h2 className="page-name">Lista de Ciudades</h2>
      <div className="contenedor-btn-createCategory">
        <button onClick={handleOpenModal} className="btn-createCategory">
          Crear Ciudad
        </button>
      </div>
      <CreateCiudad
        isOpen={modalOpen}
        onClose={handleCloseModal}
        ciudadSeleccionada={selectedCiudad}
      />
      <div className="table-container">
        <table className="table-responsive">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Ciudad</th>
              <th>Nombre Pais</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ciudades &&
              ciudades.map((ciudad) => (
                <tr key={ciudad.idCity}>
                  <td>#{ciudad.idCity}</td>
                  <td>{ciudad.nameCity}</td>
                  <td>{ciudad.nameCountry}</td>
                  <td
                    className="action-column"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <button
                      className="btn-delete"
                      onClick={() => deleteCiudad(ciudad.idCity)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn-category-change"
                      onClick={() =>
                        handleCiudadChange(ciudad.idCity, selectedCiudad)
                      }
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between w-1/4< p-5">
        <div>
          <button
            onClick={handlePageSizeDecrement}
            disabled={pageSize === 1}
            className="mt-2"
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
        <div>
          <button
            onClick={handlePreviousPage}
            disabled={page === 0}
            className="align-middle"
          >
            <BsFillArrowLeftCircleFill className="mr-5 text-base" />
          </button>
          <span className="mx-5 text-base">Página {page + 1}</span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            className="align-middle"
          >
            <BsFillArrowRightCircleFill className="ml-5 text-base" />
          </button>
        </div>
      </div>
      </div>}
    </div>
  );
}

export default ListaCiudades;
