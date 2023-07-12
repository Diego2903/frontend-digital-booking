import  {useContext, useEffect, useState } from 'react';
import digitalBooking from "../api/digitalBooking";
import "./Styles/CreateCategory.css"
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2'


const CreateCategory = ({ isOpen, onClose, categoriaSeleccionada }) => {
  const {userInformation} = useContext(UserContext);
  const {jwt} = userInformation;

  
  console.log(categoriaSeleccionada);

  const [category, setCategory] = useState({
    idCategory: categoriaSeleccionada ? categoriaSeleccionada.idCategory : "",
    name: categoriaSeleccionada ? categoriaSeleccionada.nameCategory : "",
    description: categoriaSeleccionada ? categoriaSeleccionada.descriptionCategory : "",
    image: categoriaSeleccionada ? categoriaSeleccionada.image : "",
  });

  useEffect(() => {
    setCategory({
      idCategory: categoriaSeleccionada ? categoriaSeleccionada.idCategory : "",
      name: categoriaSeleccionada ? categoriaSeleccionada.nameCategory : "",
      description: categoriaSeleccionada ? categoriaSeleccionada.descriptionCategory : "",
      image: categoriaSeleccionada ? categoriaSeleccionada.image : "",
    });
  }, [categoriaSeleccionada]);


  const [errors, setErrors] = useState({
    name: '',
    description: '',
    image: '',
  });

  const handleReset = () => {
    // setCategory({
    //     name: '',
    //     description: '',
    //     image: '',
    // });
    setErrors({
        name: '',
        description: '',
        image: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = {
        idCategory: category.idCategory,
        nameCategory: category.name,
        descriptionCategory: category.description,
        image: category.image
    };

    let formIsValid = true;
    const newErrors = {
      idCategory: '',
      name: '',
      description: '',
      image: '',
    };

    if (!category.name) {
      formIsValid = false;
      newErrors.name = 'Por favor, ingresa el nombre de la categoría.';
    }

    if (!category.description) {
      formIsValid = false;
      newErrors.description = 'Por favor, ingresa la descripción de la categoría.';
    }

    if (!category.image) {
      formIsValid = false;
      newErrors.image = 'Por favor, ingresa la URL de la imagen de la categoría.';
    }

    setErrors(newErrors);

    if (!formIsValid) {
      return;
    }

    try {

    const existingCategories = await digitalBooking.get('/category/getAll');
    const categoryExists = existingCategories.data.some((c) => c.nameCategory === category.name);

    if (categoryExists) {
        setErrors((prevErrors) => ({...prevErrors,name: 'El nombre de la categoría ya existe. Por favor, elija otro nombre.',}));
        return;
    }

    if (formData.idCategory) {
      await digitalBooking.put(`category/update/${formData.idCategory}`, formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    } else {
    await digitalBooking.post("/category/create", formData,  {
      headers: {
          Authorization: `Bearer ${jwt}`,
      },
    });
  }
    Swal.fire({
      icon: 'success',
      title: '¡Exitoso!',
      text: `La categoría se ha ${category.idCategory ? 'actualizado' : 'creado'} exitosamente.`,
    
    })

    setTimeout(() => {
        onClose();
        setCategory({
            name: '',
            description: '',
            image: '',
        });
        setErrors({
            name: '',
            description: '',
            image: '',
        });
    }, 3000);
    
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Se produjo un error al crear la categoría. Por favor, intenta nuevamente.',
      
      })
      // setErrors((prevErrors) => ({...prevErrors,name: 'Se produjo un error al crear la categoría. Por favor, intenta nuevamente.',}));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <label>
            Nombre de la categoría:
            <input
              type="text"
              name="name"
              value={category.name}
              onChange={handleInputChange}
              
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </label>
          <label>
            Descripción:
            <textarea
              name="description"
              value={category.description}
              onChange={handleInputChange}
            ></textarea>
             {errors.description && <p className="error">{errors.description}</p>}
          </label>
          <label>
            URL de la imagen:
            <input
              type="text"
              name="image"
              value={category.image}
              onChange={handleInputChange}  
            />
             {errors.image && <p className="error">{errors.image}</p>}
          </label>
          <div>
            <button className='btn-close' onClick={() => { handleReset(); onClose(); }}>Regresar</button>
            <button type="submit">{category.idCategory ? "Actualizar" : "Crear"}</button>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default CreateCategory;