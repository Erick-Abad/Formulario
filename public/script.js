document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("inscripcionForm");

    formulario?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellidos = document.getElementById("apellidos").value.trim();
        const pais = document.getElementById("pais").value.trim();
        const otroPais = document.getElementById("otroPais")?.value.trim();
        const ciudad = document.getElementById("ciudad").value.trim();
        const otraCiudad = document.getElementById("otraCiudad")?.value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const telefono = document.getElementById("telefono").value.trim();

        if (!nombre || !apellidos || !pais || !ciudad || !direccion || !telefono) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        const datos = {
            nombre,
            apellidos,
            pais: pais === "Otro" ? otroPais : pais,
            ciudad: ciudad === "Otro" ? otraCiudad : ciudad,
            direccion,
            telefono,
        };

        try {
            const respuesta = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos),
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert("Inscripción enviada con éxito.");
                formulario.reset();
            } else {
                alert("Error al enviar la inscripción. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un problema al enviar la inscripción.");
        }
    });

    // Lógica para actualizar las ciudades según el país seleccionado
    document.getElementById("pais")?.addEventListener("change", function () {
        const otroPaisInput = document.getElementById("otroPais");
        otroPaisInput.style.display = this.value === "Otro" ? "block" : "none";
        actualizarCiudades();
    });

    document.getElementById("ciudad")?.addEventListener("change", function () {
        const otraCiudadInput = document.getElementById("otraCiudad");
        otraCiudadInput.style.display = this.value === "Otro" ? "block" : "none";
    });

    function actualizarCiudades() {
        const paisSeleccionado = document.getElementById("pais").value;
        const ciudadSelect = document.getElementById("ciudad");
        ciudadSelect.innerHTML = '<option value="" disabled selected>Selecciona tu ciudad</option>';

        const ciudadesPorPais = {
            "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata"],
            "Bolivia": ["La Paz", "Cochabamba", "Santa Cruz", "Sucre"],
            "Brasil": ["São Paulo", "Río de Janeiro", "Brasilia", "Belo Horizonte"],
            "Chile": ["Santiago", "Valparaíso", "Concepción", "Antofagasta"],
            "Colombia": ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"],
            "Ecuador": ["Quito", "Guayaquil", "Cuenca", "Manta", "Ambato"],
            "México": ["CDMX", "Guadalajara", "Monterrey", "Cancún", "Puebla"],
            "Perú": ["Lima", "Arequipa", "Trujillo", "Cusco"],
            "Venezuela": ["Caracas", "Maracaibo", "Valencia", "Barquisimeto"],
        };

        if (ciudadesPorPais[paisSeleccionado]) {
            ciudadesPorPais[paisSeleccionado].forEach(ciudad => {
                let option = document.createElement("option");
                option.value = ciudad;
                option.textContent = ciudad;
                ciudadSelect.appendChild(option);
            });
            ciudadSelect.innerHTML += '<option value="Otro">Otro</option>';
        } else {
            ciudadSelect.innerHTML += '<option value="Otro">Otro</option>';
        }
    }
});
