import { useEffect, useState } from "react";
import digitalBooking from "../api/digitalBooking";
import "./Styles/Categorias.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Categorias = ({ setCategoriaId }) => {
  const [categorias, setCategorias] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      cargarCategorias();
    }
    fetchData();
  }, []);

  const cargarCategorias = async () => {
    const data = await digitalBooking.get("/category/getAll");
    setCategorias(data.data);
  };

  const moveRight = (evnt) => {
    const content = document.querySelector(".contenedor-cards-categorias");
    content.scrollLeft += 100;
    evnt.preventDefault();
  };

  const moveLeft = (evnt) => {
    const content = document.querySelector(".contenedor-cards-categorias");
    content.scrollLeft -= 100;
    evnt.preventDefault();
  };

  return (
    <div className="contenedor-cards-categorias">
      {categorias.map((categoria) => (
        <div
          key={categoria.idCategory}
          className="contenedor-categorias"
          onClick={() => setCategoriaId(categoria.idCategory)}
        >
          <div className="contenedor-img-categoria">
            <img src={categoria.image} alt="image" />
          </div>
          <div className="card-contenedor-categoria">
            <h4 className="card-nombre">{categoria.nameCategory}</h4>
            <p className="card-descripcion">{categoria.descriptionCategory}</p>
          </div>
        </div>
      ))}
      <FaArrowLeft className="absolute left-2 bottom-48" onClick={moveLeft}>
        left
      </FaArrowLeft>
      <FaArrowRight className="absolute right-2 bottom-48" onClick={moveRight}>
        right
      </FaArrowRight>
    </div>
  );
};

export default Categorias;
