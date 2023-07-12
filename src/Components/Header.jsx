import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { useCallback, useContext, useEffect, useState } from "react";
import BotonesCuenta from "./BotonesCuenta";
import Menu from "./Menu";
import "./Styles/Header.css";
import UserContext from "../context/UserContext";
import logo from "../../images/logo2.png"


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, userInformation } = useContext(UserContext);
  const { user } = userInformation;
  const [inicialesUsuario, setInicialesUsuario] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setMenuOpen(!isMenuOpen);
  };

  const processUserName = useCallback(() => {
    if (user?.name?.includes(" ")) {
      const nameParts = user?.name?.split(" ");
      const iniciales = nameParts
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();
      return iniciales;
    } else {
      const iniciales = user?.name?.substring(0, 2).toUpperCase() || "";
      return iniciales;
    }
  }, [user?.name]);

  useEffect(() => {
    setInicialesUsuario(processUserName());
  }, [user, processUserName]);

  return (
    <div className="componente-header">
      <div className="componente-logo">
        <Link to="/">
          <img className="logo" src={logo} alt="logo" />
          <p className="eslogan">Descubre, vive y viaja</p>
        </Link>
      </div>

      <div className="componente-cuenta">
        {userInformation.isLogged ? (
          <div className="contenedor-sesion">
            {user?.role === "ADMIN" ? (
              <Link to={"/panel"}>
                <div className="contenedor-avatar">
                  <p className="avatar-usuario">
                    <RiAdminLine className="text-[40px]" />
                  </p>
                  <span className=" text-base font-bold text-black hover:text-green-700 ">
                    Panel
                  </span>
                </div>
              </Link>
            ) : (
              <></>
            )}
            {/* <Link to="/profile"> */}
              <div className="contenedor-avatar"  onClick={handleClick}>
                <p className="avatar-usuario">{inicialesUsuario}</p>
                <span className="nombre-usuario text-black hover:text-green-700 ">
                  {user.name}
                </span>
                </div>
            {/* </Link> */}
            {/* <div className="cerrar-sesion contenedor-avatar" onClick={logout}>
              <FiLogOut className="icono-logout text-[40px]" />
              <span className="hover:text-green-700 text-base font-bold text-black">
                Salir
              </span>
            </div> */}
          </div>
        ) : (
          <BotonesCuenta />
        )}
        <div
          className={`icono-hamburguesa ${isOpen ? "isActive" : ""}`}
          onClick={handleClick}
        >
          <i> {isOpen ? <FaTimes /> : <FaBars />} </i>
        </div>
        {isMenuOpen && <Menu />}
      </div>
    </div>
  );
};

export default Header;
