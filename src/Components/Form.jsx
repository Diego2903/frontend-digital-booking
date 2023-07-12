import "./Styles/Form.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import digitalBooking from "../api/digitalBooking";
import UserContext from "../context/UserContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();
  const { remove } = useFieldArray({
    control,
    name: "inputs",
  });
  const [imagenes, setImagenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showError, setShowError] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [politicas, setPoliticas] = useState([]);
  const { userInformation } = useContext(UserContext);
  const { jwt } = userInformation;
  const navigate = useNavigate();

  const cargarCategorias = async () => {
    const data = await digitalBooking.get("/category/getAll");
    setCategorias(data.data);
  };

  const cargarCiudades = async () => {
    const data = await digitalBooking.get("/city/getAll");
    setCiudades(data.data);
  };

  const cargarPoliticas = async () => {
    const data = await digitalBooking.get("/politics/getAll");
    setPoliticas(data.data);
  };

  const cargarProductos = async () => {
    const data = await digitalBooking.get("/product/allRandom");
    setProductos(data.data);
  };

  const handleImagenesChange = (event) => {
    const files = event.target.files;
    const imagenesArray = Array.from(files);
    setImagenes(imagenesArray);

    console.log(imagenes);
  };

  const cargarCiudad = async (data) => {
    const newCity = {
      nameCity: data.nameCity,
      nameCountry: data.nameCountry,
    };

    const existingCity = ciudades.find(
      (city) => city.nameCity === data.nameCity
    );

    let ciudadId;

    if (existingCity) {
      ciudadId = existingCity.idCity;
      return ciudadId;
    } else {
      axios;
      await digitalBooking
        .post("/city/create", newCity, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          ciudadId = response.data.idCity;
          return ciudadId;
        })
        .catch((error) => {
          console.error(error);
        });
    }

    return ciudadId;
  };

  const cargarLocation = async (data) => {
    const newLocation = {
      latitude: data.latitude,
      longitude: data.longitude,
      urlLocation: data.urlLocation,
    };

    let locationId;
    axios;
    await digitalBooking
      .post("/location/create", newLocation, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        locationId = response.data.idLocation;
        return locationId;
      })
      .catch((error) => {
        console.error(error);
      });

    return locationId;
  };

  const callBack = (data, ciudadId, locationId) => {
    const formData = {
      nameProduct: data.nameProduct,
      descriptionProduct: data.descriptionProduct,
      price: (data.price = parseInt(data.price)),
      turistGuide: data.turistGuide,
      category: { idCategory: (data.category = parseInt(data.category)) },
      duration: (data.duration = parseInt(data.duration)),
      images: data.inputs.map((input, index) => ({
        nameImage: "img" + index + data.nameProduct,
        urlImage: input.value,
      })),
      ciudad: { idCity: ciudadId },
      location: { idLocation: locationId },
      politics: { idPolitics: (data.politics = parseInt(data.politics)) },
    };

    const aux = productos.map((product) => product.nameProduct);

    if (aux.includes(formData.nameProduct)) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1000);
    } else {
      axios;
      digitalBooking
        .post("/product/create", formData, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          for (const imagen of imagenes) {
            console.log(imagen.name);
            var formdata = new FormData();
            formdata.append("file", imagen, imagen.name);

            var requestOptions = {
              method: "POST",
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
              body: formdata,
              redirect: "follow",
            };

            fetch(
              "https://backend-digital-booking-production.up.railway.app/s3/upload/" +
                response.data.idProduct,
              requestOptions
            )
              .then((response) => {
                console.log(response);
              })
              .catch((error) => console.log("error", error));
          }

          reset();
          remove();

          Swal.fire({
            icon: "success",
            title: "¡Exitoso!",
            text: "El tour se ha creado exitosamente. ¿Quiere seguir creando más tours?",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
          }).then((result) => {
            if (result.isConfirmed) {
            } else if (result.isDenied) {
              navigate("/");
            }
          });
        })
        .catch((error) => {
          console.error(error);
          console.log(formData);
          Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Se produjo un error al crear el tour. Por favor, intenta nuevamente.",
          });
        });
    }
  };

  useEffect(() => {
    async function fetchData() {
      cargarCategorias();
      cargarCiudades();
      cargarPoliticas();
      cargarProductos();
    }
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    const ciudadId = await cargarCiudad(data);
    const locationId = await cargarLocation(data);

    callBack(data, ciudadId, locationId);
  };

  return (
    <div className="form-container bg-gray-100 overflow-auto ">
      <h1 className="mb-9 text-center font-bold text-black text-4xl">
        Crear nuevo tour
      </h1>

      <form
        className="max-w-screen-lg mx-auto  w-[70%] h-[80%]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <h2 className="bg-gray-200 text-gray-800 text-l font-bold px-4 py-2 mb-5 mt-5">
            Datos Generales
          </h2>
          <label
            className="left-12 top-1 transition-all text-black"
            htmlFor="nameProduct"
          >
            Nombre del tour
          </label>
          <input
            name="Nombre del producto"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("nameProduct", { required: true })}
          />
          {errors.nameProduct && (
            <p className="text-red-500 ">Este campo es requerido</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="left-12 top-1 transition-all text-black"
          >
            Categoría
          </label>
          <select
            name="categoria"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("category", { required: true })}
          >
            <option value=""></option>
            {categorias.map((category) => (
              <option key={category.idCategory} value={category.idCategory}>
                {category.nameCategory}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className="text-red-500">Este campo es requerido</p>
          )}
        </div>
        <div className="mb-4">
          <label className="left-12 top-1 transition-all text-black">
            Descripción del tour
          </label>
          <textarea
            name="descriptionProduct"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("descriptionProduct", {
              required: true,
            })}
          />

          {errors.descriptionProduct && (
            <p className="text-red-500 ">Este campo es requerido</p>
          )}
        </div>
        <div className="mb-4">
          <label className="left-12 top-1 transition-all text-black">
            Duración del tour
          </label>
          <input
            name="duration"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("duration", { required: true })}
          />
          {errors.duration && (
            <p className="text-red-500">Este campo es requerido</p>
          )}
        </div>
        <div className="mb-4">
          <label className="left-12 top-1 transition-all text-black">
            Guía Turístico
          </label>
          <input
            name="turistGuide"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("turistGuide", { required: true })}
          />
          {errors.turistGuide && (
            <p className="text-red-500">Este campo es requerido</p>
          )}
        </div>
        <div className="mb-4">
          <label className="left-12 top-1 transition-all text-black">
            Precio del tour
          </label>
          <input
            name="price"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("price", { required: true })}
          />
          {errors.price && (
            <p className="text-red-500">Este campo es requerido</p>
          )}
        </div>

        <h2 className="bg-gray-200 text-gray-800 text-l font-bold px-4 py-2 mb-5 mt-5">
          Datos de Ubicación
        </h2>
        <div className="mb-4">
          <label
            className="left-12 top-1 transition-all text-black"
            htmlFor="nameCity"
          >
            Ciudad
          </label>
          <input
            name="Ciudad"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("nameCity", { required: true })}
          />

          {errors.nameCity && (
            <p className="text-red-500 ">Este campo es requerido</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="left-12 top-1 transition-all text-black"
            htmlFor="nameCountry"
          >
            Pais
          </label>
          <input
            name="Pais"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("nameCountry", { required: true })}
          />

          {errors.nameCountry && (
            <p className="text-red-500 ">Este campo es requerido</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="left-12 top-1 transition-all text-black"
            htmlFor="latitude"
          >
            Latitud
          </label>
          <input
            name="Latitud"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("latitude", { required: true })}
          />

          {errors.latitude && (
            <p className="text-red-500 ">Este campo es requerido</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="left-12 top-1 transition-all text-black"
            htmlFor="longitude"
          >
            Longitud
          </label>
          <input
            name="Longitud"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("longitude", { required: true })}
          />

          {errors.longitude && (
            <p className="text-red-500 ">Este campo es requerido</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="left-12 top-1 transition-all text-black"
            htmlFor="urlLocation"
          >
            URL ubicación
          </label>
          <input
            name="URL Ubicacion"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("urlLocation", { required: true })}
          />

          {errors.urlLocation && (
            <p className="text-red-500 ">Este campo es requerido</p>
          )}
        </div>
        <h2 className="bg-gray-200 text-gray-800 text-l font-bold px-4 py-2 mb-5 mt-5">
          Políticas
        </h2>
        <div className="mb-4">
          <label
            htmlFor="politics"
            className="left-12 top-1 transition-all text-black"
          >
            Políticas
          </label>
          <select
            name="politics"
            placeholder=" "
            className="border border-gray-300 rounded px-4 py-2 w-full"
            {...register("politics", { required: true })}
          >
            <option value=""></option>
            {politicas.map((politic) => (
              <option key={politic.idPolitics} value={politic.idPolitics}>
                Políticas - Paquete N° {politic.idPolitics}
              </option>
            ))}
          </select>

          {errors.politics && (
            <p className="text-red-500">Este campo es requerido</p>
          )}
        </div>
        <h2 className="bg-gray-200 text-gray-800 text-l font-bold px-4 py-2 mb-5 mt-5">
          Imagenes
        </h2>

        <div className="flex flex-col items-center">
          <div className="w-full flex flex-col items-center">
            <input
              className=" mb-5 border border-gray-300 rounded px-4 py-2 w-full"
              type="file"
              multiple
              onChange={handleImagenesChange}
            />
            {/* {fields.map((field, index) => (
              <div className="relative mb-5 w-full" key={field.id}>
                <label
                  className="left-12 top-1 transition-all text-black"
                  htmlFor="dd"
                >
                  Imagen N° {index + 1}
                </label>
                <div className="flex flex-row items-center">
                  <input
                    placeholder=" "
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    type="text"
                    {...register(`inputs.${index}.value`, {
                      required: true,
                    })}
                    defaultValue={field.value}
                  />
                  <button
                    className="text-red-400 text-2xl"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              </div>
            ))} */}
            {/* <button
              className="mb-20 w-1/2 py-2 bg-white px-4 border border-gray-400 rounded shadow mb-10 hover:text-white hover:bg-black"
              type="button"
              onClick={() => append({ value: "" })}
            >
              Agregar imagen
            </button> */}

            {showError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline">
                  El Tour que estas ingresando se encuentra registrado.
                </span>
              </div>
            )}
            <button
              className="w-1/2 py-2 px-4 border border-gray-400 rounded shadow mb-10 hover:text-white hover:bg-green-700"
              type="submit"
            >
              Registrar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
