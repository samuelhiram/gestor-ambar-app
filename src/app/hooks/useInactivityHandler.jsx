import { useEffect } from "react";
import { useMainAppContext } from "../main/components/MainAppContext";
const INACTIVITY_LIMIT = 1500000; // 15 segundos
let inactivityTimer;
let tokenCheckInterval;

export function useInactivityHandler(token) {
  const { setState } = useMainAppContext();
  // Resetea el temporizador de inactividad
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      console.log("Usuario inactivo. Cerrando sesión...");
      //   onLogout(); // Cerrar sesión por inactividad
    }, INACTIVITY_LIMIT);
  };

  // Verifica la vigencia del token periódicamente
  const checkTokenValidity = () => {
    if (isTokenExpired(token) && token !== "") {
      setState((prevState) => ({ ...prevState, isTokenExpired: true }));

      localStorage.setItem("tokenIsExpired", "true");

      console.log("Token expirado. Cerrando sesión...");

      //clear localSo
      localStorage.clear();
      window.location.reload();
      //   onLogout(); // Cerrar sesión si el token ha caducado
    } else if (token !== "") {
      setState((prevState) => ({ ...prevState, isTokenExpired: false }));

      localStorage.setItem("tokenIsExpired", "false");

      console.log("Token valido");
    }
  };

  useEffect(() => {
    // Inicia el chequeo de token cada cierto tiempo (por ejemplo, cada 10 segundos)
    tokenCheckInterval = setInterval(() => {
      checkTokenValidity();
    }, 10000); // Verifica cada 10 segundos

    // Monitoriza la actividad del usuario
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("click", resetInactivityTimer);

    // Inicializa el temporizador de inactividad
    resetInactivityTimer();

    // Limpia el temporizador y el chequeo de token cuando el componente se desmonte
    return () => {
      clearTimeout(inactivityTimer);
      clearInterval(tokenCheckInterval);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("click", resetInactivityTimer);
    };
  }, [token]); // Se vuelve a ejecutar si el token cambia
}

// Decodificar el token JWT
function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Verificar si el token ha caducado
function isTokenExpired(token) {
  const decodedToken = decodeToken(token);
  if (!decodedToken || !decodedToken.exp) return true; // Si no hay token o no tiene exp, está caducado
  const currentTime = Date.now() / 1000; // Tiempo actual en segundos
  return decodedToken.exp < currentTime;
}
