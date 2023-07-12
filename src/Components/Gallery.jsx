import React, { useState } from 'react';
import iconClose from '../assets/iconClose.svg'
import "./Styles/Gallery.css"



const Gallery = ({ tour, onClose }) => {

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const prevImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? tour.images.length - 1 : prevIndex - 1));
    };
  
    const nextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex === tour.images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
      <div className="modal-gallery">
        <div className="modal-content-gallery">
        <span className="iconClose" onClick={onClose}>&times;</span>
          <div className="gallery">
          <img src={tour.images[currentImageIndex].urlImage} alt="" />
          <button className="prev-button" onClick={prevImage}>&#8249;</button>
          <button className="next-button" onClick={nextImage}>&#8250;</button>
          </div>
        </div>
      </div>
    );
  }

  
export default Gallery;