import {useState, useEffect} from 'react'
import { getPokemonList, getPokemonDetails } from './services/pokeapi';
import './App.css';

function App() {
  const [pokemons, setPokkemons] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadPokemons();
  }, []);

  async function loadPokemons() {
    try {
      setLoading(true)
      setError(null)
      const data = await getPokemonList(20, 0)
      setPokemons(data.results)
    } catch (err) {
      setError('No se pudo cargar la lista')
    } finally {
      setLoading(false)
    }
  }

    async function handleSearch(e) {
    e.preventDefault()
    if (!search) return
    try {
      setLoading(true)
      setError(null)
      const pokemon = await getPokemonDetails(search.toLowerCase().trim())
      setSelected(pokemon)
    } catch (err) {
      setError('Pokémon no encontrado')
    } finally {
      setLoading(false)
    }
  }

  async function handleSelect(name) {
    try {
      setLoading(true)
      setError(null)
      const pokemon = await getPokemonDetails(name)
      setSelected(pokemon)
    } catch (err) {
      setError('No se pudo cargar el detalle')
    } finally {
      setLoading(false)
    }
  }

  return (
    
    <div className="app">
      <header>
        <h1>Pokedex</h1>
        <form onSubmit={handleSearch}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Busca por nombre o ID"
          />
          <button type="submit">Buscar</button>
        </form>
      </header>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Cargando...</div>}

      <main>
        <section className="pokemon-list">
          <h2>Lista de pokémon</h2>
          <div className="cards">
            {pokemons.map((pokemon) => (
              <button
                key={pokemon.name}
                className="card"
                onClick={() => handleSelect(pokemon.name)}
              >
                {pokemon.name}
              </button>
            ))}
          </div>
        </section>

        <section className="pokemon-detail">
          {selected ? (
            <>
              <h2>{selected.name}</h2>
              <img
                src={selected.sprites.front_default}
                alt={selected.name}
              />
              <p>ID: {selected.id}</p>
              <p>Tipos: {selected.types.map((t) => t.type.name).join(', ')}</p>
              <p>
                Altura: {selected.height} | Peso: {selected.weight}
              </p>
            </>
          ) : (
            <p>Selecciona un pokémon o busca por nombre/ID</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App