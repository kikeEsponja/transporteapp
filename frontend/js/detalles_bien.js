document.addEventListener('DOMContentLoaded', async () => { 
    if(!estaAutenticado()){ 
        window.location.href = './login.html'; 
        return; 
    } 
    
    const usuario = obtenerUsuario(); 
    console.log('USUARIO ACTUAL: ', usuario); 
    
    const usuarioNombre = document.getElementById('usuario'); 
    if(usuarioNombre && usuario){ 
        usuarioNombre.textContent = usuario.nombre; 
    } 
    
    try { 
        const servicios = await api('/servicios'); 
        console.log('servicios obtenidos: ', servicios); 
        
        async function cargarServicios(){
            try {
                const servicioActivo = servicios.filter(s => (s.conductor_id === usuario.id || s.usuario_id === usuario.id || s.estado === 'asignado' || s.estado === 'recogido'));
                /*const servicioActivo = servicios.filter(s => 
                    (s.conductor_id === usuario.id || s.usuario_id === usuario.id) &&
                    (s.estado === 'asignado' || s.estado === 'recogido')
                );*/ 
                console.log('mis servicios activos: ', servicioActivo);
        
                mostrarServicios(servicioActivo);
                localStorage.setItem('servicios', JSON.stringify(servicioActivo));

            } catch (error){
                console.error('Error cargando servicios: ', error);
            }
        }

        const mostrarServicios = (listaArray) => {
            let html = '';
            let servicioSeleccionadoId = null;
            let servicioSeleccionadoIdEntrega = null;

            const listaContenedor = document.getElementById('mis-servicios');

            if (listaArray.length === 0) {
                listaContenedor.innerHTML = '<h3>No se encontraron servicios</h3>';
                return;
            }

            listaArray.forEach(servicioActivo => {
                // Habilitar Recoger SOLO si está en 'asignado'
                const deshabilitarRecoger = servicioActivo.estado !== 'asignado';
                // Habilitar Entregar SOLO si está en 'recogido'
                const deshabilitarEntregar = servicioActivo.estado !== 'recogido';

                html += `
                <div class="cont-datos-serv">
                    <p name="${servicioActivo.marca}">${servicioActivo.marca}</p>
                    <p name="${servicioActivo.modelo}">${servicioActivo.modelo}</p>
                    <p name="${servicioActivo.matricula}">${servicioActivo.matricula}</p>
                    <p name="${servicioActivo.origen}">${servicioActivo.origen}</p>
                    <p name="${servicioActivo.destino}">${servicioActivo.destino}</p>
                    <button class="btn-recoger" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${servicioActivo.id}" ${deshabilitarRecoger ? 'disabled' : ''}>RECOGER</button>
                    <button class="btn-entregar" data-bs-toggle="modal" data-bs-target="#exampleModal_2" data-id="${servicioActivo.id}" ${deshabilitarEntregar ? 'disabled' : ''}>ENTREGAR</button>
                    <hr>
                </div>
                `;
            });
    
            listaContenedor.innerHTML = html;
    
            const botones = document.querySelectorAll('.btn-recoger');
            const botonesEntrega = document.querySelectorAll('.btn-entregar');

            botones.forEach(boton => {
                boton.addEventListener('click', () => {
                    servicioSeleccionadoId = boton.getAttribute('data-id');
                    console.log(`Servicio seleccionado ID: ${servicioSeleccionadoId}`);
                });
            });

            botonesEntrega.forEach(botonEntrega => {
                botonEntrega.addEventListener('click', () => {
                    servicioSeleccionadoIdEntrega = botonEntrega.getAttribute('data-id');
                    console.log(`Servicio seleccionado de entrega ID: ${servicioSeleccionadoIdEntrega}`);
                });
            });
    
            const confirmar = document.getElementById('confirmar');
            const confirmarEntrega = document.getElementById('confirmar-entrega');

            if (confirmar) {
                confirmar.addEventListener('click', async () => {
                    if (!servicioSeleccionadoId) {
                        console.error('No se ha seleccionado ningún servicio.');
                        return;
                    }

                    const fotoFrontal = document.getElementById('foto_front_recogida').files[0];
                    const fotoTrasera = document.getElementById('foto_tras_recogida').files[0];
                    const fotoLatIzq = document.getElementById('foto_lat_izq_recogida').files[0];
                    const fotoLatDer = document.getElementById('foto_lat_der_recogida').files[0];
                    const fotoTabKm = document.getElementById('foto_tablero_rec_recogida').files[0];
                    const fotoTabComb = document.getElementById('foto_tablero_comb_recogida').files[0];
                    const fotoContrato = document.getElementById('foto_contrato_recogida').files[0];
                    const archivoVideo = document.getElementById('video_recogida').files[0];

                    const datos = new FormData();
                    datos.append('frontal', fotoFrontal);
                    datos.append('trasera', fotoTrasera);
                    datos.append('lateral_izquierdo', fotoLatIzq);
                    datos.append('lateral_derecho', fotoLatDer);
                    datos.append('tablero_kilometraje', fotoTabKm);
                    datos.append('tablero_autonomia', fotoTabComb);
                    datos.append('contrato', fotoContrato);
                    datos.append('momento', 'recogida');
            
                    const datosVideo = new FormData();
                    datosVideo.append('video', archivoVideo);
                    datosVideo.append('momento', 'recogida');

                    try {
                        const respuesta = await fetch(`/servicios/${servicioSeleccionadoId}/fotos`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${obtenerToken()}` },
                            body: datos
                        });

                        const respuestaVideo = await fetch(`/servicios/${servicioSeleccionadoId}/video`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${obtenerToken()}` },
                            body: datosVideo
                        });

                        const resultado = await respuesta.json();
                        const resultadoVideo = await respuestaVideo.json();

                        const res = await api(`/servicios/${servicioSeleccionadoId}/recoger`, { method: 'POST' });
                        mostrarTextoFlotante(res.message);
                
                        const modalEl = document.getElementById('exampleModal');
                        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl); 
                        modal.hide();

                        setTimeout(() => window.location.reload(), 2000);

                    } catch (error) {
                        console.error('Error al enviar imágenes o actualizar servicio:', error);
                    }
                });
            }

            if (confirmarEntrega) {
                confirmarEntrega.addEventListener('click', async () => {
                    if (!servicioSeleccionadoIdEntrega) {
                        console.error('No se ha seleccionado ningún servicio para entregar.');
                        return;
                    }

                    const fotoFrontalEnt = document.getElementById('foto_front_entrega').files[0];
                    const fotoTraseraEnt = document.getElementById('foto_tras_entrega').files[0];
                    const fotoLatIzqEnt = document.getElementById('foto_lat_izq_entrega').files[0];
                    const fotoLatDerEnt = document.getElementById('foto_lat_der_entrega').files[0];
                    const fotoTabKmEnt = document.getElementById('foto_tablero_rec_entrega').files[0];
                    const fotoTabCombEnt = document.getElementById('foto_tablero_comb_entrega').files[0];
                    const fotoContratoEnt = document.getElementById('foto_contrato_entrega').files[0];
                    const archivoVideoEnt = document.getElementById('video_entrega').files[0];

                    const datosEntrega = new FormData();
                    datosEntrega.append('frontal', fotoFrontalEnt);
                    datosEntrega.append('trasera', fotoTraseraEnt);
                    datosEntrega.append('lateral_izquierdo', fotoLatIzqEnt);
                    datosEntrega.append('lateral_derecho', fotoLatDerEnt);
                    datosEntrega.append('tablero_kilometraje', fotoTabKmEnt);
                    datosEntrega.append('tablero_autonomia', fotoTabCombEnt);
                    datosEntrega.append('contrato', fotoContratoEnt);
                    datosEntrega.append('momento', 'entrega');
            
                    const datosVideoEntrega = new FormData();
                    datosVideoEntrega.append('video', archivoVideoEnt);
                    datosVideoEntrega.append('momento', 'entrega');

                    try {
                        const respuestaEntrega = await fetch(`/servicios/${servicioSeleccionadoIdEntrega}/fotos`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${obtenerToken()}` },
                            body: datosEntrega
                        });

                        const respuestaVideoEntrega = await fetch(`/servicios/${servicioSeleccionadoIdEntrega}/video`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${obtenerToken()}` },
                            body: datosVideoEntrega
                        });

                        const resEntrega = await api(`/servicios/${servicioSeleccionadoIdEntrega}/entregar`, { method: 'POST' });
                        mostrarTextoFlotante(resEntrega.message);
                
                        const modalElEntrega = document.getElementById('exampleModal_2');
                        const modalEntrega = bootstrap.Modal.getInstance(modalElEntrega) || new bootstrap.Modal(modalElEntrega); 
                        modalEntrega.hide();

                        setTimeout(() => window.location.reload(), 2000);

                    } catch (error) {
                        console.error('Error al enviar imágenes o actualizar servicio:', error);
                    }
                });
            }
        };

        // ¡AQUÍ ESTÁ EL CAMBIO CLAVE! Invocamos el flujo inicial
        await cargarServicios();

    } catch (error){ 
        console.error('ERROR AL OBTENER DETALLES DEL SERVICIO: ', error); 
    } 
    
    function mostrarTextoFlotante(mensajeTexto){ 
        const mensaje = document.getElementById('mensaje'); 
        const textoFlotante = document.getElementById('texto-flotante'); 
        
        if(mensaje && textoFlotante){ 
            mensaje.textContent = mensajeTexto; 
            textoFlotante.style.display = 'block'; 
            setTimeout(() => { 
                textoFlotante.style.display = 'none'; 
            }, 3000); 
        } 
    } 
        
    const btnHistorial = document.getElementById('historial'); 
    if(btnHistorial){ 
        btnHistorial.addEventListener('click', () => { 
            window.location.href = './historial.html'; 
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
            cerrarSesion(); // Llama a la función global para cerrar sesión
        }); 
    } 
});