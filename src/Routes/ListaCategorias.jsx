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
import Swal from "sweetalert2";
import CreateCategory from "../Components/CreateCategory";

function ListaCategorias() {
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [selectCategoria, setSelectedCategoria] = useState("");
  const { userInformation } = useContext(UserContext);
  const { jwt } = userInformation;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    cargarcategorias();
    setModalOpen(false);
  };

  const cargarcategorias = async () => {
    try {
      const data = await digitalBooking.get(`/category/getAll`);
      setCategorias(data.data);
      setIsLoading(false)
      setTotalPages(data.data.totalPages);
      setTotalElements(data.data.totalElements);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      cargarcategorias();
    }
    fetchData();
  }, [categorias.idCategory]);

  useEffect(() => {
    async function fetchData() {
      cargarcategorias();
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


  const deleteCategoria = async (categoriaId) => {
    try {
      await digitalBooking.delete(`/category/delete/${categoriaId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      Swal.fire({
        customClass: {
          popup: 'alerts'},
        icon: "success",
        title: "¡Exitoso!",
        text: `La categoria se ha eliminado exitosamente.`,
        onClose: cargarcategorias(),
      });
    } catch (error) {
      let messageText = `Se produjo un error al eliminar la categoria. Por favor, intenta nuevamente.`;
      if (error.response.data) {
        messageText = error.response.data;
      }
      Swal.fire({
        customClass: {
          popup: 'alerts'},
        icon: "error",
        title: "¡Error!",
        text: messageText,
      });
    }
  };

  const handleCategoriaChange = (idCategory) => {
    const seleccionarcategoria = categorias.find((item) => item.idCategory == idCategory
    );
    if (seleccionarcategoria) setSelectedCategoria(seleccionarcategoria);
    console.log(seleccionarcategoria)
    setModalOpen(true);
  };

  return (
    <div className="list">
      {isLoading ? <div className="loading"><div className='loading-spinner'></div></div> :
        <div className="list">
      <ButtonBack />
      <h2 className="page-name">Lista de categorias</h2>
      <div className="contenedor-btn-createCategory">
        <button onClick={handleOpenModal} className="btn-createCategory">
          Crear Categoria
        </button>
      </div>
      <CreateCategory
        isOpen={modalOpen}
        onClose={handleCloseModal}
        categoriaSeleccionada={selectCategoria}
      />
      <div className="table-container">
        <table className="table-responsive">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias &&
              categorias.map((categoria) => (
                <tr key={categoria.idCategory}>
                  <td>#{categoria.idCategory}</td>
                  <td>
                    <img src={categoria.image} alt={categoria.nameCategory} />
                  </td>
                  <td>{categoria.nameCategory}</td>
                  <td>{categoria.descriptionCategory}</td>
                  <td>
                    <div
                      className="action-column"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <button
                        className="btn-delete"
                        onClick={() => deleteCategoria(categoria.idCategory)}
                      >
                        Eliminar
                      </button>
                      <button
                        className="btn-category-change"
                        onClick={() =>
                          handleCategoriaChange(
                            categoria.idCategory,
                            selectCategoria
                          )
                        }
                      >
                        Actualizar
                      </button>
                    </div>
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

export default ListaCategorias;
