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

document.getElementById('ir_recupera').addEventListener('click', () =>{
    window.location.href = './recupera.html';
});

document.getElementById('ir_registro').addEventListener('click', () =>{
    window.location.href = './registro.html';
});