const formulario = document.getElementById('form-login');

const mensaje = document.getElementById('mensaje');

formulario.addEventListener('submit', async(event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    mensaje.textContent = '';

    try{
        const resultado = await login(email, password);

        mensaje.textContent = resultado.message;
        mensaje.style.color = 'green';
        mensaje.style.background = 'white';
        mensaje.style.borderRadius = '20px';
        if(resultado.usuario.rol === 'ADMIN'){
            window.location.href = './admin.html';
        }else if(resultado.usuario.rol === 'CONDUCTOR'){
            window.location.href = './dashboard.html';
        }else{
            mensaje.textContent = 'Rol de usuario no reconocido';
        }

    }catch (error){
        mensaje.textContent = error.message;
    }
});

    const solictudRecupPassword = document.getElementById('enviar-solicitud-recup');
    const modalRecupPassword = document.getElementById('exampleModal');

    solictudRecupPassword.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email-recup').value.trim();

        const mensaje = document.getElementById('mensaje');
        try{
            console.log('intento de leer la API');
            const res = await api('/auth/olvido-password', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
        
            if(mensaje){
                modalRecupPassword.style.display = 'none';
                mensaje.className = 'alert alert-success mt3';
                mensaje.textContent = res.message;
            }

            setTimeout(() => {
                window.location.reload();
            }, 3000);

        }catch(error){
            console.error('Error al solicitar: ', error);
            alert(error.message || 'Error al solicitar recuperación de password');
        }
    });

document.getElementById('ir_registro').addEventListener('click', () =>{
    window.location.href = './registro.html';
});