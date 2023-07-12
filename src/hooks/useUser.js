import { useCallback, useContext, useState } from "react";
import Context from "../context/UserContext";
import loginService from "../service/loginService";

export default function useUser() {
  const { jwt, setJwt } = useContext(Context);
  const [state, setState] = useState({ loading: false, error: false });
  const [mostrarMensaje, setMostrarMensaje] = useState()

  const login = useCallback(
    ({ email, password }) => {
      setState({ loading: true, error: false });
      loginService({ email, password })
        .then((jwt) => {
          window.sessionStorage.setItem("jwt", jwt);
          setState({ loading: false, error: false });
          setJwt(jwt);
        })
        .catch((err) => {
          window.sessionStorage.removeItem("jwt");
          setState({ loading: false, error: true });
        });
    },
    [setJwt]
  );

  const logout = useCallback((conMensaje=false) => {
    setMostrarMensaje(conMensaje)
    console.log(mostrarMensaje)
    window.sessionStorage.removeItem("jwt");
    setJwt(null);
  }, [setJwt]);

  return {
    isLogged: Boolean(jwt),
    login,
    logout,
    mostrarMensaje,
    isLoginLoading: state.loading,
    hasLoginError: state.error,
    jwt,
  };
}
