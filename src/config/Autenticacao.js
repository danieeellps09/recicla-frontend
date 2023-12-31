import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

export function Autenticacao() {
    let token = localStorage.getItem('token');
    let roleNames;
    let email;

    try {
        if (token) {
            const decodedToken = jwtDecode(token); 
            roleNames = decodedToken.roleNames; 
            email = decodedToken.email
            return { roleNames, email, token };
        } else if (!token || token === undefined) {
            return (
                { roleNames, email, token },
                <Navigate to="/" />
            )
        }
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
    }
}