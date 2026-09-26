//const API_BASE_URL = ''; Cuando todo funciona en local
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://transporteapp-backend.onrender.com';

const api = async (endpoint, options = {}) => {

    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    }

    if(token){
        headers.Authorization = `Bearer ${token}`;
    }
    
    const respuesta = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    let datos;

    try {
        datos = await respuesta.json();
    } catch {
        datos = {};
    }

    if (!respuesta.ok) {
        throw new Error(
            datos.message || 'Ha ocurrido un error en el servidor'
        );
    }

    return datos;
};
//para reiniciar