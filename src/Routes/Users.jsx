import { useContext, useEffect, useState } from "react";
import digitalBooking from "../api/digitalBooking";
import { nanoid } from "nanoid";
import { FiEdit } from "react-icons/fi";
import "./Styles/Usuarios.css";
import UserContext from "../context/UserContext";
import Swal from "sweetalert2";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import ButtonBack from "../Components/ButtonBack";

const TablaColumnasHeader = ({ nombre }) => (
  <th className="px-5 text-black py-5 border-b border-gray-200 text-left subtitle-table threeDots">
    {nombre}
  </th>
);

const Users = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(8);
  const [rolSelected, setRolSelected] = useState("");
  const [userSelected, setUserSelected] = useState("");
  const { userInformation } = useContext(UserContext);
  const { jwt } = userInformation;
  const roles = ["ADMIN", "USER"];
  const headers = ["Usuarios", "Roles", "Acciones"];

  useEffect(() => {
    async function fetchData() {
      cargarUsuarios();
      
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      cargarUsuarios();
    }
    fetchData();
  }, [page, pageSize]);

  useEffect(() => {
    if (rolSelected !== "") {
      async function fetchData() {
        actualizarUsuarios();
      }
      fetchData();
    }
  }, [rolSelected]);

  const cargarUsuarios = async () => {
    try {
      const data = await digitalBooking.get(
        `/api/users?page=${page}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setUsuarios(data.data.content);
      setIsLoading(false);
      setTotalPages(data.data.totalPages);
      setTotalElements(data.data.totalElements);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const actualizarUsuarios = async () => {
    try {
      const updateData = {
        role: rolSelected,
      };

      await digitalBooking.put(`api/users/${userSelected}`, updateData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setUserSelected("");
      cargarUsuarios();
      Swal.fire({
        icon: "success",
        title: "¡Exitoso!",
        text: "El rol del usuario se ha actualizado exitosamente.",
      });
    } catch (error) {
      console.error("Error actualizando usuarios:", error);
      setUserSelected("");
      cargarUsuarios();
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Se produjo un error al actualizar el rol del usuario. Por favor, intenta nuevamente.",
      });
    }
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
    <div className="usuarios">
      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div>
          <ButtonBack />
          <h2 className="font-bold text-lg p-5 bg-lime-500 mb-5 ;">
            Maestro de Usuarios
          </h2>
          <div className="table-container">
            <table className="table-responsive">
              <thead>
                <tr className="uppercase leading-normal">
                  {headers.map((header) => (
                    <TablaColumnasHeader key={nanoid()} nombre={header} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={nanoid()}>
                    <td className="px-5 border-b border-gray-200 text-sm threeDots pt-6">
                      {usuario.email}
                    </td>
                    <td
                      className={`px-5 border-b border-gray-200 text-sm threeDots pt-6 ${
                        userSelected === usuario.email ? "bg-gray-200" : ""
                      }`}
                    >
                      {userSelected === usuario.email ? (
                        <select
                          name="nuevoRol"
                          className="bg-gray-200 cursor-pointer"
                          onChange={(e) => {
                            setRolSelected(e.target.value);
                          }}
                        >
                          {roles.map((rol) => (
                            <option
                              key={nanoid()}
                              value={rol}
                              selected={rol === usuario.role}
                            >
                              {rol}
                            </option>
                          ))}
                        </select>
                      ) : (
                        usuario.role
                      )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <div className="flex flex-row space-x-2 justify-start">
                        <div>
                          {/* <Tooltip
                                    title='Editar role'
                                    enterTouchDelay={0}
                                    placement='top'
                                    arrow
                                    className='text-lg'
                                    >
                                </Tooltip> */}
                          <button
                            type="button"
                            onClick={() => setUserSelected(usuario.email)}
                            data-tooltip-id="editar-rol"
                          >
                            <FiEdit className="text-2xl" />
                          </button>
                          <ReactTooltip
                            id="editar-rol"
                            place="top"
                            content="Editar rol"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <div className="align-middle mt-2">
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
        </div>
      )}
    </div>
  );
};

export default Users;
