import React from 'react'
import { Card } from 'antd'

export default function PokemonCard({ pokemon, onClick }) {
  return (
    <Card
      hoverable
      className="glass-panel pokemon-card-glow"
      onClick={() => onClick(pokemon.name)}
      cover={
        <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
          <img
            src={pokemon.sprite || ''}
            alt={pokemon.name}
            className="pokemon-card-image"
          />
        </div>
      }
    >
      <div className="pokemon-card-title">{pokemon.name}</div>
    </Card>

  )
}
