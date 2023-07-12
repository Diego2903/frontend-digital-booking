import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import ProtectedAdmin from "./Components/ProtectedAdmin";
import ProtectedLog from "./Components/ProtectedLog";
import Admin from "./Routes/Admin";
import Detail from "./Routes/Detail";
import Home from "./Routes/Home";
import List from "./Routes/List";
import ProtectedRoute from "./Routes/ProtectedRoute";
import SingIn from "./Routes/SingIn";
import SingUp from "./Routes/SingUp";
import UserEnable from "./Routes/UserEnable";
import Profile from "./Routes/UserProfile";
import Bookings from "./Routes/Bookings";
import Users from "./Routes/Users";
import { UserContextProvider } from "./context/UserContext";
import PanelAdmin from "./Routes/PanelAdmin";
import ListaCiudades from "./Routes/ListaCiudades";
import SuccessBooking from "./Routes/SuccessBookings";
import ListaCategorias from "./Routes/ListaCategorias";
import MyBookings from "./Routes/MyBookings";
import AllBookings from "./Routes/AllBookings";
import Favoritos from "./Components/Favoritos";


const App = () => {


  return (
    <UserContextProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommendation/:id" element={<Detail />} />
          <Route path="/profile" element= {<ProtectedLog> <Profile/> </ProtectedLog>} /> 
          <Route path="/admin" element= {<ProtectedAdmin> <Admin/> </ProtectedAdmin>} /> 
          <Route path="/list"  element= {<ProtectedAdmin> <List/> </ProtectedAdmin>} /> 
          <Route path="/listCiudades"  element= {<ProtectedAdmin> <ListaCiudades /> </ProtectedAdmin>} /> 
          <Route path="/listCategorias"  element= {<ProtectedAdmin> <ListaCategorias /> </ProtectedAdmin>} /> 
          <Route path="/panel"  element= {<ProtectedAdmin> <PanelAdmin/> </ProtectedAdmin>} /> 
          <Route path="/sing-in" element={<SingIn />} />
          <Route path="/sing-up" element={<SingUp />} />
          <Route path="/protectedroute" element={<ProtectedRoute />} />
          <Route path="/users" element={<ProtectedAdmin> <Users/> </ProtectedAdmin>} /> 
          <Route path="/user/:email" element={<UserEnable />} />
          <Route path="/booking/:id" element={<ProtectedLog> <Bookings/> </ProtectedLog>} /> 
          <Route path="/success-booking" element={<ProtectedLog> <SuccessBooking/> </ProtectedLog>} /> 
          <Route path="/bookings/:id" element={<ProtectedLog> <MyBookings/> </ProtectedLog>} /> 
          <Route path="/bookings" element={<ProtectedAdmin> <AllBookings/> </ProtectedAdmin>} />
          <Route path="/favoritos" element={<ProtectedLog> <Favoritos /> </ProtectedLog>} />
          <Route path="*" element={<Navigate to="/sing-in" replace />} />
        </Routes>
        <Footer />
      </div>
    </UserContextProvider>
  );
};

export default App;
