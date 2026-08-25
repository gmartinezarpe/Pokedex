import React from 'react'
import { Modal, Descriptions, Image, Button, message, Space } from 'antd'
import PokemonStatsChart from './PokemonStatsChart'
import { usePokedexStore } from '../services/pokedexStore'
import { Heart, ShieldCheck, ShieldAlert, BarChart3 } from 'lucide-react'

export default function PokemonModal({ pokemon, onClose }) {
  if (!pokemon) return null

  // Conectamos con el estado de Zustand
  const {
    favorites,
    toggleFavorite,
    team,
    addToTeam,
    removeFromTeam,
    compareList,
    toggleCompare
  } = usePokedexStore()

  // Verificamos el estado de este Pokémon en particular
  const isFavorite = favorites.includes(pokemon.name)
  const isInTeam = team.some((p) => p.name === pokemon.name)
  const isInCompare = compareList.some((p) => p.name === pokemon.name)

  // Manejo de la acción de añadir al equipo
  const handleTeamAction = () => {
    if (isInTeam) {
      removeFromTeam(pokemon.name)
      message.info(`${pokemon.name.toUpperCase()} fue removido del equipo.`)
    } else {
      const result = addToTeam(pokemon)
      if (result.error) {
        // Muestra alerta si el equipo ya tiene 6 integrantes
        message.warning(result.error)
      } else {
        message.success(`${pokemon.name.toUpperCase()} se unió a tu equipo.`)
      }
    }
  }

  // Manejo de la acción del comparador
  const handleCompareAction = () => {
    toggleCompare(pokemon)
    if (isInCompare) {
      message.info(`${pokemon.name.toUpperCase()} quitado del comparador.`)
    } else {
      if (compareList.length >= 2) {
        message.info(`Reemplazado en el comparador. Listo para VS.`)
      } else {
        message.success(`${pokemon.name.toUpperCase()} listo para comparar.`)
      }
    }
  }

  return (
    <Modal
      open={!!pokemon}
      title={pokemon.name?.toUpperCase()}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      bodyStyle={{ paddingBottom: 10 }}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <Image
          src={pokemon.sprites?.other?.['official-artwork']?.front_default}
          alt={pokemon.name}
          width={160}
          fallback="https://via.placeholder.com/160?text=No+Image"
        />
        <div style={{ flex: 1 }}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID">#{pokemon.id}</Descriptions.Item>
            <Descriptions.Item label="Tipos">
              <Space size={4}>
                {pokemon.types.map((t) => (
                  <span
                    key={t.type.name}
                    className="type-tag"
                    style={{
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 700,
                      background: 'rgba(255, 255, 255, 0.08)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {t.type.name}
                  </span>
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Altura">{(pokemon.height / 10)} m</Descriptions.Item>
            <Descriptions.Item label="Peso">{(pokemon.weight / 10)} kg</Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      {/* Botonera de Acciones Rápidas */}
      <div style={{
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        marginBottom: 20,
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '12px 8px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* Favorito */}
        <Button
          type={isFavorite ? "primary" : "default"}
          danger={isFavorite}
          icon={<Heart size={16} fill={isFavorite ? "#fff" : "transparent"} />}
          onClick={() => toggleFavorite(pokemon.name)}
        >
          {isFavorite ? 'Favorito' : 'Añadir'}
        </Button>

        {/* Equipo */}
        <Button
          type={isInTeam ? "dashed" : "primary"}
          danger={isInTeam}
          icon={isInTeam ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
          onClick={handleTeamAction}
        >
          {isInTeam ? 'Quitar Equipo' : 'Al Equipo'}
        </Button>

        {/* Comparador */}
        <Button
          type={isInCompare ? "primary" : "default"}
          icon={<BarChart3 size={16} />}
          onClick={handleCompareAction}
        >
          {isInCompare ? 'Comparando' : 'VS'}
        </Button>
      </div>

      <h3 style={{ marginTop: 12, marginBottom: 4, textAlign: 'center', color: '#fff' }}>Estadísticas Base</h3>
      <PokemonStatsChart stats={pokemon.stats} />
    </Modal>
  )
}
