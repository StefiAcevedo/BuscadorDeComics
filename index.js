// integración de la api

// Elementos
const resultsContainer = document.getElementById("results");
const detalleSection = document.getElementById("detalle");
const detalleContenido = document.getElementById("detalle-contenido");
const filterType = document.getElementById("filter-type");
const filterStatus = document.getElementById("filter-status");
const filterGender = document.getElementById("filter-gender");
const searchInput = document.getElementById("search"); // buscador
const pagination = document.getElementById("pagination"); // paginador



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

// lógica del paginador (6 resultados para que genere bloques de info pares)

let currentPage = 1;
const itemsPerPage = 6;
let personajesData = []; // guardamos la data completa

function actualizarPaginador() {
  const totalPages = Math.ceil(personajesData.length / itemsPerPage);
  document.getElementById("pageIndicator").textContent = `Página ${currentPage} de ${totalPages}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

function mostrarPagina(page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const itemsPagina = personajesData.slice(start, end);
  mostrarPersonajes(itemsPagina);
  actualizarPaginador();
}

document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      mostrarPagina(currentPage);
    }
  });
  
  document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(personajesData.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      mostrarPagina(currentPage);
    }
  });


// Mostrar detalle
function mostrarDetalle(item, tipo) {
    detalleContenido.innerHTML = `
    <img src="${item.image || 'imagenes/hero-2.jpeg'}" alt="${item.name}" class="w-full rounded-md mb-4">
    <h2 class="text-2xl font-bold mb-2">${item.name}</h2>
    <p>${tipo === "character" ? `${item.status} - ${item.species} - ${item.gender}` : item.episode}</p>
    <div id="detalle-extra" class="mt-4"></div>
`;

if (tipo === "character") {
    const contenedor = document.getElementById("detalle-extra");
    contenedor.innerHTML = "<p class='font-semibold'>Episodios:</p><ul class='list-disc list-inside'></ul>";

    const ul = contenedor.querySelector("ul");

    // Traer episodios en paralelo
    const promises = item.episode.map(url => fetch(url).then(res => res.json()));
    Promise.all(promises).then(episodios => {
        episodios.forEach(ep => {
            const li = document.createElement("li");
            li.textContent = `${ep.name} (${ep.episode})`;
            ul.appendChild(li);
        });
    });
}
// Trae los pesonajes de un episodio
if (tipo === "episode") {
    const contenedor = document.getElementById("detalle-extra");
    contenedor.innerHTML = "<p class='font-semibold'>Personajes:</p><ul class='list-disc list-inside'></ul>";

    const ul = contenedor.querySelector("ul");

    const promises = item.characters.map(url => fetch(url).then(res => res.json()));
    Promise.all(promises).then(personajes => {
        personajes.forEach(pj => {
            const li = document.createElement("li");
            li.textContent = pj.name;
            ul.appendChild(li);
        });
    });
}

    detalleSection.classList.remove("hidden");
    resultsContainer.classList.add("hidden");
    pagination.classList.add("hidden"); // OCULTA el paginador en pagina detalle
}


// Volver
function volverAInicio() {
    detalleSection.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
    pagination.classList.remove("hidden"); // VUELVE A MOSTRAR el paginador
}


// Obtener personajes por filtros
function obtenerPersonajesFiltrados() {
    let url = "https://rickandmortyapi.com/api/character/?";
    const status = filterStatus.value;
    const gender = filterGender.value;
    const searchText = searchInput.value.trim().toLowerCase();

    // Si hay texto y tiene menos de 3 letras, no hacemos la búsqueda
    if (searchText && searchText.length < 3) {
        mostrarMensajeError("Por favor, escribí al menos 3 letras para buscar.");
        return;
    }

    if (status) url += `status=${status}&`;
    if (gender) url += `gender=${gender}&`;
    if (searchText) url += `name=${searchText}&`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se encontraron resultados.");
            }
            return response.json();
        })
        .then(data => {
            personajesData = data.results || [];
            if (personajesData.length === 0) {
                mostrarMensajeError("😥 No se encontraron resultados.");
            } else {
                currentPage = 1;
                mostrarPagina(currentPage);
            }
        })
        .catch(error => {
            mostrarMensajeError("😥 No se encontraron resultados.");
            console.error("Error al obtener los datos:", error);
        });
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
    const searchText = searchInput.value.trim().toLowerCase();
    let url = "https://rickandmortyapi.com/api/episode/";

    if (searchText) {
        if (searchText.length < 3) {
            mostrarMensajeError("Por favor, escribí al menos 3 letras para buscar.");
            return;
        }
        url += `?name=${searchText}`;
    }

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("No se encontraron resultados.");
            return res.json();
        })
        .then(data => {
            const episodios = data.results || [];
            if (episodios.length === 0) {
                mostrarMensajeError("😥 No se encontraron episodios.");
            } else {
                mostrarEpisodios(episodios);
            }
        })
        .catch(err => {
            mostrarMensajeError("😥 No se encontraron episodios.");
            console.error("Error al obtener episodios:", err);
        });
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

    pagination.classList.add("hidden"); // oculta el paginador cuando se ve episodios
}


// Al cargar la página
fetch("https://rickandmortyapi.com/api/character")
    .then(response => response.json())
    .then(data => {
        personajesData = data.results;
        currentPage = 1;
        mostrarPagina(currentPage);
    })
    .catch(error => console.error("Error al obtener los datos:", error));


// Dispara la acción del botón explorar!
document.getElementById("explorar-btn").addEventListener("click", () => {
    const tipo = filterType.value;

    if (tipo === "character" || tipo === "") {
        obtenerPersonajesFiltrados();
    } else if (tipo === "episode") {
        obtenerEpisodios();
    }
});

    

//elimino mostrar mensaje de error estaba duplicado y mal el nombre



// Modal de error 
function mostrarMensajeError(mensaje) {
    const modal = document.getElementById("modal-error");
    const texto = document.getElementById("modal-error-text");
  
    texto.textContent = mensaje;
    modal.classList.remove("hidden");
  }
  
  // Cierra el modal
  document.getElementById("cerrar-modal").addEventListener("click", () => {
    document.getElementById("modal-error").classList.add("hidden");
  });

