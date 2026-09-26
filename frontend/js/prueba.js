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
            setTimeout(() =>{
                cerrarRepostaje.click();
                window.location.reload();
            }, 3000);
        }
    });
}