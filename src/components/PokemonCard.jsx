import React from 'react'
import { Card } from 'antd'

export default function PokemonCard({ pokemon, onClick }) {
  return (
    <Card
      hoverable
      onClick={() => onClick(pokemon.name)}
      cover={
        <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
              <img
                src={pokemon.sprite || ''}
                alt={pokemon.name}
                style={{ width: 120, height: 120, imageRendering: 'pixelated' }}
              />
        </div>
      }
          style={{ borderRadius: 12, minHeight: 220, padding: 12, width: 200, boxSizing: 'border-box' }}
    >
      <div style={{ textAlign: 'center', fontWeight: 700, textTransform: 'capitalize' }}>{pokemon.name}</div>
    </Card>
  )
}
