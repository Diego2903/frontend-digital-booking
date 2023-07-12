import { useContext, useEffect, useState } from "react";
import digitalBooking from "../api/digitalBooking";
import "./Styles/CreateCategory.css";
import UserContext from "../context/UserContext";
import Swal from "sweetalert2";

const CreateCiudad = ({ isOpen, onClose, ciudadSeleccionada }) => {
  const { userInformation } = useContext(UserContext);
  const { jwt } = userInformation;

  console.log(ciudadSeleccionada);

  const [ciudad, setCiudad] = useState({
    idCity: ciudadSeleccionada ? ciudadSeleccionada.idCity : "",
    nameCity: ciudadSeleccionada ? ciudadSeleccionada.nameCity : "",
    nameCountry: ciudadSeleccionada ? ciudadSeleccionada.nameCountry : "",
  });

  const [errors, setErrors] = useState({
    nameCity: "",
    nameCountry: "",
  });

  useEffect(() => {
    setCiudad({
      idCity: ciudadSeleccionada ? ciudadSeleccionada.idCity : "",
      nameCity: ciudadSeleccionada ? ciudadSeleccionada.nameCity : "",
      nameCountry: ciudadSeleccionada ? ciudadSeleccionada.nameCountry : "",
    });
  }, [ciudadSeleccionada]);

  const handleReset = () => {
    // setCiudad({
    //   idCity: "",
    //   nameCity: "",
    //   nameCountry: "",
    // });
    setErrors({
      idCity: "",
      nameCity: "",
      nameCountry: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCiudad((prevCiudad) => ({ ...prevCiudad, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      idCity: ciudad.idCity,
      nameCity: ciudad.nameCity,
      nameCountry: ciudad.nameCountry
    };

    let formIsValid = true;
    const newErrors = {
      idCity: "",
      nameCity: "",
      nameCountry: "",
    };

    if (!ciudad.nameCity) {
      formIsValid = false;
      newErrors.nameCity = "Por favor, ingresa el nombre de la ciudad.";
    }

    if (!ciudad.nameCountry) {
      formIsValid = false;
      newErrors.nameCountry = "Por favor, ingresa el nombre del Pais.";
    }

    setErrors(newErrors);

    if (!formIsValid) {
      return;
    }

    try {
      const existingCiudades = await digitalBooking.get("/city/getAll");
      const ciudadExists = existingCiudades.data.some(
        (c) => c.name === ciudad.nameCity
      );

      if (ciudadExists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          nameCity:
            "El nombre de la ciudad ya existe. Por favor, elija otro nombre.",
        }));
        return;
      }
      if (formData.idCity) {
        await digitalBooking.put(`city/update/${formData.idCity}`, formData, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
      } else {
        await digitalBooking.post("/city/create", formData, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
      }
      Swal.fire({
        icon: "success",
        title: "¡Exitoso!",
        text: `La ciudad se ha ${ciudad.idCity ? 'actualizado' : 'creado'} exitosamente.`,
      });

      setTimeout(() => {
        onClose();
        setCiudad({
          nameCity: "",
          nameCountry: "",
        });
        setErrors({
          nameCity: "",
          nameCountry: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Error al crear la ciudad:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: `Se produjo un error al ${ciudad.idCity ? 'actualizado' : 'creado'} la ciudad. Por favor, intenta nuevamente.`,
      });
      // setErrors((prevErrors) => ({...prevErrors,nameCity: 'Se produjo un error al crear la ciudad. Por favor, intenta nuevamente.',}));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <label>
            Nombre de la ciudad:
            <input
              type="text"
              name="nameCity"
              value={ciudad.nameCity}
              onChange={handleInputChange}
            />
            {errors.nameCity && <p className="error">{errors.nameCity}</p>}
          </label>
          <label>
            Nombre del Pais:
            <input
              type="text"
              name="nameCountry"
              value={ciudad.nameCountry}
              onChange={handleInputChange}
            ></input>
            {errors.nameCountry && (
              <p className="error">{errors.nameCountry}</p>
            )}
          </label>
          <div>
            <button
              className="btn-close"
              onClick={() => {
                handleReset();
                onClose();
              }}
            >
              Regresar
            </button>
            <button type="submit">{ciudad.idCity ? "Actualizar" : "Crear"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCiudad;
