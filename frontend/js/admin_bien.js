document.addEventListener('DOMContentLoaded', async () => {
    if(!estaAutenticado()){
        window.location.href = './login.html';
        return;
    }
console
    const usuario = obtenerUsuario();

    let usuarioNombre = document.getElementById('usuario');
    usuarioNombre.textContent = usuario.nombre;

    try{
        const servicios = await api('/servicios');

        async function cargarServicios(){
            try{

                //console.log("Servicios cargados:", servicios);
                
                const miModal = document.getElementById('exampleModal');
                miModal.addEventListener('show.bs.modal', (event) => {
                    const boton = event.relatedTarget;

                    const servicioId = boton.getAttribute('data-id');

                    const servicioSeleccionado = servicios.find(s => s.id == servicioId);

                    if(servicioSeleccionado){
                        document.getElementById('auto').textContent = `Marca: ${servicioSeleccionado.marca}, ${servicioSeleccionado.modelo}. Matrícula: ${servicioSeleccionado.matricula}`;
                        document.getElementById('origen').textContent = `Desde: ${servicioSeleccionado.origen}`;
                        document.getElementById('destino').textContent = `Hasta: ${servicioSeleccionado.destino}`;
                    }
                });

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

    const vehiculos = await api('/vehiculos');
        
    async function cargarVehiculos(){
        try{
            //console.log("Vehículos cargados:", vehiculos);
            
            let contenedorVehiculos = document.getElementById('vehiculo');;

            const mostrarVehiculos = (listaArrayVehiculos) => {

                const vehiculosActivos = vehiculos.filter(v => v.activo === 1);
                //console.log('el veículo: ', vehiculosActivos)

                let htmlVehiculos = '';

                listaArrayVehiculos.forEach(v => {
                    htmlVehiculos += `<option value="${v.id}" ${v.activo ? "" : "disabled"}>${v.marca} ${v.modelo} - ${v.matricula}</option>`;
                });

                contenedorVehiculos.innerHTML = htmlVehiculos;

                localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
            }
            mostrarVehiculos(vehiculos);

        }catch (error){
            console.error('Error cargando vehiculos: ', error);
        }
    }
    
    cargarVehiculos();

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

/**********************************INGRESAR VEHÍCULO********************************************** */
    const formIngVehiculo = document.getElementById('form-ingresar-vehiculo');

    formIngVehiculo.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const matricula = document.getElementById('matricula').value.trim();
        const marca = document.getElementById('marca').value.trim();
        const modelo = document.getElementById('modelo').value.trim();
        const color = document.getElementById('color').value.trim();
        const combustible = document.getElementById('combustible').value.trim();
        const observaciones = document.getElementById('observaciones').value.trim();

        try{
            const res = await regVehiculo(matricula, marca, modelo, color, combustible, observaciones);
        
            alert('Vehículo ingresado con éxito', res);
            window.location.reload();

        }catch(error){
            console.error('Error en el ingreso: ', error);
            alert(error.message || 'Error al ingresar vehículo');
        }
    });
/**********************************INGRESAR TIENDA********************************************** */
    const formIngTienda = document.getElementById('form-ingresar-tienda');

    formIngTienda.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre-tienda').value.trim();
        const direccion = document.getElementById('direccion-tienda').value.trim();
        const ciudad = document.getElementById('ciudad-tienda').value.trim();
        const telefono = document.getElementById('telefono-tienda').value.trim();
        const horario = document.getElementById('horario-tienda').value.trim();

        try{
            const res = await regTienda(nombre, direccion, ciudad, telefono, horario);
        
            alert('Tienda ingresada con éxito', res);
            window.location.reload();

        }catch(error){
            console.error('Error en el ingreso: ', error);
            alert(error.message || 'Error al ingresar tienda');
        }
    });
/**********************************PUBLICAR UN SERVICIO********************************************** */
    const confirmarPublicacionServicio = document.getElementById('confirmar-publicar');
    
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
                        destino_id: Number(destinoId)
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

                const modalEl = document.getElementById('exampleModal');
                if(modalEl){
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if(modal){
                        modal.hide();
                    }
                }
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


/**********************************CERRAR SESIÓN********************************************** */
    const cerrar_sesion = document.getElementById('cerrar-sesion');
    cerrar_sesion.addEventListener('click', () => {
        cerrarSesion();
    });
});