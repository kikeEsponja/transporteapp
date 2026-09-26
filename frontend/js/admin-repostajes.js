document.addEventListener('DOMContentLoaded', async () => {
    if (!estaAutenticado()) {
        window.location.href = './login.html';
        return;
    }

    const usuario = obtenerUsuario();
    const usuarioNombre = document.getElementById('usuario');
    if (usuarioNombre) usuarioNombre.textContent = usuario.nombre;

    async function cargarRepostajes() {
        try {
            const repostajes = await api('/repostajes');
            
            mostrarRepostajes(repostajes);
            localStorage.setItem('repostajes', JSON.stringify(repostajes));
        } catch (error) {
            console.error('Error cargando repostajes: ', error);
        }
    }

    const mostrarRepostajes = (listaArrayRepostajes) => {
        const listaContenedorRepostajes = document.getElementById('historico-repostajes');
        if (!listaContenedorRepostajes) return;

        if (listaArrayRepostajes.length === 0) {
            listaContenedorRepostajes.innerHTML = '<h3>No hay repostajes</h3>';
            return;
        }

        //let html = '';
        listaArrayRepostajes.forEach(reps => {

        let html = `
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Servicio</th>
                        <th>Vehículo</th>
                        <th>Conductor</th>
                        <th>Litros</th>
                        <th>Importe</th>
                        <th>Ticket</th>
                        <th>Observaciones</th>
                    </tr>
                </thead>
                <tbody>
    `;

    listaArrayRepostajes.forEach(repostaje => {

        const conductor = repostaje.conductor_id ? `${repostaje.conductor_nombre} ${repostaje.conductor_apellido}` : 'Sin conductor';
        const fecha = new Date(repostaje.created_at).toLocaleString('es-ES');

        html += `
            <tr>
                <td>${fecha}</td>
                <td>#${repostaje.servicio_id}</td>
                <td>
                    ${repostaje.marca} ${repostaje.modelo}
                    <br>
                    <small>${repostaje.matricula}</small>
                </td>
                <td>${conductor}</td>
                <td>${repostaje.litros} L</td>
                <td>${repostaje.importe} €</td>
                <td>${repostaje.ticket}</td>
                <td>${repostaje.observaciones || '-'}</td>
            </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        listaContenedorRepostajes.innerHTML = html;
        });
    }

  
    // Llamada inicial
    await cargarRepostajes();
/**********************************VOLVER A DASHBOARD ADMIN********************************************** */
    const botonVolverAdmin = document.getElementById('ir-admin');
    if(botonVolverAdmin){
        botonVolverAdmin.addEventListener('click', () =>{
            window.location.href = './admin.html';
        })
    }

/**********************************CERRAR SESIÓN********************************************** */
    const cerrar_sesion = document.getElementById('cerrar-sesion');
    cerrar_sesion.addEventListener('click', () => {
        cerrarSesion();
    });
});