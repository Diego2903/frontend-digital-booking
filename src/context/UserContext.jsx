import { createContext, useContext, useState } from "react";
import loginService from "../service/loginService";
import digitalBooking from "../api/digitalBooking";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const initialValues = window.sessionStorage.getItem("userInformation")
  ? JSON.parse(window.sessionStorage.getItem("userInformation"))
  : {
      user: undefined,
      isLogged: false,
      isLoading: false,
      jwt: "",
      isError: false,
      errorMessage: "",
    };
const UserContext = createContext(initialValues);


export const UserContextProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState(initialValues);
  const navigate = useNavigate();

  const [fechasReserva, setFechasReserva] = useState({
    startDate: null,
    endDate: null,
    key: 'selection',
  });

  const login = (email, password) => {
    setUserInformation({ ...userInformation, isLoading: true });
    loginService({ email, password })
      .then((respuesta) => {
        cargarUsuario(respuesta);
      })
      .catch((err) => {
        setUserInformation({
          ...userInformation,
          isLoading: false,
          isError: true,
          errorMessage: "Error inesperado, contacte a su administrador",
          isLogged: false,
        });
        console.error(err);
      });
  };

  const cargarUsuario = async (respuesta) => {
    console.log(respuesta);
    if (respuesta.ok) {
      const data = await digitalBooking.get(`/api/users/${respuesta.jwt}`);
      if (data.data.enabled) {
        setUserInformation({
          ...userInformation,
          jwt : respuesta.jwt,
          isLoading: false,
          isError: false,
          user: data.data,
          errorMessage: '',
          isLogged: true,
        });
        window.sessionStorage.setItem(
          "userInformation",
          JSON.stringify({
            ...userInformation,
            jwt : respuesta.jwt,
            errorMessage: '',
            isLoading: false,
            isError: false,
            user: data.data,
            isLogged: true,
          })
        );
      } else {
        setUserInformation({
          ...userInformation,
          isLoading: false,
          isError: true,
          errorMessage:
            "El correo no ha sido válidado, por favor revisa tu bandeja de mensajes e intenta de nuevo.",
          isLogged: false,
        });
      }
    } else {
      setUserInformation({
        ...userInformation,
        isLoading: false,
        isError: true,
        errorMessage:
        respuesta.message,
        isLogged: false,
      });
    }
  };

  const logout = () => {
    Swal.fire({
      title: "¿Estas seguro que quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
        window.sessionStorage.removeItem("userInformation");
        navigate("/");
        setUserInformation({
          user: null,
          isLogged: false,
          isLoading: false,
          jwt: "",
          isError: false,
          errorMessage: "",
        });
      }
    });
  };

  return (
    <UserContext.Provider value={{ userInformation, login, logout, setUserInformation, fechasReserva, setFechasReserva }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
