import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Styles/UserEnable.css";
// import axios from "axios";
// import digitalBooking from "../api/digitalBooking";

const UserEnable = () => {
  const { email } = useParams();
  const [user, setUser] = useState(null);
  let message = "Cargando...";
  let className = "white";
  const navigate = useNavigate();

  useEffect(() => {
    console.log(email);
  }, [email]);

  useEffect(() => {
    const requestOptions = {
      method: "PUT",
      body: "",
      redirect: "follow",
    };

    fetch(
      `http://ec2-18-222-239-12.us-east-2.compute.amazonaws.com:8080/api/userState/${email}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log("User:" + user);
        if (data.enabled && data.credentialsNonExpired) {
          setUser(true);
          setTimeout(() => {
            navigate("/sing-in");
          }, 5000);
        } else {
          console.log("error");
        }
      })
      .catch((err) => {
        console.log(err);
        setUser(false);
        setTimeout(() => {
          navigate("/sing-up");
        }, 5000);
      });
  }, [email]);

  if (user) {
    message = "¡Tu cuenta ha sido validada con éxito!";
    className = "valid-account";
  } else if (user === false) {
    message =
      "El correo de validación ha caducado luego de las 48 horas, por favor vuelva a registrarse.";
    className = "not-valid-account";
  }
  return (
    <div className={className}>
      <p className="message">{message}</p>
    </div>
  );
};

export default UserEnable;
