const URL_GOOGLE_SCRIPT = 'https://script.google.com/macros/s/AKfycbzQwOEya5M7Ft-U91A6brQiXIP5THWE3XgZNCw-v8WIs_cZ5Eyd0MVk6h7uJkfJCFlpfw/exec';

document.getElementById('formularioEntrenadores').addEventListener('submit', async function(e) {
    e.preventDefault(); 
    
    const boton = document.querySelector('.boton-enviar');
    const mensajeExito = document.getElementById('notificacionExito');
    const textoOriginal = boton.textContent;
    
    mensajeExito.style.display = 'none';
    
    boton.textContent = 'Enviando...';
    boton.disabled = true;

    const formData = new FormData(this);

    try {
        await fetch(URL_GOOGLE_SCRIPT, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' 
        });

        mensajeExito.style.display = 'block';
        this.reset(); 
        
        setTimeout(() => {
            mensajeExito.style.display = 'none';
        }, 5000);

    } catch (error) {
        alert('Hubo un error al guardar los datos.');
        console.error(error);
    } finally {
        boton.textContent = textoOriginal;
        boton.disabled = false;
    }
});