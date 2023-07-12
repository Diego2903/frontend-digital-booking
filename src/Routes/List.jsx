import { useState, useEffect, useContext } from "react";
import digitalBooking from "../api/digitalBooking";
import "./Styles/List.css";
import ButtonBack from "../Components/ButtonBack";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import UpdateTour from "../Components/UpdateTour";
import UserContext from "../context/UserContext";
import Swal from "sweetalert2";

function ProductList({ categoriaId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [selectedTour, setSelectedTour] = useState("");
  const { userInformation } = useContext(UserContext);
  const { jwt } = userInformation;

  useEffect(() => {
    async function fetchData() {
      cargarProductos();
      
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
        `/product/getAll?pageSize=${pageSize}&sortField=idProduct&sortOrder=asc&pageNumber=${page}`
      );
      console.error("data", data);
      setProductos(data.data.content);
      setIsLoading(false)
      setTotalPages(data.data.totalPages);
      setTotalElements(data.data.totalElements);
    
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };


  const handleCloseModal = () => {
    cargarProductos();
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

  const deleteProduct = async (tourId) => {
    try {
      digitalBooking.delete(`/product/delete/${tourId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "¡Exitoso!",
        text: `El tour se ha eliminado exitosamente.`,
        onClose: cargarProductos(),
      });

    } catch (error) {
      console.log("Error deleting product:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: `Se produjo un error al eliminar el tour. Por favor, intenta nuevamente.`,
      });
    }
  };

  const handleTourChange = (idTour) => {
    const seleccionarTour = productos.find((item) => item.idProduct == idTour);
    if (seleccionarTour) setSelectedTour(seleccionarTour);
    setModalOpen(true);
  };

  return (
    <div className="list">
      {isLoading ? <div className="loading"><div className='loading-spinner'></div></div> :
         <div className="list">
       <ButtonBack />
       <h2 className="page-name">Lista de Tours</h2>
       <UpdateTour
         isOpen={modalOpen}
         onClose={handleCloseModal}
         tourSeleccionado={selectedTour}
       />
       <div className="table-container">
         <table className="table-responsive">
           <thead>
             <tr>
               <th>ID</th>
               <th>Nombre</th>
               <th>Descripción</th>
               <th>Precio [USD]</th>
               <th>Guía turístico</th>
               <th>Categoría</th>
               <th>Acciones</th>
             </tr>
           </thead>
           <tbody>
             {productos.map((tour) => (
               <tr key={tour.idProduct}>
                 <td>#{tour.idProduct}</td>
                 <td>{tour.nameProduct}</td>
                 <td>{tour.descriptionProduct}</td>
                 <td>{tour.price}</td>
                 <td>{tour.turistGuide}</td>
                 <td>{tour.category.nameCategory}</td>
                 <td className="action-column">
                   <button
                     className="btn-delete"
                     onClick={() => deleteProduct(tour.idProduct)}
                   >
                     Eliminar
                   </button>
                   <button
                     className="btn-category-change"
                     onClick={() => handleTourChange(tour.idProduct)}
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

export default ProductList;
