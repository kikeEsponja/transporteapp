const obtenerTokenRecuperacion = () => {
    const parametros = new URLSearchParams(
        window.location.search
    );
    return parametros.get('token');
};
//fetch
document.addEventListener('DOMContentLoaded', () => {
    const token = obtenerTokenRecuperacion();

    const form = document.getElementById('formRecuperacion');
    const mensaje = document.getElementById('mensaje');

    if(!token){
        mensaje.innerHTML = `
        <div class='alert alert-danger'>El enlace de recuperación no es válido</div>`;

        form.style.display = 'none';

        return;
    }

    form.addEventListener('submit', async(event) => {
        event.preventDefault();

        const password = document.getElementById('password').value;
        const passwordRepetida = document.getElementById('passwordRepetida').value;

        if(password !== passwordRepetida){
            mensaje.innerHTML = `
            <div class='alert alert-danger'>Las contraseñas no coinciden</div>`;

            return;
        }

        try{
            const resultado = await api('/auth/restablecer-password', {
                method: 'POST',

                body: JSON.stringify({
                    token,
                    password
                })
            });

            mensaje.innerHTML = `
            <div class='alert alert-success'>${resultado.message}</div>`;

            form.style.display = 'none';

            //window.location.href = './login.html';
            setTimeout(() =>{
                window.location.href = './login.html';
            }, 3000);
        }catch(error){
            mensaje.innerHTML = `
            <div class='alert alert-danger'>${error.message || 'No se pudo restablecer la contraseña.'}</div>`;
        }
    });
});