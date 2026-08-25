import React from 'react'
import { Card } from 'antd'
import { usePokedexStore } from '../services/pokedexStore'
import { Heart, Shield } from 'lucide-react'

export default function PokemonCard({ pokemon, onClick }) {
  // Leemos las listas de favoritos y equipo del store
  const { favorites, team } = usePokedexStore()

  // Comprobamos el estado para este Pokémon
  const isFavorite = favorites.includes(pokemon.name)
  const isInTeam = team.some((p) => p.name === pokemon.name)

  return (
    <div style={{ position: 'relative', width: 200 }}>
      {/* Indicador de Equipo (Escudo) en la esquina superior izquierda */}
      {isInTeam && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 2,
            background: 'rgba(16, 185, 129, 0.9)', // Verde esmeralda
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
          title="En tu Equipo"
        >
          <Shield size={14} color="#fff" fill="#fff" />
        </div>
      )}

      {/* Indicador de Favorito (Corazón) en la esquina superior derecha */}
      {isFavorite && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
            background: 'rgba(239, 68, 68, 0.9)', // Rojo
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
          title="Favorito"
        >
          <Heart size={14} color="#fff" fill="#fff" />
        </div>
      )}

      <Card
        hoverable
        className="glass-panel pokemon-card-glow"
        onClick={() => onClick(pokemon.name)}
        style={{ width: '100%' }}
        cover={
          <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
            <img
              src={pokemon.sprite || ''}
              alt={pokemon.name}
              className="pokemon-card-image"
              style={{ objectFit: 'contain' }}
            />
          </div>
        }
      >
        <div className="pokemon-card-title">{pokemon.name}</div>
      </Card>
    </div>
  )
}
