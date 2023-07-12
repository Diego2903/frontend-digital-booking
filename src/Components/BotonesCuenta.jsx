
import { Link } from "react-router-dom";
import './Styles/Header.css'

const BotonesCuenta = () => {
    return (
        <>
            <Link to={"/sing-in"}>
                <button className="btn-cuenta btn-hidden btn-hidden hover:text-white hover:bg-black">
                    Iniciar sesión
                </button>
            </Link>
            <Link to={"/sing-up"}>
                <button className="btn-cuenta btn-hidden hover:text-white hover:bg-black">
                    Crear cuenta
                </button>
            </Link>
        </>
    );
};

export default BotonesCuenta;
