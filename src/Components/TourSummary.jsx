import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import digitalBooking from '../api/digitalBooking';
import "./Styles/TourSummary.css"
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import iconPlace from '../assets/iconPlace.svg'
import iconClock from '../assets/iconClock.svg'
import iconCategory from '../assets/iconCategory.svg'
import iconFav from '../assets/iconFav.svg'
import iconShare from '../assets/iconShare.svg'
import iconPrice from '../assets/iconPrice.svg'
import iconGuide from '../assets/iconGuide.svg'



const TourSummary = () => {
  const params = useParams()
  const [tour, setTour] = useState();


  useEffect(() => {
    async function fetchData() {
      cargarTour(params.id);
    }
    fetchData();
  }, [params.id]);

  const cargarTour = async (params) => {
    const data = await digitalBooking.get(`/product/${params}`);
    setTour(data.data);
  };

  return (
    <div className="tour-summary card">
      <h2 className='title-tour'>{tour?.nameProduct}</h2>
      <div className='location-tour'>
        <img src={iconPlace}  alt=""></img> 
         <p className='location-tour-text'>{tour?.ciudad.nameCity} - {tour?.ciudad.nameCountry}</p>
      </div>
      


      <Carousel showArrows={true} showStatus={false}>
      {tour?.images.map((imagen, index) => (
        <div className="image-container">
          <img key={index} src={imagen.urlImage} alt={`Imagen ${index}`} />
          </div>
        ))}
      </Carousel>

      <h3 className='subtitle-tour'>Descripción</h3>
      
      <p className='text-tour'>{tour?.descriptionProduct}</p>
     

      <h3 className='subtitle-tour'>Atributos Destacados</h3>
      <div className='atributes-conteiner-tour'>
          <div className='atributes-tour'>
          <div className='atribute-tour'>
            <img src={iconClock} alt="" /> {tour?.duration} día(s)
          </div>
          <div className='atribute-tour'>
            <img src={iconCategory} alt="" />{tour?.category.nameCategory}
          </div>
          <div className='atribute-tour'>
            <img src={iconPrice} alt="" /> {tour?.price} USD 
          </div>
          <div className='atribute-tour'>
            <img src={iconGuide} alt="" /> {tour?.turistGuide}
          </div>
          </div>
        </div>

        <h3 className='subtitle-tour'>Políticas destacadas</h3>

        <div className='politics-conteiner-tour'>
          <div className='politics-tour'>
          <div className='politic-tour'>
            <h3>Política de Cancelación</h3>
            <p> {tour?.politics.cancellationPolicy}</p>
          </div>
          <div className='politic-tour'>
            <h3>Política de Cambios</h3>
            <p>{tour?.politics.changesPolicy}</p>
          </div>
          <div className='politic-tour'>
            <h3>Política de Reembolso</h3>
            <p>{tour?.politics.refundPolicy}</p>
          </div>
          </div>
        </div>

        <button className="back-button-detail">
        <Link to={`/recommendation/${tour?.idProduct}`}>  Volver al detalle de producto </Link>
      </button>
    </div>
  );
};

export default TourSummary;
