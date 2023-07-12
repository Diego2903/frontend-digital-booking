import { FaUsers } from "react-icons/fa";
import { FaListAlt } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import { Link, Navigate} from "react-router-dom";
import UserContext from "../context/UserContext";
import { useContext } from "react";


const PanelAdmin = () => {
    const { userInformation } = useContext(UserContext);
  const {user} = userInformation;

  return (
    <div className='bg-gray-100 overflow-y-auto form-container'>
             <h1 className="font-bold m-5 text-center text-4xl sm:text-5xl lg:text-6xl mb-10">Panel del Administrador</h1>
    <div className=" overflow-y-auto">
      <section className=" flex items-center justify-center gap-3 flex-wrap  ">

    
       <Link to={"/users"}>
        <div className="card bg-white rounded-lg shadow-lg max-w-sm">
            <div className="w-full flex items-center justify-center">

            <FaUsers className="text-green-700 text-[180px] " />
            </div>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-black">Usuarios</div>
                <p className="text-gray-700 text-sm">
                El apartado "Usuarios" es una sección donde se gestionan y administran los perfiles de los usuarios registrados en la plataforma, incluyendo información personal, preferencias y configuraciones.
                </p>
            </div>

        </div>
       </Link>


        <Link to={"/list"}>
        <div className="card bg-white rounded-lg shadow-lg max-w-sm">
            <div className="w-full flex items-center justify-center">
                <FaListAlt className="text-green-700 text-[180px] " />
            </div>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-black">Lista de Tours</div>
                <p className="text-gray-700 text-sm">
                El apartado "Lista de Tours" muestra todos los tours disponibles, permitiendo eliminar y actualizar la categoría de cada uno. Además, se puede crear una nueva categoría si es necesario.
                </p>
            </div>

        </div>
        </Link>

        <Link to={"/admin"}>
        <div className="card bg-white rounded-lg shadow-lg max-w-sm">
        <div className="w-full flex items-center justify-center">

            <IoCreate className="text-green-700 text-[180px] " />
        </div>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-black">Crear Tour</div>
                <p className="text-gray-700 text-sm">
                El apartado "Crear Tour" permite al administrador crear nuevos tours y configurar detalles como destinos, atracciones, horarios, imagenes del tour, guia turistco, duración del mismo, costo, entre otros.
                </p>
            </div>

        </div>

        </Link>

        <Link to={"/listCiudades"}>
        <div className="card bg-white rounded-lg shadow-lg max-w-sm">
        <div className="w-full flex items-center justify-center">

            <FaListAlt className="text-green-700 text-[180px] " />
        </div>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-black">Lista de Ciudades</div>
                <p className="text-gray-700 text-sm">
                El apartado "Lista de Ciudades" muestra al administrador todas las ciudades disponibles, permitiendo crear nuevas, actualizarlas o eliminar las existentes, en caso de ser necesario.
                </p>
            </div>

        </div>

        </Link>
        <Link to={"/listCategorias"}>
        <div className="card bg-white rounded-lg shadow-lg max-w-sm">
        <div className="w-full flex items-center justify-center">

            <FaListAlt className="text-green-700 text-[180px] " />
        </div>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-black">Lista de Categorias</div>
                <p className="text-gray-700 text-sm">
                El apartado "Lista de Categorias" muestra al administrador todas las categorias disponibles, permitiendo crear nuevas, actualizarlas o eliminar las existentes, en caso de ser necesario.
                </p>
            </div>

        </div>

        </Link>
        <Link to={"/bookings"}>
        <div className="card bg-white rounded-lg shadow-lg max-w-sm">
        <div className="w-full flex items-center justify-center">

            <FaListAlt className="text-green-700 text-[180px] " />
        </div>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-black">Reservas</div>
                <p className="text-gray-700 text-sm">
                El apartado "Reservas" muestra al administrador todas las reservas realizadas, detallando usuario, tour elegido y fecha de inicio y finalización, permitiendo eliminar las existentes, en caso de ser necesario.                      
                </p>
            </div>

        </div>

        </Link>

      </section>
</div>
    </div>
  )
}

export default PanelAdmin