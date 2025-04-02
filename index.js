// integración de la api

fetch("https://rickandmortyapi.com/api/character")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error al obtener los datos:", error));


// función para mostrar los datos en la web
function mostrarPersonajes(personajes) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Limpiar antes de mostrar nuevos datos

    personajes.forEach(personaje => {
        const div = document.createElement("div");
        div.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "text-black");

        div.innerHTML = `
            <img src="${personaje.image}" alt="${personaje.name}" class="w-full rounded-md">
            <h3 class="text-xl font-bold mt-2">${personaje.name}</h3>
            <p>${personaje.species} - ${personaje.status}</p>
        `;

        resultsContainer.appendChild(div);
    });
}

// Llamar a la API y mostrar personajes al cargar la página
fetch("https://rickandmortyapi.com/api/character")
    .then(response => response.json())
    .then(data => mostrarPersonajes(data.results))
    .catch(error => console.error("Error al obtener los datos:", error));

