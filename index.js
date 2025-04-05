// integración de la api

// Elementos
const resultsContainer = document.getElementById("results");
const detalleSection = document.getElementById("detalle");
const detalleContenido = document.getElementById("detalle-contenido");
const filterType = document.getElementById("filter-type");
const filterStatus = document.getElementById("filter-status");
const filterGender = document.getElementById("filter-gender");

// Mostrar personajes
function mostrarPersonajes(personajes) {
    resultsContainer.innerHTML = "";
    detalleSection.classList.add("hidden");
    resultsContainer.classList.remove("hidden");

    personajes.forEach(personaje => {
        const div = document.createElement("div");
        div.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "text-black", "cursor-pointer");

        div.innerHTML = `
            <img src="${personaje.image}" alt="${personaje.name}" class="w-full rounded-md">
            <h3 class="text-xl font-bold mt-2">${personaje.name}</h3>
            <p>${personaje.species} - ${personaje.status}</p>
        `;

        div.addEventListener("click", () => mostrarDetalle(personaje, "character"));

        resultsContainer.appendChild(div);
    });
}

// Mostrar detalle
function mostrarDetalle(item, tipo) {
    detalleContenido.innerHTML = `
        <img src="${item.image || 'imagenes/hero-2.jpeg'}" alt="${item.name}" class="w-full rounded-md mb-4">
        <h2 class="text-2xl font-bold mb-2">${item.name}</h2>
        <p>${tipo === "character" ? `${item.status} - ${item.species} - ${item.gender}` : item.episode}</p>
    `;
    detalleSection.classList.remove("hidden");
    resultsContainer.classList.add("hidden");
}

// Volver
function volverAInicio() {
    detalleSection.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
}

// Obtener personajes por filtros
function obtenerPersonajesFiltrados() {
    let url = "https://rickandmortyapi.com/api/character/?";
    const status = filterStatus.value;
    const gender = filterGender.value;

    if (status) url += `status=${status}&`;
    if (gender) url += `gender=${gender}&`;

    fetch(url)
        .then(res => res.json())
        .then(data => mostrarPersonajes(data.results))
        .catch(err => console.error(err));
}

// Event listener para el filtro tipo
filterType.addEventListener("change", () => {
    const tipo = filterType.value;

    if (tipo === "character") {
        filterStatus.disabled = false;
        filterGender.disabled = false;
        obtenerPersonajesFiltrados();
    } else if (tipo === "episode") {
        filterStatus.disabled = true;
        filterGender.disabled = true;
        obtenerEpisodios();
    }
});

// Obtener episodios
function obtenerEpisodios() {
    fetch("https://rickandmortyapi.com/api/episode")
        .then(res => res.json())
        .then(data => mostrarEpisodios(data.results))
        .catch(err => console.error(err));
}

function mostrarEpisodios(episodios) {
    resultsContainer.innerHTML = "";

    episodios.forEach(episodio => {
        const div = document.createElement("div");
        div.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "text-black", "cursor-pointer");

        div.innerHTML = `
            <h3 class="text-xl font-bold mt-2">${episodio.name}</h3>
            <p>${episodio.episode}</p>
            <p>${episodio.air_date}</p>
        `;

        div.addEventListener("click", () => mostrarDetalle(episodio, "episode"));

        resultsContainer.appendChild(div);
    });
}

// Al cargar la página
fetch("https://rickandmortyapi.com/api/character")
    .then(response => response.json())
    .then(data => mostrarPersonajes(data.results))
    .catch(error => console.error("Error al obtener los datos:", error));
