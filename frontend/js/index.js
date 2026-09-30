document.addEventListener('DOMContentLoaded', async () => {
    let botonLogin = document.getElementById('btn-login');
    let botonRegistro = document.getElementById('btn-registro');
    let mensajeCarrusel = document.querySelectorAll('.carrusel-item');
    let loader = document.getElementById('loader-container');

    botonLogin.setAttribute('disabled', null);
    botonRegistro.setAttribute('disabled', null);
    //mensajeCarrusel.textContent = 'Esperando';
    let mensajeActual = 0;

    mensajeCarrusel.forEach((mensaje, index) => {
        mensaje.style.display = index === 0 ? 'flex' : 'none';
    });

    const intervaloCarrusel = setInterval(() => {
        mensajeCarrusel[mensajeActual].style.display = 'none';
        mensajeActual = (mensajeActual + 1) % mensajeCarrusel.length;
        mensajeCarrusel[mensajeActual].style.display = 'flex';
    }, 2500);

    const llamadaHealth = await fetch(`https://transporteapp-backend.onrender.com/health`, {
        method: 'GET'
    });

    console.log(llamadaHealth, 'funcionando correctamente');

    if(llamadaHealth.ok){

        clearInterval(intervaloCarrusel);

        //mensajeCarrusel.textContent = 'Todo listo';
        mensajeCarrusel.forEach(mensaje => {
            mensaje.style.display = 'none';
        });

        mensajeCarrusel[mensajeCarrusel.length -1].style.display = 'flex';
        mensajeCarrusel[mensajeCarrusel.length -1].textContent = 'Todo listo';
        
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