document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchBar');
  const searchButton = document.getElementById('submitSearch');
  const clearButton = document.getElementById('clearBtn');
  const resultadosContainer = document.getElementById('resultados');

  let dataCache = null;

  // Cargar datos del JSON una vez
  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      dataCache = data;
    })
    .catch(error => {
      console.error('Error cargando JSON:', error);
    });

  // Función para mostrar resultados
  function mostrarResultados(lista) {
    resultadosContainer.innerHTML = '';

    if (lista.length === 0) {
      resultadosContainer.innerHTML = '<p>No se encontraron resultados.</p>';
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'tb-result-wrapper';

    lista.forEach(item => {
      const card = document.createElement('div');
      card.className = 'tb-result-card';
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}">
        <div class="tb-result-text">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
      `;
      wrapper.appendChild(card);
    });

    resultadosContainer.appendChild(wrapper);
  }

  // Lógica de búsqueda
  searchButton.addEventListener('click', () => {
    const keyword = searchInput.value.toLowerCase().trim();
    if (!keyword || !dataCache) return;

    const resultados = [];

    if (/playa|beach|beaches/i.test(keyword)) {
      resultados.push(...dataCache.beaches);
    } else if (/templo|temple|temples/i.test(keyword)) {
      resultados.push(...dataCache.temples);
    } else {
      dataCache.countries.forEach(country => {
        const countryMatch = country.name.toLowerCase().includes(keyword);
        const matchingCities = country.cities.filter(city =>
          city.name.toLowerCase().includes(keyword)
        );

        if (countryMatch) {
          resultados.push(...country.cities);
        } else if (matchingCities.length > 0) {
          resultados.push(...matchingCities);
        }
      });
    }

    mostrarResultados(resultados);
  });

  // Botón Clear
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    resultadosContainer.innerHTML = '';
  });

}); // <<--- Cierre de DOMContentLoaded
