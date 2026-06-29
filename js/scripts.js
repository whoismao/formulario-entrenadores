const URL_GOOGLE_FORM = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdycnKlB0B3mpVjE_zeYUHCNJJoTxjYcLu7S68u1N5-s-Zo9w/formResponse';

document.getElementById('formularioEntrenadores').addEventListener('submit', async function(e) {
    e.preventDefault(); 
    
    const boton = document.querySelector('.boton-enviar');
    const mensajeExito = document.getElementById('notificacionExito');
    const textoOriginal = boton.textContent;
    
    mensajeExito.style.display = 'none';
    boton.textContent = 'Enviando...';
    boton.disabled = true;

    try {
        const respuestaForm = await fetch(URL_GOOGLE_FORM.replace('/formResponse', '/viewform'));
        const textoHtml = await respuestaForm.text();
        
        const regex = /name="entry\.(\d+)"/g;
        const entries = [];
        let coincidencia;
        
        while ((coincidencia = regex.exec(textoHtml)) !== null) {
            if (!entries.includes(coincidencia[1])) {
                entries.push(coincidencia[1]);
            }
        }

        if (entries.length < 8) {
            throw new Error('No se detectaron todos los campos del formulario de Google.');
        }

        const formUrlEncoded = new URLSearchParams();
        
        formUrlEncoded.append(`entry.${entries[0]}`, document.getElementById('nombre').value);
        formUrlEncoded.append(`entry.${entries[1]}`, document.querySelector('select[name="nacionalidad"]').value);
        formUrlEncoded.append(`entry.${entries[2]}`, document.getElementById('cedula').value);
        formUrlEncoded.append(`entry.${entries[3]}`, document.getElementById('fechaNacimiento').value);
        formUrlEncoded.append(`entry.${entries[4]}`, document.getElementById('direccion').value);
        formUrlEncoded.append(`entry.${entries[5]}`, document.getElementById('parroquia').value);
        formUrlEncoded.append(`entry.${entries[6]}`, document.getElementById('club').value);
        formUrlEncoded.append(`entry.${entries[7]}`, document.getElementById('acontecimiento').value);

        await fetch(URL_GOOGLE_FORM, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formUrlEncoded
        });

        mensajeExito.style.display = 'block';
        this.reset(); 
        
        setTimeout(() => {
            mensajeExito.style.display = 'none';
        }, 5000);

    } catch (error) {
        alert('Hubo un error al guardar los datos automáticamente.');
        console.error(error);
    } finally {
        boton.textContent = textoOriginal;
        boton.disabled = false;
    }
});