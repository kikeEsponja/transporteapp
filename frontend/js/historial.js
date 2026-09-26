document.addEventListener('DOMContentLoaded', async () => {
    if(!estaAutenticado()){
        window.location.href = './login.html';
        return;
    }

    const usuario = obtenerUsuario();
    //console.log('USUARIO ACTUAL: ', usuario);

    const usuarioNombre = document.getElementById('usuario');
    if(usuarioNombre && usuario){
        usuarioNombre.textContent = usuario.nombre;
    }

    try{
        const servicios = await api('/servicios');
        //console.log('servicios obtenidos para historial: ', servicios);

        const contenedorMisTrabajos = document.getElementById('mis-trabajos');

        const historialServicios = servicios.filter(s => (s.conductor_id === usuario.id || s.usuario_id === usuario.id) && (s.estado === 'entregado' || s.estado === 'cancelado'));

        if(historialServicios.length === 0){
            contenedorMisTrabajos.innerHTML = '<h3>No tienes servicios registrados</h3>';
        }else{
            let htmlHist = '';

            historialServicios.forEach(trabajo => { 
                htmlHist += `
                    <div class="card" style="width: 30rem;">
                        <div class="card-body">
                            <h5 class="card-title">Servicio #: ${trabajo.id}</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">Vehículo: ${trabajo.marca} ${trabajo.modelo} matrícula: ${trabajo.matricula}</h6>
                            <p class="card-text">Desde: ${trabajo.origen}</p>
                            <p class="card-text">Hasta: ${trabajo.destino}</p>
                            <p class="card-text">Estado: ${trabajo.estado}</p>
                            <p>Fecha de entrega: ${trabajo.fecha_entrega}</p>
                            <p>Fecha de cancelación: ${trabajo.fecha_cancelacion || ''}</p>
                            <hr>
                        </div>
                    </div>
                    <br>
                    `;
            });
            contenedorMisTrabajos.innerHTML = htmlHist;
        }
    }catch(error){
        console.error('ERROR AL OBTENER HISTORIAL: ', error);
        const contenedorMisTrabajos = document.getElementById('mis-trabajos');

        if(contenedorMisTrabajos){
            contenedorMisTrabajos.innerHTML = '<p>ocurrió un error al cargar el historial</p>';
        }
    }
    
    const btnDetalles = document.getElementById('detalles');
    if(btnDetalles){
        btnDetalles.addEventListener('click', () => {
            window.location.href = './detalles.html';
        });
    }

    const btnDashboard = document.getElementById('dashboard');
    if(btnDashboard){
        btnDashboard.addEventListener('click', () => {
            window.location.href = './dashboard.html';
        });
    }

    const btnCerrarSesion = document.getElementById('cerrar-sesion');
    if(btnCerrarSesion){
        btnCerrarSesion.addEventListener('click', () => {
            btnCerrarSesion();
        });
    }
});