import React from 'react'
import iconForbidden from '../assets/iconForbidden.svg'
import "./Styles/ProtectedRoute.css"
import { useNavigate } from 'react-router-dom'


const ProtectedRoute = () => {
const navigate = useNavigate();

  return (
    <div className="container-pr">
    <div className="icon-forbidden"><img src={iconForbidden} alt="" /></div>
    <h1 className='title-pr'>Acceso restringido</h1>
    <p className='p-pr'>Lo siento, no tienes permiso para acceder a esta página.</p>

    <button className='btn-regresar' onClick={() => navigate("/")}>Regresar</button>
  </div>
  )
}

export default ProtectedRoute