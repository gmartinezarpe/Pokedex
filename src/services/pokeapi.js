import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});

export async function getPokemonList(limit = 20, offset = 0) {
  const response = await api.get('/pokemon', {
    params: {
      limit,
      offset
    }
  });
  return response.data;
}

export async function getPokemonDetails(nameOrId) {
  const response = await api.get(`/pokemon/${nameOrId}`);
  return response.data;
}

// Obtener detalles de la especie (contiene la URL de la cadena de evolución y textos descriptivos)
export async function getPokemonSpecies(nameOrId) {
  const response = await api.get(`/pokemon-species/${nameOrId}`);
  return response.data;
}
// Obtener la cadena de evolución completa a partir de su URL específica
export async function getEvolutionChain(url) {
  const response = await axios.get(url);
  return response.data;
}