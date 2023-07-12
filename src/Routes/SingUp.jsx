import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import digitalBooking from "../api/digitalBooking";
import Swal from 'sweetalert2'

const SingUp = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    
    const onSubmit = (data) => {
        const formData = {
            email: data.email,
            name: data.name,
            password: data.password,
        };

        axios;
        digitalBooking
            .post("/api/sign-up", formData)
            .then((response) => {
                console.log(response.data);
                reset();
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Usuario Creado!',
                    text: 'Te enviaremos un correo para validar tu cuenta. Tienes 48 horas antes de que el correo expire y debas volver a registrarte.',
                  
                  })
        
                navigate("/sing-in");
            })
            .catch((error) => {
                console.error(error);
            });
        console.log(formData);
    };
    return (
        <div className="form-container gap-5 bg-gray-100">
            <h1 className=" w-full mb-9  text-center font-bold text-black">
                Registrarse
            </h1>
            <form
                className="w-[80%]  flex flex-col items-center"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid  grid-cols-1   items-center   text-center w-full gap-10">
                    <div className="relative ">
                        <input
                            name="Nombre de usuario"
                            placeholder=" "
                            className="inputsSinUp"
                            {...register('name', {
                                required: 'El nombre es requerido',
                                pattern: {
                                  value: /^[A-Za-z\s]+$/,
                                  message: 'Ingresa solo letras en el nombre',
                                },
                              })}
                        />

                        <label className="labelsUp" htmlFor="name">
                            Nombre Completo
                        </label>
                       
                        {errors.name && <p  className="text-red-500 ">{errors.name.message}</p>}
                    </div>
                    
                    <div className="relative ">
                        <input
                            name="Email"
                            placeholder=" "
                            className="inputsSinUp  "
                            {...register('email', {
                                required: 'El email es requerido',
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: 'Ingresa un email válido',
                                },
                              })}
                        />

                        <label className="labelsUp" htmlFor="email">
                            Email
                        </label>
                        {errors.email && <p  className="text-red-500 ">{errors.email.message}</p>}
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            placeholder=" "
                            className="inputsSinUp "
                            {...register('password', {
                                required: 'La contraseña es requerida',
                                minLength: {
                                  value: 6,
                                  message: 'La contraseña debe tener al menos 6 caracteres',
                                },
                              })}
                        />
                        <label className="labelsUp">Contraseña</label>
                        {errors.password && <p className="text-red-500 ">{errors.password.message}</p>}
                    </div>
                </div>

                <button
                    className=" btn-cuenta mt-10 hover:text-white hover:bg-black"
                    type="submit"
                >
                    Registrarse
                </button>
            </form>
            <p className="text-black">
                ¿Ya tienes cuenta?
                <Link to={"/sing-in"}> Ingresa aquí</Link>
            </p>
        </div>
    );
};

export default SingUp;
