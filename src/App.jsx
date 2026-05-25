import React, { useState, useEffect } from 'react'
import { getPokemonList, getPokemonDetails } from './services/pokeapi'
import PokemonCard from './components/PokemonCard'
import PokemonModal from './components/PokemonModal'
import { Layout, Input, Button } from 'antd'
import 'antd/dist/reset.css'
import './App.css'

function App() {
  const [pokemons, setPokemons] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    loadPokemons(1)
  }, [])

  async function loadPokemons(page = 1) {
    try {
      setLoading(true)
      setError(null)
      const offset = (page - 1) * limit
      const data = await getPokemonList(limit, offset)
      // map results to include id and sprite URL
      const mapped = data.results.map((r) => {
        const parts = r.url.split('/').filter(Boolean)
        const id = parts[parts.length - 1]
        return {
          name: r.name,
          url: r.url,
          id,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        }
      })
      setPokemons(mapped)
      setTotalCount(data.count)
    } catch (err) {
      setError('No se pudo cargar la lista')
    } finally {
      setLoading(false)
    }
  }

  function handlePageChange(newPage) {
    if (newPage < 1) return
    setPage(newPage)
    loadPokemons(newPage)
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

  const filteredPokemons = search
    ? pokemons.filter((p) => p.name.includes(search.toLowerCase().trim()))
    : pokemons

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
    <Layout style={{
      minHeight: '100vh', width: '100%',
      background: '#1e66d0',
    }}>
      <Layout.Content style={{ padding: 0 }}>
        <div className="app">
          <header>
            <h1 className="logo">
              <span className="logo-pokemon">POKÉMON</span>
              <span className="logo-dex"> DEX</span>
            </h1>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Input.Search
                placeholder="Busca por nombre o ID"
                enterButton="Buscar"
                size="large"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onSearch={(val) => {
                  setSearch(val)
                  if (val) handleSearch({ preventDefault: () => { } })
                }}
                style={{ width: 420 }}
              />
            </div>
          </header>

          {error && <div className="error">{error}</div>}
          {loading && <div className="loading">Cargando...</div>}

          <main>
            <section className="pokemon-list">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: '#fff' }}>Lista de pokémon</h2>
                <div className="pagination">
                  <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Anterior</Button>
                  <span style={{ color: '#fff', margin: '0 12px' }}>Página {page}</span>
                  <Button onClick={() => handlePageChange(page + 1)} disabled={page * limit >= totalCount}>Siguiente</Button>
                </div>
              </div>

              {filteredPokemons.length === 0 && !loading ? (
                <div style={{ color: '#fff' }}>No hay pokémon que coincidan.</div>
              ) : (
                <div className="cards">
                  {filteredPokemons.map((pokemon) => (
                    <div key={pokemon.name} style={{ display: 'flex', justifyContent: 'center' }}>
                      <PokemonCard pokemon={pokemon} onClick={handleSelect} />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <PokemonModal pokemon={selected} onClose={() => setSelected(null)} />
          </main>
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default App