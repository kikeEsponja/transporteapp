document.addEventListener('DOMContentLoaded', async () => {
    const llamadaHealth = await fetch(`https://transporteapp-backend.onrender.com/health`, {
        method: 'GET'
    });

    console.log(llamadaHealth, 'funcionando correctamente');

    if(llamadaHealth){
        let mensajeCarrusel = document.getElementById('mensaje-carrusel');
        mensajeCarrusel.textContent = 'mensaje de espera';
    }

    let botonLogin = document.getElementById('btn-login');
    let botonRegistro = document.getElementById('btn-registro');

    botonLogin.setAttribute('disabled', null);
    botonRegistro.setAttribute('disabled', null);

    botonLogin.addEventListener('click', () =>{
        window.location.href="../vistas/login.html";
    });

    botonRegistro.addEventListener('click', () =>{
        window.location.href="../vistas/registro.html";
    });
});