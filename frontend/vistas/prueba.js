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

        async function cargarServicios(){
            try{

                console.log("Servicios cargados:", servicios);
                
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

            const listaContenedor = document.getElementById('servicios-publicados');
        
            if(listaArray.length === 0){
                listaContenedor.innerHTML = '<h3>No se encontraron servicios</h3>';
                return;
            }

            listaArray.forEach(serv => {

                html += `
                <div>
                    <p>Servicio #: ${serv.id}</p>
                    <p name="${serv.marca}">Vehiculo: ${serv.marca} ${serv.modelo}. Matrícula: ${serv.matricula}</p>
                    <!--<p name="${serv.modelo}">${serv.modelo}</p>-->
                    <!--<p name="${serv.matricula}">${serv.matricula}</p>-->
                    <p name="${serv.origen}">Desde: ${serv.origen}</p>
                    <p name="${serv.destino}">Hasta: ${serv.destino}</p>
                    <p>Estado del servicio: ${serv.estado}</p>
                    <p>asignado a: ${serv.nombre || ''}</p>
                    <button data-bs-toggle="modal" data-bs-target="#exampleModal_2" data-id="${serv.id}" id="${serv.id}">CANCELAR</button>
                    <hr>
                </div>
                `;
            });
            listaContenedor.innerHTML = html;

            const botones = document.querySelectorAll('[data-id]');

            let servSeleccionado = null;

            botones.forEach(boton => {
                boton.addEventListener('click', () => {
                    console.log(`se tocó el botón ${boton.getAttribute('data-id')}`);
                    servSeleccionado = boton.getAttribute('data-id');
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
            console.log("Vehículos cargados:", vehiculos);
            
            let contenedorVehiculos = document.getElementById('vehiculo');;

            const mostrarVehiculos = (listaArrayVehiculos) => {

                const vehiculosActivos = vehiculos.filter(v => v.activo === 1);
                console.log('el veículo: ', vehiculosActivos)

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
            console.log("Tiendas cargadas:", tiendas);
            
            let contenedorTiendas = document.getElementById('recoger');
            let contenedorTiendasEntrega = document.getElementById('entregar');

            const mostrarTiendas = (listaArrayTiendas) => {

                let htmlTiendas = '';

                listaArrayTiendas.forEach(t => {
                    htmlTiendas += `<option value="${t.id}"> ${t.nombre} - ${t.ciudad}</option>`;
                });

                contenedorTiendas.innerHTML = htmlTiendas;
                contenedorTiendasEntrega.innerHTML = htmlTiendas;

                localStorage.setItem('concesionarios', JSON.stringify(tiendas));
            }
            mostrarTiendas(tiendas);

        }catch (error){
            console.error('Error cargando tiendas: ', error);
        }
    }
    
    cargarTiendas();

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

    const confirmarPublicacionServicio = document.getElementById('confirmar-publicar');
    
    if(confirmarPublicacionServicio){
        confirmarPublicacionServicio.addEventListener('click', async () => {
        
            const vehiculoId = document.getElementById('vehiculo').value;
            const origenId = document.getElementById('recoger').value;;
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
    
                console.log('respuesta del servidor', res);
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

    const cerrar_sesion = document.getElementById('cerrar-sesion');
    cerrar_sesion.addEventListener('click', () => {
        cerrarSesion();
    });
});