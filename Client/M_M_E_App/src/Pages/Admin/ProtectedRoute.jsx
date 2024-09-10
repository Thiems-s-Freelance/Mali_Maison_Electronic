import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { jwtDecode } from "jwt-decode";

export function ProtectedRoute({ component: Component }) {
    const token = localStorage.getItem('token')
    console.log(token)


    // Si pas de token, redirige vers la page de login
    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // en secondes
        
        // Vérifie si le token est expiré
        if (decodedToken.exp < currentTime) {
            console.warn("Token expired");
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }

    } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('token'); // Supprimer le token invalide s'il y a une erreur
        return <Navigate to="/login" />;
    }

    // Si tout va bien, rend le composant protégé
    return <Component />
}

ProtectedRoute.propTypes = {
    component: PropTypes.func.isRequired
};
