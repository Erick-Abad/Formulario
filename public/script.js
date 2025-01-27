document.getElementById('inscripcionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();

    if (nombre === '' || correo === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        alert('Por favor, introduce un correo electrónico válido.');
        return;
    }

    fetch('/api/send-email', {  // Cambié la ruta a la función de Vercel
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('¡Inscripción exitosa! Revisa tu correo.');
            document.getElementById('inscripcionForm').reset();
        } else {
            alert('Hubo un problema, intenta nuevamente.');
        }
    })
    .catch(error => {
        alert('Error de conexión. Inténtalo más tarde.');
        console.error('Error:', error);
    });
});
