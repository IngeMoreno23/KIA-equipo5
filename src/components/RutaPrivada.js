import { Navigate } from 'react-router-dom';

function RutaPrivada({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
}

export default RutaPrivada;