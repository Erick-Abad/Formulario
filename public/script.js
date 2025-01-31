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
