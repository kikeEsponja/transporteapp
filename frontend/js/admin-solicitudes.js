document.addEventListener('DOMContentLoaded', async () => {
    if (!estaAutenticado()) {
        window.location.href = './login.html';
        return;
    }

    const usuario = obtenerUsuario();
    const usuarioNombre = document.getElementById('usuario');
    if (usuarioNombre) usuarioNombre.textContent = usuario.nombre;

    let solicitudSeleccionadoAprobar = null;
    let solicitudSeleccionadoRechazar = null;

    // Cargar y mostrar solicitudes
    async function cargarSolicitudes() {
        try {
            const solicitudes = await api('/servicios/solicitudes');
            //console.log("Solicitudes cargadas:", solicitudes);
            
            mostrarSolicitudes(solicitudes);
            localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
        } catch (error) {
            console.error('Error cargando solicitudes: ', error);
        }
    }

    const mostrarSolicitudes = (listaArray) => {
        const listaContenedor = document.getElementById('solicitudes');
        if (!listaContenedor) return;

        if (listaArray.length === 0) {
            listaContenedor.innerHTML = '<h3>No se encontraron solicitudes</h3>';
            return;
        }

        let html = '';
        listaArray.forEach(solis => {
            const aprobada = solis.estado_de_solicitud === 'APROBADA';
            const rechazada = solis.estado_de_solicitud === 'RECHAZADA';

            html += `
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">Solicitud #: ${solis.id}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">Conductor: ${solis.nombre_conductor}</h6>    
                        <p class="card-text">Motivo: ${solis.motivo}</p>
                        <hr>
                        <p class="card-text">Estado del servicio: ${solis.estado_del_servicio}</p>
                        <button class="btn btn-success btn-aprobar" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${solis.id}" ${aprobada || rechazada ? 'disabled' : ''}>APROBAR</button>
                        <button class="btn btn-danger btn-rechazar" data-bs-toggle="modal" data-bs-target="#exampleModal_2" data-id="${solis.id}" ${aprobada || rechazada ? 'disabled' : ''}>RECHAZAR</button>
                        <hr>
                        <p>Estado de la solicitud: ${solis.estado_de_solicitud}</p>
                    </div>
                </div>
            `;
        });
        listaContenedor.innerHTML = html;

        // Asignación de ID al hacer click en los botones de la lista
        document.querySelectorAll('.btn-aprobar').forEach(boton => {
            boton.addEventListener('click', () => {
                solicitudSeleccionadoAprobar = boton.getAttribute('data-id');
                //console.log('Solicitud a APROBAR: ', solicitudSeleccionadoAprobar);
            });
        });

        document.querySelectorAll('.btn-rechazar').forEach(boton => {
            boton.addEventListener('click', () => {
                solicitudSeleccionadoRechazar = boton.getAttribute('data-id');
                //console.log('Solicitud a RECHAZAR: ', solicitudSeleccionadoRechazar);
            });
        });
    };

    // Evento Confirmar Aprobar
    const confirmarAprobar = document.getElementById('confirmar-aprobar');
    if (confirmarAprobar) {
        confirmarAprobar.addEventListener('click', async () => {
            if (!solicitudSeleccionadoAprobar) {
                console.error('No se ha seleccionado ninguna solicitud para aprobar');
                return;
            }

            try {
                const resultado = await api(`/servicios/solicitudes-cancelacion/${solicitudSeleccionadoAprobar}/aprobar`, {
                    method: 'POST'
                });

                //console.log('Solicitud aprobada: ', resultado);
                
                // Función global o helper para mostrar mensajes
                if (typeof mostrarTextoFlotante === 'function') {
                    mostrarTextoFlotante(resultado.mensaje || 'Solicitud aprobada con éxito');
                }

                const modalEl = document.getElementById('exampleModal');
                if (modalEl) {
                    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                    modal.hide();
                }

                setTimeout(() => window.location.reload(), 2000);
            } catch (error) {
                console.error('Error al aprobar la solicitud: ', error);
                if (typeof mostrarTextoFlotante === 'function') {
                    mostrarTextoFlotante(error.message || 'Error al aprobar la solicitud');
                }
            }
        });
    }

    // Evento Confirmar Rechazar
    const confirmarRechazar = document.getElementById('confirmar-rechazar');
    if (confirmarRechazar) {
        confirmarRechazar.addEventListener('click', async () => {
            if (!solicitudSeleccionadoRechazar) {
                console.error('No se ha seleccionado ninguna solicitud para rechazar');
                return;
            }

            try {
                const resultado = await api(`/servicios/solicitudes-cancelacion/${solicitudSeleccionadoRechazar}/rechazar`, {
                    method: 'POST'
                });

                //console.log('Solicitud rechazada: ', resultado);

                if (typeof mostrarTextoFlotante === 'function') {
                    mostrarTextoFlotante(resultado.mensaje || 'Solicitud rechazada con éxito');
                }

                const modalEl = document.getElementById('exampleModal_2');
                if (modalEl) {
                    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                    modal.hide();
                }

                setTimeout(() => window.location.reload(), 2000);
            } catch (error) {
                console.error('Error al rechazar la solicitud: ', error);
                if (typeof mostrarTextoFlotante === 'function') {
                    mostrarTextoFlotante(error.message || 'Error al rechazar la solicitud');
                }
            }
        });
    }

    // Llamada inicial
    await cargarSolicitudes();
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