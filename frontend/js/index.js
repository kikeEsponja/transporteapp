document.addEventListener('DOMContentLoaded', async () => {
    let botonLogin = document.getElementById('btn-login');
    let botonRegistro = document.getElementById('btn-registro');
    let mensajeCarrusel = document.getElementById('mensaje-carrusel');
    let loader = document.getElementById('loader-container');

    botonLogin.setAttribute('disabled', null);
    botonRegistro.setAttribute('disabled', null);
    mensajeCarrusel.textContent = 'Esperando';

    const llamadaHealth = await fetch(`https://transporteapp-backend.onrender.com/health`, {
        method: 'GET'
    });

    console.log(llamadaHealth, 'funcionando correctamente');

    if(llamadaHealth){
        mensajeCarrusel.textContent = 'Todo listo';
        
        botonLogin.removeAttribute('disabled', null);
        botonRegistro.removeAttribute('disabled', null);
        
        loader.style.display = 'none';
        
        botonLogin.addEventListener('click', () =>{
            window.location.href="../vistas/login.html";
        });

        botonRegistro.addEventListener('click', () =>{
            window.location.href="../vistas/registro.html";
        });
    }
});