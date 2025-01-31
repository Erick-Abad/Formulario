document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("inscripcionForm");
    const paisSelect = document.getElementById("pais");
    const otroPaisInput = document.getElementById("otroPais");
    const ciudadSelect = document.getElementById("ciudad");
    const otraCiudadInput = document.getElementById("otraCiudad");

    // Datos de países y ciudades
    const ciudadesPorPais = {
        "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata"],
        "Bolivia": ["La Paz", "Cochabamba", "Santa Cruz", "Sucre"],
        "Brasil": ["São Paulo", "Río de Janeiro", "Brasilia", "Belo Horizonte"],
        "Chile": ["Santiago", "Valparaíso", "Concepción", "Antofagasta"],
        "Colombia": ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"],
        "Costa Rica": ["San José", "Alajuela", "Heredia", "Cartago"],
        "Cuba": ["La Habana", "Santiago de Cuba", "Camagüey", "Holguín"],
        "Ecuador": ["Quito", "Guayaquil", "Cuenca", "Manta", "Ambato"],
        "El Salvador": ["San Salvador", "Santa Ana", "San Miguel"],
        "Guatemala": ["Ciudad de Guatemala", "Quetzaltenango", "Escuintla", "Antigua"],
        "Honduras": ["Tegucigalpa", "San Pedro Sula", "Choloma", "La Ceiba"],
        "México": ["CDMX", "Guadalajara", "Monterrey", "Cancún", "Puebla"],
        "Nicaragua": ["Managua", "León", "Masaya", "Granada"],
        "Panamá": ["Ciudad de Panamá", "Colón", "David", "Santiago"],
        "Paraguay": ["Asunción", "Ciudad del Este", "Encarnación"],
        "Perú": ["Lima", "Arequipa", "Trujillo", "Cusco"],
        "República Dominicana": ["Santo Domingo", "Santiago", "La Romana", "San Pedro"],
        "Uruguay": ["Montevideo", "Punta del Este", "Salto", "Maldonado"],
        "Venezuela": ["Caracas", "Maracaibo", "Valencia", "Barquisimeto"],
        "Otro": ["Otro"]
    };

    // Función para actualizar ciudades según el país seleccionado
    function actualizarCiudades() {
        const paisSeleccionado = paisSelect.value;
        ciudadSelect.innerHTML = '<option value="" disabled selected>Selecciona tu ciudad</option>';

        if (ciudadesPorPais[paisSeleccionado]) {
            ciudadesPorPais[paisSeleccionado].forEach(ciudad => {
                let option = document.createElement("option");
                option.value = ciudad;
                option.textContent = ciudad;
                ciudadSelect.appendChild(option);
            });
            ciudadSelect.innerHTML += '<option value="Otro">Otro</option>';
        } else {
            ciudadSelect.innerHTML = '<option value="Otro">Otro</option>';
        }
    }

    // Evento al cambiar el país
    paisSelect.addEventListener("change", function () {
        otroPaisInput.style.display = this.value === "Otro" ? "block" : "none";
        actualizarCiudades();
    });

    // Evento al cambiar la ciudad
    ciudadSelect.addEventListener("change", function () {
        otraCiudadInput.style.display = this.value === "Otro" ? "block" : "none";
    });

    // Envío del formulario
    formulario.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellidos = document.getElementById("apellidos").value.trim();
        const pais = paisSelect.value;
        const ciudad = ciudadSelect.value;
        const direccion = document.getElementById("direccion").value.trim();
        const telefono = document.getElementById("telefono").value.trim();

        // Verificación de campos obligatorios
        if (!nombre || !apellidos || !pais || !ciudad || !direccion || !telefono) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Estructura de datos para enviar
        const datos = {
            nombre,
            apellidos,
            pais: pais === "Otro" ? otroPaisInput.value.trim() : pais,
            ciudad: ciudad === "Otro" ? otraCiudadInput.value.trim() : ciudad,
            direccion,
            telefono
        };

        try {
            const respuesta = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert("Inscripción enviada con éxito.");
                formulario.reset();
                otroPaisInput.style.display = "none";
                otraCiudadInput.style.display = "none";
            } else {
                alert("Error al enviar la inscripción. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un problema al enviar la inscripción.");
        }
    });
});
