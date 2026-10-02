const formAdmUsuario = document.getElementById('form-adm-usuario'); 
const modalAdmUsuario = document.getElementById('exampleModal_5'); 
    
if(formAdmUsuario){
    formAdmUsuario.addEventListener('submit', async (e) => { 
        e.preventDefault(); 
        const nombre = document.getElementById('nombre-usuario').value.trim(); 
        const apellido = document.getElementById('apellido-usuario').value.trim(); 
        const telefono = document.getElementById('tel-usuario').value.trim(); 
        const email = document.getElementById('email-usuario').value.trim(); 
        const password = document.getElementById('password-usuario').value; 
        const rol = document.getElementById('rol-usuario').value.trim(); 
        if(rol !== "ADMIN" && rol !== "CONDUCTOR"){ 
            alert('Rol inválido');
            return;
        }
        const mensajeAdminUsuario = document.getElementById('mensaje-admin-usuario'); 
        try { 
            const res = await crearUsuarioAdmin( nombre, apellido, email, password, telefono, rol );
            if(mensajeAdminUsuario){
                mensajeAdminUsuario.className = 'alert alert-success mt-3'; 
                mensajeAdminUsuario.textContent = res.message;
            }
            modalAdmUsuario.style.display = 'none';
        } catch (error) { 
            console.error('Error en el registro de usuario:', error); 
            alert(error.message || 'Error al registrar usuario'); 
        } 
    });
}