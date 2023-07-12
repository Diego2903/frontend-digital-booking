import icon from '../assets/iconBack.svg'
import './Styles/ButtonBack.css'
import { useNavigate } from 'react-router-dom';


const ButtonBack = () => {
  const navigate = useNavigate()

  return (
   <div  className='buttonBack'><button onClick={() => navigate(-1)}><img src={icon}></img></button></div> 
  );
};

export default ButtonBack;