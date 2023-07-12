import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CredencialesInvalidas } from "../Components/CredencialesInvalidas";
import UserContext from "../context/UserContext";

const SingIn = () => {
  const location = useLocation();
  const reservationAttempted = location.state && location.state.reservationAttempted;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, userInformation, setUserInformation } = useContext(UserContext);

  useEffect(() => {
    if (userInformation.isLogged) navigate("/", { replace: true });
  }, [userInformation.isLogged, navigate]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  
  const handleCloseModal = () => {
    console.log("Hola");
    setUserInformation( {...userInformation, isError: false})
    reset({})
  };

  const onSubmit = (data) => {
    console.log(data);
    login(email, password);
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(onSubmit)(e);
  };

  return (
    <div className="form-container gap-5 bg-gray-100">
       {reservationAttempted && <p  className="bg-white rounded-md text-center relative lg:w-[60%]  w-[80%] md:w-[60%] sm:w-[50%] ">El login es obligatorio para reservar un tour. En caso de no estar registrado, <Link to={"/sing-up"}> registrate aquí</Link></p>}
      <h1 className=" w-full mb-9  text-center font-bold text-black">
        Iniciar Sesión
      </h1>
      {userInformation.isLoading && <strong>Validando credenciales...</strong>}
      {!userInformation.isLoading && (
        <form
          className="w-[80%]  flex flex-col items-center"
          onSubmit={loginSubmit}
        >
          <div className="flex flex-col items-center  w-[100%] md:w-[65%]  lg:w-[60%] text-center  gap-10">
            <div className="relative lg:w-[60%]  w-[80%] md:w-[60%] sm:w-[50%] ">
              <input
                name="Email"
                placeholder=" "
                className="inputsSingIn "
                {...register("email", { required: true })}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />

              <label className="labels" htmlFor="email">
                Email
              </label>
              {errors.email && (
                <p className="text-red-500 ">Este campo es requerido</p>
              )}
            </div>

            <div className="relative lg:w-[60%]  w-[80%] md:w-[60%] sm:w-[50%] ">
              <input
                type="password"
                name="password"
                placeholder=" "
                className="inputsSingIn "
                {...register("password", { required: true })}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <label className="labels">Contraseña</label>
              {errors.password && (
                <p className="text-red-500">Este campo es requerido</p>
              )}
            </div>
          </div>

          <button
            className=" btn-cuenta mt-10 hover:text-white hover:bg-black"
            type="submit"
          >
            Ingresar
          </button>
        </form>
      )}
      {userInformation.isError &&(
        <CredencialesInvalidas
          isOpen={userInformation.isError}
          onClose={handleCloseModal}
          mensaje={userInformation.errorMessage}
        />
      )}
      <p className="text-black">
        ¿Aún no tienes cuenta?
        <Link to={"/sing-up"}> Registrate aquí</Link>
      </p>
    </div>
  );
};

export default SingIn;
