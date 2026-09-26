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
            let otroHtml = '';

            const listaContenedor = document.querySelector('#lista-servicios');
            const listaContenedorOtros = document.querySelector('#lista-otros');
        
            if(listaArray.length === 0){
                listaContenedor.innerHTML = '<h3>No se encontraron servicios</h3>';
                return;
            }

            listaArray.forEach(serv => {

                const publicado = serv.estado !== 'publicado';

                if(!publicado){
                    html += `
                        <div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">Vehículo: ${serv.marca} - ${serv.modelo}</h5>
                                <h6 class="card-subtitle mb-2 text-body-secondary">Matrícula: ${serv.matricula}</h6>
                                <p class="card-text">Desde: ${serv.origen}</p>
                                <p class="card-text">Hasta: ${serv.destino}</p>
                                <hr>
                                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${serv.id}" ${publicado ? 'disabled' : ''} id="${serv.id}">RESERVAR</button>
                            </div>
                        </div>
                    `;
                }else{
                    otroHtml += `                    
                        <div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">Vehículo: ${serv.marca} - ${serv.modelo}</h5>
                                <h6 class="card-subtitle mb-2 text-body-secondary">Matrícula: ${serv.matricula}</h6>
                                <p class="card-text">Desde: ${serv.origen}</p>
                                <p class="card-text">Hasta: ${serv.destino}</p>
                                <hr>
                                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${serv.id}" ${publicado ? 'disabled' : ''} id="${serv.id}">RESERVAR</button>
                            </div>
                        </div>`;
                }
            });
            listaContenedor.innerHTML = html;
            listaContenedorOtros.innerHTML = otroHtml;

            const botones = document.querySelectorAll('[data-id]');

            let servSeleccionado = null;

            botones.forEach(boton => {
                boton.addEventListener('click', () => {
                    //console.log(`se tocó el botón ${boton.getAttribute('data-id')}`);
                    servSeleccionado = boton.getAttribute('data-id');
                });
            });

            const confirmar = document.getElementById('confirmar');
            confirmar.addEventListener('click', async () => {
            
                //const servSeleccionado = boton.getAttribute('data-id');
                const res = await api(`/servicios/${servSeleccionado}/reservar`, { method: 'POST' });
                //console.log('respuesta del servidor', res);
                
                const mensaje = document.getElementById('mensaje');
                mensaje.textContent = res.message;

                let textoFlotante = document.querySelector('.texto-flotante');
                
                if(textoFlotante){
                    setTimeout(() => {
                        textoFlotante.style.display = 'block';
                        textoFlotante.style.zIndex = 10;
                    }, 500);
                    setTimeout(() =>{
                        textoFlotante.style.display = 'none';
                        window.location.reload();
                    }, 4000);
                }

                const modal = bootstrap.Modal.getInstance(
                    document.getElementById('exampleModal')
                );
                modal.hide();
            });
        }

        cargarServicios();

    }catch (error){
        console.error('ERROR AL OBTENER SERVICIOS: ', error);
    }

    const irDetalles = document.getElementById('detalles');

    if(irDetalles){
        irDetalles.addEventListener('click', () => {
            window.location.href = './detalles.html';
        });
    }

    const cerrar_sesion = document.getElementById('cerrar-sesion');
    cerrar_sesion.addEventListener('click', () => {
        cerrarSesion();
    });
});