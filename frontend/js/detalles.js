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
    
    try { 
        const servicios = await api('/servicios'); 
        //console.log('servicios obtenidos: ', servicios); 
        
        async function cargarServicios(){
            try {
                const servicioActivo = servicios.filter(s => (s.conductor_id === usuario.id) && (s.estado === 'asignado' || s.estado === 'recogido'));

                //console.log('mis servicios activos: ', servicioActivo);
        
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
            let servicioSeleccionadoIdCancelar = null;
            let servicioSeleccionadoIdRepostaje = null;

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

                const deshabilitar = servicioActivo.estado === 'cancelado';

                const solicitudPendiente = servicioActivo.estado_solicitud_cancelacion === 1;

                html += `
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Vehículo: ${servicioActivo.marca} - ${servicioActivo.modelo}</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">Matrícula: ${servicioActivo.matricula}</h6>
                            <p class="card-text">Desde: ${servicioActivo.origen}</p>
                            <p class="card-text">Hasta: ${servicioActivo.destino}</p>
                            <hr>
                            <button class="btn-recoger btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${servicioActivo.id}" ${deshabilitarRecoger ? 'disabled' : deshabilitar}>RECOGER</button>
                            <button class="btn-entregar btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal_2" data-id="${servicioActivo.id}" ${deshabilitarEntregar ? 'disabled' : deshabilitar}>ENTREGAR</button>
                            <hr>
                            <button class="btn-repostaje btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal_4" data-id="${servicioActivo.id}"    data-marca="${servicioActivo.marca}" data-modelo="${servicioActivo.modelo}" data-matricula="${servicioActivo.matricula}" data-origen="${servicioActivo.origen}" data-destino="${servicioActivo.destino}">REPOSTAJES Y OTROS</button>
                            <hr>
                            <button class="btn-cancelar btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal_3" data-id="${servicioActivo.id}" ${solicitudPendiente ? 'disabled' : ''}>SOLICITAR CANCELACIÓN</button>
                        </div>
                    </div>
                `;
            });
    
            listaContenedor.innerHTML = html;
    
            const botones = document.querySelectorAll('.btn-recoger');
            const botonesEntrega = document.querySelectorAll('.btn-entregar');
            const botonesCancelar = document.querySelectorAll('.btn-cancelar');
            const botonesRepostaje = document.querySelectorAll('.btn-repostaje');

            botones.forEach(boton => {
                boton.addEventListener('click', () => {
                    servicioSeleccionadoId = boton.getAttribute('data-id');
                    //console.log(`Servicio seleccionado ID: ${servicioSeleccionadoId}`);
                });
            });

            botonesEntrega.forEach(botonEntrega => {
                botonEntrega.addEventListener('click', () => {
                    servicioSeleccionadoIdEntrega = botonEntrega.getAttribute('data-id');
                    //console.log(`Servicio seleccionado de entrega ID: ${servicioSeleccionadoIdEntrega}`);
                });
            });

            botonesCancelar.forEach(botonCancelar => {
                botonCancelar.addEventListener('click', () => {
                    servicioSeleccionadoIdCancelar = botonCancelar.getAttribute('data-id');
                    //console.log(`Servicio seleccionado de cancelación ID: ${servicioSeleccionadoIdCancelar}`);
                });
            });

            botonesRepostaje.forEach(botonRepostaje => {
                botonRepostaje.addEventListener('click', () =>{
                    servicioSeleccionadoIdRepostaje = botonRepostaje.getAttribute('data-id');
                    document.getElementById('servicio').value = "#" + servicioSeleccionadoIdRepostaje;
                    document.getElementById('vehiculo').value = `${botonRepostaje.dataset.marca} ${botonRepostaje.dataset.modelo}`;
                });
            });

    
            const confirmar = document.getElementById('confirmar');
            const confirmarEntrega = document.getElementById('confirmar-entrega');
            const solicitarCancelacion = document.getElementById('crear-solicitud')
            // ===================================================== REPOSTAJES ==================================================================
            const registrarRepostaje = document.getElementById('registro-repostaje');

            if(registrarRepostaje){
                registrarRepostaje.addEventListener('click', async () => {
                    const litrosInput = document.getElementById('litros');
                    const importeInput = document.getElementById('importe');
                    const ticketInput = document.getElementById('ticket');
                    const observacionesInput = document.getElementById('observaciones');

                    const litros = litrosInput ? litrosInput.value.trim() : '';
                    const importe = importeInput ? importeInput.value.trim() : '';
                    const ticket = ticketInput ? ticketInput.value.trim() : '';
                    const observaciones = observacionesInput ? observacionesInput.value.trim() : '';

                    if(litros === ''){
                        mostrarTextoFlotanteRepostaje('La cantidad de litros es obligatoria');
                        litrosInput?.focus();
                        return;
                    }
                    const litrosNumero = Number(litros);

                    if(!Number.isFinite(litrosNumero) || litrosNumero <= 0){
                        mostrarTextoFlotanteRepostaje('los litros deben ser un número mayor que cero');
                        litrosInput?.focus();
                        return;
                    }

                    if(litrosNumero > 200){
                        mostrarTextoFlotanteRepostaje('La cantidad de litros no puede superar los 200');
                        litrosInput?.focus();
                        return;
                    }

                    if(importe === ''){
                        mostrarTextoFlotanteRepostaje('El importe es obligatorio');
                        importeInput?.focus();
                        return;
                    }

                    const importeNumero = Number(importe);

                    if(!Number.isFinite(importeNumero) || importeNumero <= 0){
                        mostrarTextoFlotanteRepostaje('El importe debe ser un número mayor que cero');
                        importeInput?.focus();
                        return;
                    }

                    if(importeNumero > 100){
                        mostrarTextoFlotanteRepostaje('El importe no puede superar los 100 euros');
                        importeInput?.focus();
                        return;
                    }

                    if(ticket === ''){
                        mostrarTextoFlotanteRepostaje('El ticket o factura es obligatorio');
                        ticketInput?.focus();
                        return;
                    }

                    const datosRepostaje = {
                        litros: litrosNumero,
                        importe: importeNumero,
                        ticket: ticket,
                        observaciones: observaciones
                    };
                    //console.log('Datos de repostaje validados; ', datosRepostaje);
                    try{
                        const resultado = await api(`/repostajes/${servicioSeleccionadoIdRepostaje}/repostar`, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${obtenerToken()}`
                            },
                            body: JSON.stringify(datosRepostaje)
                        });

                        console.log('Repostaje registrado correctamente: ', resultado);
                        const cerrarRepostaje = document.getElementById('cerrar-repostaje');
                        const mensajeRepostaje = document.getElementById('mensaje-repostaje');
                        mensajeRepostaje.className = 'alert alert-success mt3';
                        mensajeRepostaje.style.position = 'fixed';
                        mensajeRepostaje.textContent = 'Repostaje creado correctamente';

                        setTimeout(() =>{
                            cerrarRepostaje.click();
                            window.location.reload();
                        }, 3000);
                        
                    }catch(error){
                        const mensajeRepostaje = document.getElementById('mensaje-repostaje');
                        const cerrarRepostaje = document.getElementById('cerrar-repostaje');
                        console.error('Error al registrar el repostaje: ', error);
                        mensajeRepostaje.className = 'alert alert-danger mt3';
                        mensajeRepostaje.style.position = 'fixed';
                        mensajeRepostaje.textContent = 'Fallo al crear Repostaje';

                        /*setTimeout(() =>{
                            cerrarRepostaje.click();
                            window.location.reload();
                        }, 3000);*/
                    }
                });
            }
            // ===================================================================================================================================
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
                        //const respuesta = await fetch(`/servicios/${servicioSeleccionadoId}/fotos`, { // línea para local
                        const respuesta = await fetch(`https://transporteapp-backend.onrender.com/servicios/${servicioSeleccionadoId}/fotos`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${obtenerToken()}` },
                            body: datos
                        });

                        //const respuestaVideo = await fetch(`/servicios/${servicioSeleccionadoId}/video`, { // línea para local
                        const respuestaVideo = await fetch(`https://transporteapp-backend.onrender.com/servicios/${servicioSeleccionadoId}/video`, {
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

            if (solicitarCancelacion) {
                solicitarCancelacion.addEventListener('click', async () => {
                    
                    //const servicioId = document.querySelectorAll('[data-id]')[0]?.getAttribute('data-id');
                    const servicioId = servicioSeleccionadoIdCancelar;
                    const motivoInput = document.getElementById('motivo');
                    const motivo = motivoInput ? motivoInput.value.trim() : '';

                    //console.log('ID del servicio a cancelar:', servicioId);

                    if (!servicioId) {
                        console.error('No se ha seleccionado ningún servicio.');
                        alert('No se ha seleccionado ningún servicio');
                        mostrarTextoFlotante('No se ha seleccionado ningún servicio');
                        return;
                    }

                    if(!motivo){
                        alert('Debes ingresar un motivo');
                        mostrarTextoFlotante('Debes ingresar un motivo');
                        return;
                    }

                    try {
                        const resultado = await api(`/servicios/solicitud-cancelacion`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${obtenerToken()}` },
                            body: JSON.stringify({
                                servicio_id : servicioId, 
                                motivo: motivo
                            })
                        });

                        //console.log('solicitud enviada con éxito', resultado);
                        mostrarTextoFlotante(resultado.message);

                        const modalEl = document.getElementById('exampleModal_3');
                        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl); 
                        modal.hide();

                        setTimeout(() => window.location.reload(), 2000);

                    } catch (error) {
                        //console.warn('Error capturado en el frontend: ', error);
                        //console.log('Mensaje del backend: ', error.message);
                        //console.error('Error al enviar la solicitud:', error);
                        //alert('Ya existe una solicitud para este servicio');
                        const modalEl = document.getElementById('exampleModal_3');
                        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);

                        mostrarTextoFlotante('Ya existe una solicitud para este servicio');
                        modal.hide();
                        setTimeout(() => window.location.reload(), 2000);
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
                        //const respuestaEntrega = await fetch(`/servicios/${servicioSeleccionadoIdEntrega}/fotos`, { // línea para local
                        const respuestaEntrega = await fetch(`https://transporteapp-backend.onrender.com/servicios/${servicioSeleccionadoIdEntrega}/fotos`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${obtenerToken()}` },
                            body: datosEntrega
                        });

                        //const respuestaVideoEntrega = await fetch(`/servicios/${servicioSeleccionadoIdEntrega}/video`, { // línea para local
                        const respuestaVideoEntrega = await fetch(`https://transporteapp-backend.onrender.com/servicios/${servicioSeleccionadoIdEntrega}/video`, {
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
        //const mensajeBackend = document.getElementById('mensaje-backend'); 
        const textoFlotante = document.getElementById('texto-flotante');

        if(mensaje && textoFlotante){ 
            mensaje.textContent = mensajeTexto; 
            textoFlotante.style.display = 'block';
            setTimeout(() => { 
                textoFlotante.style.display = 'none'; 
            }, 3000); 
        }
    }
    
    function mostrarTextoFlotanteRepostaje(mensajeTexto){ 
        const mensajeRepostaje = document.getElementById('mensaje-backend');  
        const textoFlotanteRepostaje = document.getElementById('texto-flotante-backend');

        if(mensajeRepostaje && textoFlotanteRepostaje){ 
            mensajeRepostaje.textContent = mensajeTexto; 
            textoFlotanteRepostaje.style.display = 'block';
            setTimeout(() => { 
                textoFlotanteRepostaje.style.display = 'none'; 
            }, 3000); 
        }
    }

    /*if(mensajeBackend && textoFlotante){ 
        mensajeBackend.textContent = mensajeTexto; 
        textoFlotante.style.display = 'block'; 
        //textoFlotante.style.zIndex = 500;
        setTimeout(() => { 
            textoFlotante.style.display = 'none'; 
        }, 3000);
    }*/   
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