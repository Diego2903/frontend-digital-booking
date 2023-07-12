import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context/UserContext";
import SuccessBooking from "../Routes/SuccessBookings";
import Bookings from "../Routes/Bookings";


const RequireAuth = ({children}) => {
    const {userInformation} = useContext(UserContext);
    const {jwt} = userInformation
    const location = useLocation();

    if (!jwt) {
    return <Navigate to='/protectedroute' />
    } else if((children == <SuccessBooking/> || children == <Bookings/>) && location.state==null){
        return <Navigate to='/protectedroute' />
    }
    
    return children
    
    };

export default RequireAuth