import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { useContext } from "react";


const RequireAuth = ({children}) => {
  
    const {userInformation} = useContext(UserContext);
    const {jwt, user} = userInformation

    if (user?.role === "USER" || !jwt) {
    return <Navigate to='/protectedroute' />
    }
    
    return children
    
    };

export default RequireAuth