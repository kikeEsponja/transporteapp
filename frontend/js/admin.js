document.addEventListener('DOMContentLoaded', async () => {
    if(!estaAutenticado()){
        window.location.href = './login.html';
        return;
    }

    const usuario = obtenerUsuario();

    let usuarioNombre = document.getElementById('usuario');
    usuarioNombre.textContent = usuario.nombre;

    try{
        const servicios = await api('/servicios');
        //const solicitudes = await api('/servicios/solicitudes');

        async function cargarServicios(){
            try{

                //console.log("Servicios cargados:", servicios);
                //console.log("solicitudes cargadas", solicitudes);

                /*const miModal = document.getElementById('exampleModal');

                if(miModal){

                    miModal.addEventListener('show.bs.modal', () => {

                        const vehiculo = document.getElementById('vehiculo');
                        const origen = document.getElementById('recoger');
                        const destino = document.getElementById('entregar');
                        const observaciones = document.getElementById('observaciones-publicar');

                        //const vehiculoTexto = vehiculo.options[vehiculo.selectedIndex].text;
                        const origenTexto = origen.options[origen.selectedIndex].text;
                        const destinoTexto = destino.options[destino.selectedIndex].text;

                        document.getElementById('auto-publicar').textContent = `Vehículo: ${vehiculo.value}`;
                        document.getElementById('origen-publicar').textContent = `Desde: ${origenTexto}`;
                        document.getElementById('destino-publicar').textContent = `Hasta: ${destinoTexto}`;
                        document.getElementById('observ-publicar').textContent = `Observaciones: ${observaciones.value || 'Sin observaciones'}`;
                    });
                }*/

                mostrarServicios(servicios);
                localStorage.setItem('servicios', JSON.stringify(servicios));

            }catch (error){
                console.error('Error cargando servicios: ', error);
            }
        }

        const mostrarServicios = (listaArray) => {

            let html = '';
            let htmlFin = '';

            const listaContenedor = document.getElementById('servicios-publicados');
            const listaContenedorFin = document.getElementById('servicios-fin');
        
            if(listaArray.length === 0){
                listaContenedor.innerHTML = '<h3>No se encontraron servicios</h3>';
                return;
            }

            listaArray.forEach(serv => {
                const cancelado = serv.estado === 'cancelado';
                const entregado = serv.estado === 'entregado';

                if(cancelado || entregado){
                    htmlFin += `
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Servicio #: ${serv.id}</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">Vehiculo: ${serv.marca} ${serv.modelo}. Matrícula: ${serv.matricula}</h6>    
                            <p class="card-text">Desde: ${serv.origen}</p>
                            <p class="card-text">Hasta: ${serv.destino}</p>
                            <hr>
                            <p class="card-text">Estado del servicio: ${serv.estado}</p>
                            <p class="card-text">asignado a: ${serv.nombre || ''}</p>
                            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal_2" data-id="${serv.id}" id="${serv.id}" ${cancelado ? 'disabled' : ''}  ${entregado ? 'disabled' : ''}>CANCELAR</button>
                        </div>
                    </div>
                `;
                }else{
                    html += `
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Servicio #: ${serv.id}</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">Vehiculo: ${serv.marca} ${serv.modelo}. Matrícula: ${serv.matricula}</h6>    
                            <p class="card-text">Desde: ${serv.origen}</p>
                            <p class="card-text">Hasta: ${serv.destino}</p>
                            <hr>
                            <p class="card-text">Estado del servicio: ${serv.estado}</p>
                            <p class="card-text">asignado a: ${serv.nombre || ''}</p>
                            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal_2" data-id="${serv.id}" id="${serv.id}" ${cancelado ? 'disabled' : ''}  ${entregado ? 'disabled' : ''}>CANCELAR</button>
                        </div>
                    </div>
                `;
                }

            });
            listaContenedor.innerHTML = html;

            listaContenedorFin.innerHTML = htmlFin;

            const botones = document.querySelectorAll('[data-id]');

            let servSeleccionado = null;

            botones.forEach(boton => {
                boton.addEventListener('click', () => {
                    //console.log(`se tocó el botón ${boton.getAttribute('data-id')}`);
                    servSeleccionado = boton.getAttribute('data-id');
                    const modal = document.getElementById('exampleModal_2');
                    modal.setAttribute('data-id', servSeleccionado);
                });
            });

        }
        cargarServicios();

    }catch (error){
        console.error('ERROR AL OBTENER SERVICIOS: ', error);
    }
//===============================================CARGAR VEHÍCULOS==========================================
    const vehiculos = await api('/vehiculos');
        
    async function cargarVehiculos(){
        try{
            //console.log("Vehículos cargados:", vehiculos);
            
            let contenedorVehiculos = document.getElementById('vehiculo');;

            const mostrarVehiculos = (listaArrayVehiculos) => {

                const vehiculosActivos = vehiculos.filter(v => v.activo === 1);
                //console.log('el veículo: ', vehiculosActivos)

                let htmlVehiculos = `<option value="">Selecciona un vehículo</option>`;

                listaArrayVehiculos.forEach(v => {
                    htmlVehiculos += `<option value="${v.id}" ${v.activo ? "" : "disabled"}>${v.marca} / ${v.modelo} - ${v.matricula}</option>`;
                });

                contenedorVehiculos.innerHTML = htmlVehiculos;

                localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
            }

            const buscadorVehiculo = document.getElementById('buscar-vehiculo');
            const resultadosVehiculos = document.getElementById('resultados-vehiculos');
            const vehiculoSeleccionado = document.getElementById('vehiculo');

            if(buscadorVehiculo && resultadosVehiculos && vehiculoSeleccionado){
                buscadorVehiculo.addEventListener('input', () => {
                    const texto = buscadorVehiculo.value.trim().toLowerCase();
                    resultadosVehiculos.innerHTML = '';

                    const vehiculosFiltrados = vehiculos.filter(v => {
                        if(!v.activo){
                            return false;
                        }

                        const marca = (v.marca || '').toLowerCase();
                        const modelo = (v.modelo || '').toLowerCase();
                        const matricula = (v.matricula || '').toLowerCase();

                        return(
                            marca.includes(texto) || modelo.includes(texto) || matricula.includes(texto)
                        );
                    });

                    if(vehiculosFiltrados.length === 0){
                        resultadosVehiculos.innerHTML = `
                        <div class="list-group-item">No se encontraron Vehículos</div>`;
                        return;
                    }

                    vehiculosFiltrados.forEach(v => {
                        const opcion = document.createElement('button');

                        opcion.type = 'button';
                        opcion.className = 'list-group-item list-group-item-action';

                        opcion.textContent = `${v.marca} ${v.modelo} - ${v.matricula}`;

                        opcion.addEventListener('click', () =>{
                            buscadorVehiculo.value = `${v.marca} ${v.modelo} - ${v.matricula}`;

                            vehiculoSeleccionado.value = v.id;

                            resultadosVehiculos.innerHTML = '';
                        });
                        resultadosVehiculos.appendChild(opcion);
                    });
                    mostrarVehiculos(vehiculosFiltrados);
                });
            }
            mostrarVehiculos(vehiculos);

        }catch (error){
            console.error('Error cargando vehiculos: ', error);
        }
    }
    
    cargarVehiculos();

    const modalCrearServicio = document.getElementById('exampleModal');
    if (modalCrearServicio) {
    modalCrearServicio.addEventListener('show.bs.modal', () => {

        const vehiculo = document.getElementById('vehiculo');
        const origen = document.getElementById('recoger');
        const destino = document.getElementById('entregar');
        const observaciones =
            document.getElementById('observaciones-publicar');

        const vehiculoSeleccionado = vehiculos.find(
            v => Number(v.id) === Number(vehiculo.value)
        );

        const origenTexto =
            origen.options[origen.selectedIndex]?.text || '';

        const destinoTexto =
            destino.options[destino.selectedIndex]?.text || '';

        document.getElementById('auto-publicar').textContent =
            vehiculoSeleccionado
                ? `Vehículo: ${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} - ${vehiculoSeleccionado.matricula}`
                : 'Vehículo: No seleccionado';

        document.getElementById('origen-publicar').textContent =
            `Desde: ${origenTexto}`;

        document.getElementById('destino-publicar').textContent =
            `Hasta: ${destinoTexto}`;

        document.getElementById('observ-publicar').textContent =
            `Observaciones: ${observaciones.value || 'Sin observaciones'}`;
    });
}
//===========================================================CARGAR TIENDAS========================================
    const tiendas = await api('/tiendas');
        
    async function cargarTiendas(){
        try{
            //console.log("Tiendas cargadas:", tiendas);
            
            let contenedorTiendas = document.getElementById('recoger');
            let contenedorTiendasEntrega = document.getElementById('entregar');

            const mostrarTiendas = (listaArrayTiendas) => {

                let htmlTiendas = '';

                listaArrayTiendas.forEach(t => {
                    htmlTiendas += `<option value="${t.id}"> ${t.nombre} - ${t.ciudad}</option>`;
                });

                contenedorTiendas.innerHTML = htmlTiendas;
                contenedorTiendasEntrega.innerHTML = htmlTiendas;

                //mostrarVehiculos(vehiculosActivos);
                localStorage.setItem('concesionarios', JSON.stringify(tiendas));
            }
            mostrarTiendas(tiendas);

        }catch (error){
            console.error('Error cargando tiendas: ', error);
        }
    }
    
    cargarTiendas();
//===========================================CARGAR REPOSTAJES==========================================
const repostajes = await api('/repostajes');

async function cargarRepostajes(){
    try{
        const listaContenedorRepostajes = document.getElementById('historico-repostajes');
        if(!listaContenedorRepostajes){
            return;
        }
        mostrarRepostajes(repostajes);
    }catch (error){
        console.error('Error cargando repostajes: ', error);
    }
}

/**********************************INGRESAR VEHÍCULO********************************************** */
    const formIngVehiculo = document.getElementById('form-ingresar-vehiculo');
    const modalVehiculo = document.getElementById('exampleModal_3');

    formIngVehiculo.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const matricula = document.getElementById('matricula').value.trim();
        const marca = document.getElementById('marca').value.trim();
        const modelo = document.getElementById('modelo').value.trim();
        const color = document.getElementById('color').value.trim();
        const combustible = document.getElementById('combustible').value.trim();
        const observaciones = document.getElementById('observaciones').value.trim();

        const mensajeVehiculo = document.getElementById('mensaje-vehiculo');

        try{
            const res = await regVehiculo(matricula, marca, modelo, color, combustible, observaciones);
        
            //alert('Vehículo ingresado con éxito', res);
            if(mensajeVehiculo){
                modalVehiculo.style.display = 'none';
                mensajeVehiculo.className = 'alert alert-success mt-3';
                mensajeVehiculo.textContent = res.message;
            }

            //formIngVehiculo.reset();

            setTimeout(() => {
                window.location.reload();
            }, 3000);

        }catch(error){
            console.error('Error en el ingreso: ', error);
            alert(error.message || 'Error al ingresar vehículo');
        }
    });
/**********************************INGRESAR TIENDA********************************************** */
    const formIngTienda = document.getElementById('form-ingresar-tienda');
    const modalTienda = document.getElementById('exampleModal_4');

    formIngTienda.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre-tienda').value.trim();
        const direccion = document.getElementById('direccion-tienda').value.trim();
        const ciudad = document.getElementById('ciudad-tienda').value.trim();
        const telefono = document.getElementById('telefono-tienda').value.trim();
        const horario = document.getElementById('horario-tienda').value.trim();

        const mensajeTienda = document.getElementById('mensaje-tienda');
        try{
            const res = await regTienda(nombre, direccion, ciudad, telefono, horario);
        
            //alert('Tienda ingresada con éxito', res);
            if(mensajeTienda){
                modalTienda.style.display = 'none';
                mensajeTienda.className = 'alert alert-success mt3';
                mensajeTienda.textContent = res.message;
            }

            setTimeout(() => {
                window.location.reload();
            }, 3000);

        }catch(error){
            console.error('Error en el ingreso: ', error);
            alert(error.message || 'Error al ingresar tienda');
        }
    });
/**********************************PUBLICAR UN SERVICIO********************************************** */
    const confirmarPublicacionServicio = document.getElementById('confirmar-publicar');
    //const modalCrearServicio = document.getElementById('exampleModal');

    if(confirmarPublicacionServicio){
        confirmarPublicacionServicio.addEventListener('click', async () => {
            const vehiculoId = document.getElementById('vehiculo').value;
            const origenId = document.getElementById('recoger').value;
            const destinoId = document.getElementById('entregar').value;

            if(!vehiculoId || !origenId || !destinoId){
                alert('Vehículo, origen o destino no seleccionado');
                return;
            }

            if(origenId === destinoId){
                alert('El destino debe ser diferente del origen');
                return;
            }

            try{
                const res = await api('/servicios/', { 
                    method: 'POST', 
                    body: JSON.stringify({
                        vehiculo_id: Number(vehiculoId),
                        origen_id: Number(origenId),
                        destino_id: Number(destinoId),
                        observaciones: document.getElementById('observaciones-publicar').value
                    })
                });
                const mensajeAdmin = document.getElementById('mensaje-admin');
    
                console.log('respuesta del servidor', res);
                if(mensajeAdmin){
                    modalCrearServicio.style.display = 'none';
                    mensajeAdmin.className = 'alert alert-success mt3';
                    mensajeAdmin.textContent = res.message;
                }
                
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
                
            }catch(error){
                console.error('Error al publicar el servicio: ', error);
                alert(error.message || 'Error al publicar este servicio');
            }
        });
    }
/**********************************CANCELAR UN SERVICIO********************************************** */
    const confirmarCancelarServicio = document.getElementById('confirmar-cancelar');
    
    if(confirmarCancelarServicio){
        confirmarCancelarServicio.addEventListener('click', async () => {
            //capturar el ID del servicio seleccionado
            const servicioId = document.querySelectorAll('[data-id]')[0]?.getAttribute('data-id');
            //console.log('ID del servicio a cancelar:', servicioId);

            if(!servicioId){
                alert('No se ha seleccionado un servicio para cancelar');
                return;
            }
            try{
                const res = await api(`/servicios/${servicioId}/cancelar`, {
                    method: 'POST', 
                    body: JSON.stringify({
                        estado: 'cancelado'
                    })
                });
    
                //console.log('respuesta del servidor', res);
                window.location.reload();
                
                const mensaje = document.getElementById('mensaje');
                if(mensaje){
                    mensaje.textContent = res.message;
                }

                let textoFlotante = document.querySelector('.texto-flotante');
                
                if(textoFlotante){
                    setTimeout(() => {
                        textoFlotante.style.display = 'block';
                    }, 500);
                    setTimeout(() =>{
                        textoFlotante.style.display = 'none';
                        window.location.reload();
                    }, 4000);
                }

                const modalEl = document.getElementById('exampleModal_2');
                if(modalEl){
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if(modal){
                        modal.hide();
                    }
                }
            }catch(error){
                console.error('Error al cancelar el servicio: ', error);
                alert(error.message || 'Error al cancelar este servicio');
            }
        });
    }
/*==================================ADMINISTRAR PERFILES====================================================*/
    const formAdmUsuario = document.getElementById('form-adm-usuario'); 
    const modalAdmUsuario = document.getElementById('exampleModal_5'); 
    
    if(formAdmUsuario){
        formAdmUsuario.addEventListener('submit', async (e) => { 
            e.preventDefault(); 
            
            const nombreUsuario = document.getElementById('nombre-usuario').value.trim(); 
            const apellidoUsuario = document.getElementById('apellido-usuario').value.trim(); 
            const telUsuario = document.getElementById('tel-usuario').value.trim(); 
            const emailUsuario = document.getElementById('email-usuario').value.trim(); 
            const passwordUsuario = document.getElementById('password-usuario').value; 
            const rolUsuario = document.getElementById('rol-usuario').value.trim(); 
            
            if(rolUsuario !== "ADMIN" && rolUsuario !== "CONDUCTOR"){ 
                alert('Rol inválido'); 
                return; 
            } 
            
            const mensajeAdminUsuario = document.getElementById('mensaje-admin-usuario'); 
            try { 
                const res = await usuario( nombre, apellido, email, password, telefono, rol, activo );
                
                if(mensajeAdminUsuario){ 
                    mensajeAdminUsuario.className = 'alert alert-success mt-3'; 
                    mensajeAdminUsuario.textContent = res.message; 
                } 
                
                setTimeout(() => { 
                    window.location.reload(); 
                }, 3000); 
            } catch (error) { 
                console.error('Error en el registro de usuario:', error); 
                alert(error.message || 'Error al registrar usuario'); 
            } 
        }); 
    }
/**********************************SOLICITUDES DE CONDUCTORES********************************************** */    
    const botonSolicitudes = document.getElementById('solicitudes-conductores');
    if(botonSolicitudes){
        botonSolicitudes.addEventListener('click', () =>{
            window.location.href = './admin-solicitudes.html';
        })
    }

    const botonVolverAdmin = document.getElementById('ir-admin');
    if(botonVolverAdmin){
        botonVolverAdmin.addEventListener('click', () =>{
            window.location.href = './admin.html';
        })
    }

    const botonHistoricoRepostajes = document.getElementById('ir-historico-repostajes');
    if(botonHistoricoRepostajes){
        botonHistoricoRepostajes.addEventListener('click', () => {
            window.location.href = './admin-historico-repostajes.html';
        })
    }
/**********************************CERRAR SESIÓN********************************************** */
    const cerrar_sesion = document.getElementById('cerrar-sesion');
    cerrar_sesion.addEventListener('click', () => {
        cerrarSesion();
    });
});