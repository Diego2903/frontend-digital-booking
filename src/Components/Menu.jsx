import  { useContext } from 'react';
import "./Styles/Menu.css"
import { Link, useNavigate } from 'react-router-dom';
import UserContext from "../context/UserContext";


const Menu = () => {
    const {logout,userInformation } = useContext(UserContext);
    const {user} = userInformation;
    const navigate = useNavigate();

    const bookings = () => {
      {user.role === "ADMIN" ? navigate("/bookings") :  navigate("/bookings/"+user.idUser)}
  
    };

  return (
    <nav className={`menu`}>
      <ul>
        <li className='opcion'><Link to="/">Inicio</Link></li>
        {userInformation.isLogged ? (
            <>
            <li className='opcion'><Link to="/profile">Mi Perfil</Link></li>
            {user.role === "ADMIN" ? <li className='opcion mobile-only'><Link to="/panel">Panel Admin</Link></li> : <></> }
            <li className='opcion' onClick={bookings}>Reservas</li>
            {user.role != "ADMIN" ?  <li className='opcion'><Link to="/favoritos">Destinos Favoritos</Link></li> : <></> }
            <li className='opcion' onClick={logout}>Cerrar Sesión</li>
            </> 
        ) : 
            <>
              <li className='opcion'><Link to="/sing-in">Iniciar Sesión</Link></li>
              <li className='opcion'><Link to="/sing-up">Crear Cuenta</Link></li>
            </>
        }
      </ul>
    </nav>
  );
};

export default Menu;