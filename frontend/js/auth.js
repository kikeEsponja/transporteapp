const login = async (email, password) => {

    const resultado = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    });

    localStorage.setItem('token', resultado.token);
    localStorage.setItem('usuario', JSON.stringify(resultado.usuario));

    return resultado;
};

const obtenerToken = () =>{
    return localStorage.getItem('token');
};

const obtenerUsuario = () =>{
    const usuario = localStorage.getItem('usuario');

    if(!usuario){
        return null;
    }

    try{
        return JSON.parse(usuario);
    }catch{
        return null;
    }
};

const estaAutenticado = () => {
    return !!obtenerToken();
};

const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    window.location.href = './login.html';
};

const registro = async (nombre, apellido, email, password, telefono) => {

    //console.log('funciona?');
    const resultado = await api('/auth/registro', {
        method: 'POST',
        body: JSON.stringify({
        nombre,
        apellido,
        email,
        password,
        telefono,
        })
    });

    return resultado;
};

const regVehiculo = async (matricula, marca, modelo, color, combustible, observaciones) => {

    const resultadoRegVehiculo = await api('/vehiculos', {
        method: 'POST',
        body: JSON.stringify({
            matricula,
            marca,
            modelo,
            color,
            combustible,
            observaciones,
            activo: 1
        })
    });
    
    //console.log('funciona ingresar el carro?');
    
    return resultadoRegVehiculo;
};

const regTienda = async (nombre, direccion, ciudad, telefono, horario) => {

    const resultadoRegTienda = await api('/tiendas', {
        method: 'POST',
        body: JSON.stringify({
            nombre,
            direccion,
            ciudad,
            telefono,
            horario
        })
    });
    
    //console.log('funciona ingresar la tienda?');
    
    return resultadoRegTienda;
};