import React from 'react'
import { Modal, Descriptions, Image } from 'antd'

export default function PokemonModal({ pokemon, onClose }) {
  if (!pokemon) return null

  return (
    <Modal
      open={!!pokemon}
      title={pokemon.name?.toUpperCase()}
      onCancel={onClose}
      footer={null}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Image src={pokemon.sprites?.front_default} alt={pokemon.name} width={120} />
        <Descriptions column={1} size="small">
          <Descriptions.Item label="ID">{pokemon.id}</Descriptions.Item>
          <Descriptions.Item label="Tipos">{pokemon.types.map((t) => t.type.name).join(', ')}</Descriptions.Item>
          <Descriptions.Item label="Altura">{pokemon.height}</Descriptions.Item>
          <Descriptions.Item label="Peso">{pokemon.weight}</Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  )
}