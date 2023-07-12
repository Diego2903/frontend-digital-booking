import { useContext, useEffect, useState } from 'react';
import './Styles/UserProfile.css';
import digitalBooking from '../api/digitalBooking';
import UserContext from '../context/UserContext';


function UserProfile() {
    const [users, setUser] = useState({});
    const {userInformation} = useContext(UserContext);
    const {jwt} = userInformation

    useEffect(() => {
      async function fetchData() {
        cargarUsuarios();
      }
      fetchData();
    }, [jwt]);
  
    const cargarUsuarios = async () => {
      const data = await digitalBooking.get(`/api/users/${jwt}`);
      setUser(data.data);
    };

    
    const processUserName = () => {
      if (users?.name?.includes(' ')) {
        const nameParts = users?.name?.split(' ');
        const iniciales = nameParts.map((part) => part.charAt(0)).join('').toUpperCase();
        return iniciales
  
      } else {
        const iniciales = users?.name?.substring(0, 2).toUpperCase() || "";
        return iniciales
      }
  
      
    };

  return (
    <div className="container-profile">
      <h1 className='title1-profile'>Perfil del usuario</h1>
      <p className="avatar-usuario-profile">{processUserName()}</p>
      <div className="profile">
        <div className="profile-details">
          <h2 className='title2-profile'>{users?.name}</h2>
          <p className='p-profile'>Email: {users?.email}</p>
          <button className='btn-editar'>Editar perfil</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;