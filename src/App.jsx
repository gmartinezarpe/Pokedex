import React, { useState, useEffect } from 'react'
import { usePokedexStore } from './services/pokedexStore'
import { getPokemonList, getPokemonDetails } from './services/pokeapi'
import PokemonCard from './components/PokemonCard'
import PokemonModal from './components/PokemonModal'
import TeamBuilder from './components/TeamBuilder'
import ComparePokemon from './components/ComparePokemon'
import { Layout, Input, Button, Tabs, Badge } from 'antd'
import { useQuery } from '@tanstack/react-query'
import 'antd/dist/reset.css'
import './App.css'


function App() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [searchError, setSearchError] = useState(null) // Para errores de búsqueda
  const [searchLoading, setSearchLoading] = useState(false) // Para loading de búsqueda
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const { team, compareList, activeType, setActiveType } = usePokedexStore()


  const { data: pokemonData, isLoading: isListLoading, error: listError } = useQuery({
    queryKey: ['pokemons', page],
    queryFn: async () => {
      const offset = (page - 1) * limit
      const data = await getPokemonList(limit, offset)
      const mapped = data.results.map((r) => {
        const parts = r.url.split('/').filter(Boolean)
        const id = parts[parts.length - 1]
        return {
          name: r.name,
          url: r.url,
          id,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        }
      })
      return {
        results: mapped,
        count: data.count,
      }
    },
    placeholderData: (prev) => prev, // Mantiene los datos anteriores mientras carga la nueva página (evita parpadeos)
  })




  function handlePageChange(newPage) {
    if (newPage < 1) return
    setPage(newPage)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeType)
  }, [activeType])

  async function handleSearch(e) {
    e.preventDefault()
    if (!search) return
    try {
      setSearchLoading(true)
      setSearchError(null)
      const pokemon = await getPokemonDetails(search.toLowerCase().trim())
      setSelected(pokemon)
      setActiveType(pokemon.types[0]?.type?.name)
    } catch (err) {
      setSearchError('Pokémon no encontrado')
    } finally {
      setSearchLoading(false)
    }
  }


  const filteredPokemons = search
    ? (pokemonData?.results || []).filter((p) => p.name.includes(search.toLowerCase().trim()))
    : (pokemonData?.results || [])

  async function handleSelect(name) {
    try {
      setSearchLoading(true)
      setSearchError(null)
      const pokemon = await getPokemonDetails(name)
      setSelected(pokemon)
      setActiveType(pokemon.types[0]?.type?.name)
    } catch (err) {
      setSearchError('No se pudo cargar el detalle')
    } finally {
      setSearchLoading(false)
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

          {searchError && <div className="error">{searchError}</div>}
          {isListLoading && <div className="loading">Cargando...</div>}

          <main>
            <Tabs
              defaultActiveKey="pokedex"
              style={{ color: '#fff' }}
              items={[
                {
                  key: 'pokedex',
                  label: '📖 Pokédex',
                  children: (
                    <section className="pokemon-list">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ color: '#fff' }}>Lista de Pokémon</h2>
                        <div className="pagination">
                          <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Anterior</Button>
                          <span style={{ color: '#fff', margin: '0 12px' }}>Página {page}</span>
                          <Button onClick={() => handlePageChange(page + 1)} disabled={page * limit >= (pokemonData?.count || 0)}>Siguiente</Button>
                        </div>
                      </div>
                      {filteredPokemons.length === 0 && !isListLoading ? (
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
                  )
                },
                {
                  key: 'team',
                  label: (
                    <Badge count={team.length} size="small" color="#10b981" offset={[8, 0]}>
                      🛡️ Mi Equipo
                    </Badge>
                  ),
                  children: <TeamBuilder />
                },
                {
                  key: 'compare',
                  label: (
                    <Badge count={compareList.length} size="small" color="#1890ff" offset={[8, 0]}>
                      ⚔️ VS
                    </Badge>
                  ),
                  children: <ComparePokemon />
                }
              ]}
            />

            <PokemonModal
              pokemon={selected}
              onClose={() => {
                setSelected(null)
                setActiveType('normal')
              }}
            />
          </main>

        </div>
      </Layout.Content>
    </Layout>
  )
}

export default App