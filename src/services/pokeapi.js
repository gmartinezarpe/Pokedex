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