import { useContext, useEffect, useState } from "react";
import digitalBooking from "../api/digitalBooking";
import "./Styles/CreateCategory.css";
import UserContext from "../context/UserContext";
import Swal from "sweetalert2";

const UpdateTour = ({ isOpen, onClose, tourSeleccionado }) => {
  const { userInformation } = useContext(UserContext);
  const { jwt } = userInformation;
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("initialValue");

  useEffect(() => {
    async function fetchData() {
      cargarCategorias();
    }
    fetchData();
  }, []);

  const cargarCategorias = async () => {
    const data = await digitalBooking.get("/category/getAll");
    setCategories(data.data);
  };

  const [tour, setTour] = useState({
    idProduct: tourSeleccionado ? tourSeleccionado.idProduct : "",
    nameProduct: tourSeleccionado ? tourSeleccionado.nameProduct : "",
    descriptionProduct: tourSeleccionado ? tourSeleccionado.descriptionProduct : "",
    price: tourSeleccionado ? tourSeleccionado.price : "",
    turistGuide: tourSeleccionado ? tourSeleccionado.turistGuide : "",
    category: tourSeleccionado ? tourSeleccionado.category : "",
  });

  const [errors, setErrors] = useState({
    idProduct: "",
    nameProduct: "",
    descriptionProduct: "",
    price: "",
    turistGuide: "",
    category: "",
  });

  useEffect(() => {
    setTour({
      idProduct: tourSeleccionado ? tourSeleccionado.idProduct : "",
      nameProduct: tourSeleccionado ? tourSeleccionado.nameProduct : "",
      descriptionProduct: tourSeleccionado
        ? tourSeleccionado.descriptionProduct
        : "",
      price: tourSeleccionado ? tourSeleccionado.price : "",
      turistGuide: tourSeleccionado ? tourSeleccionado.turistGuide : "",
      category: tourSeleccionado ? tourSeleccionado.category : "",
    });

  }, [tourSeleccionado]);

  const handleReset = () => {
    setErrors({
      idProduct: "",
      nameProduct: "",
      descriptionProduct: "",
      price: "",
      turistGuide: "",
      category: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTour((prevTour) => ({ ...prevTour, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      idProduct: tour.idProduct,
      nameProduct: tour.nameProduct,
      descriptionProduct: tour.descriptionProduct,
      price: tour.price,
      turistGuide: tour.turistGuide,
      category: selectedCategory == "initialValue"
          ? { idCategory: tour.category.idCategory }
          : { idCategory: selectedCategory },
    };

    console.log(selectedCategory)
    console.log(tour.category.idCategory)

    let formIsValid = true;
    const newErrors = {
      idProduct: "",
      nameProduct: "",
      descriptionProduct: "",
      price: "",
      turistGuide: "",
      category: "",
    };

    if (!tour.nameProduct) {
      formIsValid = false;
      newErrors.nameProduct = "Por favor, ingresa el nombre del tour.";
    }

    if (!tour.descriptionProduct) {
      formIsValid = false;
      newErrors.descriptionProduct =
        "Por favor, ingresa la descripción del tour.";
    }

    if (!tour.price) {
      formIsValid = false;
      newErrors.price = "Por favor, ingresa el valor del tour.";
    }

    if (!tour.turistGuide) {
      formIsValid = false;
      newErrors.turistGuide = "Por favor, ingresa el guía turístico del tour.";
    }

    if (!tour.category) {
      formIsValid = false;
      newErrors.category = "Por favor, ingresa la categoría del tour.";
    }

    setErrors(newErrors);

    if (!formIsValid) {
      return;
    }

    try {
      if (formData.idProduct) {
        await digitalBooking.put(
          `product/update/${formData.idProduct}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
      }
      Swal.fire({
        customClass: {
          popup: "alerts",
        },
        icon: "success",
        title: "¡Exitoso!",
        text: `El tour se ha actualizado exitosamente.`,
      });

      setTimeout(() => {
        onClose();
        // setTour({
        //     nameProduct: "",
        //     descriptionProduct: "",
        //     price: "",
        //     turistGuide: "",
        //     category: "",
        // });
        setErrors({
          nameProduct: "",
          descriptionProduct: "",
          price: "",
          turistGuide: "",
          category: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar el tour: ", error);
      Swal.fire({
        customClass: {
          popup: "alerts",
        },
        icon: "error",
        title: "¡Error!",
        text: `Se produjo un error al actualiza el tour. Por favor, intenta nuevamente.`,
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
            Nombre del tour:
            <input
              type="text"
              name="nameProduct"
              value={tour.nameProduct}
              onChange={handleInputChange}
            />
            {errors.nameProduct && (
              <p className="error">{errors.nameProduct}</p>
            )}
          </label>
          <label>
            Descripción del tour:
            <input
              type="text"
              name="descriptionProduct"
              value={tour.descriptionProduct}
              onChange={handleInputChange}
            ></input>
            {errors.descriptionProduct && (
              <p className="error">{errors.descriptionProduct}</p>
            )}
          </label>
          <label>
            Precio [USD]:
            <input
              type="number"
              name="price"
              value={tour.price}
              onChange={handleInputChange}
            ></input>
            {errors.price && <p className="error">{errors.price}</p>}
          </label>
          <label>
            Guía Turístico:
            <input
              type="text"
              name="turistGuide"
              value={tour.turistGuide}
              onChange={handleInputChange}
            ></input>
            {errors.turistGuide && (
              <p className="error">{errors.turistGuide}</p>
            )}
          </label>
          <label>
            Categoría:
            <select
              value={selectedCategory.idCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
            >
              {categories.map((category) => (
                <option
                  key={category.idCategory}
                  value={category.idCategory}
                  selected={
                    category.nameCategory === tour.category.nameCategory
                  }
                >
                  {category.nameCategory}
                </option>
              ))}
            </select>
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
            <button type="submit">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTour;
