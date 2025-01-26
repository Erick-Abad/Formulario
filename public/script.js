document.getElementById('inscripcionForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();

    if (nombre === '' || correo === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    fetch('/api/submit-form', {  // URL corregida para Vercel
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo })
    }).then(response => {
        if (response.ok) {
            alert('¡Inscripción exitosa! Revisa tu correo.');
            document.getElementById('inscripcionForm').reset();
        } else {
            alert('Hubo un problema, intenta nuevamente.');
        }
    }).catch(error => {
        alert('Error de conexión. Inténtalo más tarde.');
        console.error(error);
    });
});
