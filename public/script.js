document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("inscripcionForm");

    formulario?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellidos = document.getElementById("apellidos").value.trim();
        const pais = document.getElementById("pais").value;
        const otroPais = document.getElementById("otroPais").value.trim();
        const ciudad = document.getElementById("ciudad").value;
        const otraCiudad = document.getElementById("otraCiudad").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const telefono = document.getElementById("telefono").value.trim();

        // Validación de campos vacíos
        if (!nombre || !apellidos || !pais || !ciudad || !direccion || !telefono) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const datos = {
            nombre,
            apellidos,
            pais: pais === "Otro" ? otroPais : pais,
            ciudad: ciudad === "Otro" ? otraCiudad : ciudad,
            direccion,
            telefono
        };

        try {
            const respuesta = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });

            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }

            const resultado = await respuesta.json();

            if (resultado.message) {
                alert("Inscripción enviada con éxito. Revisa tu correo.");
                formulario.reset();
            } else {
                alert("Hubo un problema al enviar la inscripción.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un problema al enviar la inscripción.");
        }
    });

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
            "Venezuela": ["Caracas", "Maracaibo", "Valencia", "Barquisimeto"]
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
