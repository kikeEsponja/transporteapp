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