import React from 'react'
import { usePokedexStore } from '../services/pokedexStore'
import { message } from 'antd'


const TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

// Mapa de debilidades, resistencias e inmunidades defensivas de cada tipo
const TYPE_EFFECTIVENESS = {
  normal: { weak: ['fighting'], resist: [], immune: ['ghost'] },
  fire: { weak: ['water', 'ground', 'rock'], resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immune: [] },
  water: { weak: ['electric', 'grass'], resist: ['fire', 'water', 'ice', 'steel'], immune: [] },
  electric: { weak: ['ground'], resist: ['electric', 'flying', 'steel'], immune: [] },
  grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resist: ['water', 'grass', 'electric', 'ground'], immune: [] },
  ice: { weak: ['fire', 'fighting', 'rock', 'steel'], resist: ['ice'], immune: [] },
  fighting: { weak: ['flying', 'psychic', 'fairy'], resist: ['bug', 'rock', 'dark'], immune: [] },
  poison: { weak: ['ground', 'psychic'], resist: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immune: [] },
  ground: { weak: ['water', 'grass', 'ice'], resist: ['poison', 'rock'], immune: ['electric'] },
  flying: { weak: ['electric', 'ice', 'rock'], resist: ['grass', 'fighting', 'bug'], immune: ['ground'] },
  psychic: { weak: ['bug', 'ghost', 'dark'], resist: ['fighting', 'psychic'], immune: [] },
  bug: { weak: ['fire', 'flying', 'rock'], resist: ['grass', 'fighting', 'ground'], immune: [] },
  rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], resist: ['normal', 'fire', 'poison', 'flying'], immune: [] },
  ghost: { weak: ['ghost', 'dark'], resist: ['poison', 'bug'], immune: ['normal', 'fighting'] },
  dragon: { weak: ['ice', 'dragon', 'fairy'], resist: ['fire', 'water', 'grass', 'electric'], immune: [] },
  dark: { weak: ['fighting', 'bug', 'fairy'], resist: ['ghost', 'dark'], immune: ['psychic'] },
  steel: { weak: ['fire', 'fighting', 'ground'], resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immune: ['poison'] },
  fairy: { weak: ['poison', 'steel'], resist: ['fighting', 'bug', 'dark'], immune: ['dragon'] }
}


export default function TeamBuilder() {
  const { team, removeFromTeam } = usePokedexStore()

  // Forzamos un arreglo de exactamente 6 slots (rellenando con null los vacíos)
  const slots = Array.from({ length: 6 }, (_, i) => team[i] || null)

  // Lógica para calcular las debilidades y fortalezas del equipo actual
  const getTeamDefenses = () => {
    const defenses = {}

    // Inicializar cada uno de los 18 tipos en 0 debilidades/resistencias/inmunidades
    TYPES.forEach((type) => {
      defenses[type] = { weak: 0, resist: 0, immune: 0 }
    })

    // Calcular la resistencia de cada Pokémon del equipo frente a cada tipo atacante
    team.forEach((poke) => {
      const pokeTypes = poke.types.map(t => t.type.name)

      TYPES.forEach((attType) => {
        let multiplier = 1.0

        // Multiplicar las efectividades si el Pokémon tiene doble tipo
        pokeTypes.forEach((defType) => {
          const profile = TYPE_EFFECTIVENESS[defType]
          if (profile) {
            if (profile.weak.includes(attType)) multiplier *= 2.0
            if (profile.resist.includes(attType)) multiplier *= 0.5
            if (profile.immune.includes(attType)) multiplier *= 0.0
          }
        })

        // Clasificar el daño final recibido por este Pokémon
        if (multiplier > 1.0) {
          defenses[attType].weak++
        } else if (multiplier === 0.0) {
          defenses[attType].immune++
        } else if (multiplier < 1.0) {
          defenses[attType].resist++
        }
      })
    })

    return defenses
  }

  const teamDefenses = getTeamDefenses()


  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ color: '#ffd400', margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '0.5px' }}>
          🛡️ MI EQUIPO POKÉMON ({team.length}/6)
        </h3>
        {team.length === 6 && (
          <span style={{ color: '#10b981', fontSize: 13, fontWeight: 600, animation: 'pulse 2s infinite' }}>
            ¡Equipo Completo para Batalla! ⚔️
          </span>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 16
      }}>
        {slots.map((pokemon, index) => {
          if (pokemon) {
            return (
              <div
                key={pokemon.name}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: 10,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.2s',
                }}
              >
                {/* Botón X para eliminar del equipo */}
                <button
                  onClick={() => {
                    removeFromTeam(pokemon.name)
                    message.info(`${pokemon.name.toUpperCase()} fue liberado del equipo.`)
                  }}
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 10,
                    fontWeight: 'bold',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.4)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                >
                  ✕
                </button>

                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                  alt={pokemon.name}
                  style={{ width: 64, height: 64 }}
                />
                <span style={{
                  textTransform: 'capitalize',
                  fontSize: 13,
                  fontWeight: 700,
                  marginTop: 6,
                  color: '#fff',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%'
                }}>
                  {pokemon.name}
                </span>
              </div>
            )
          }

          {/* Slot vacío */ }
          return (
            <div
              key={`empty-${index}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 108,
                border: '2px dashed rgba(255, 255, 255, 0.12)',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.01)',
                color: 'rgba(255, 255, 255, 0.2)'
              }}
            >
              <div style={{ fontSize: 22, opacity: 0.3 }}>🔴</div>
              <span style={{ fontSize: 11, fontWeight: 500, marginTop: 4 }}>Vacío</span>
            </div>
          )
        })}
      </div>

      {team.length > 0 && (
        <div style={{ marginTop: 24, borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 16 }}>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 12, fontWeight: 600 }}>
            🛡️ ANÁLISIS DE COBERTURA DE TIPOS (DEBILIDADES Y FORTALEZAS)
          </h4>
          <p style={{ color: '#aaa', fontSize: 12, marginBottom: 16 }}>
            Muestra cuántos Pokémon en tu equipo son débiles (rojo) o resistentes/inmunes (verde) ante ataques de cada tipo.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 10
          }}>
            {TYPES.map((type) => {
              const { weak, resist, immune } = teamDefenses[type]
              const totalResist = resist + immune

              // Definir colores o bordes si hay un desbalance crítico (por ejemplo, 3 o más debilidades y 0 resistencias)
              const isCriticallyWeak = weak >= 3 && totalResist === 0

              return (
                <div
                  key={type}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: isCriticallyWeak ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isCriticallyWeak ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 8,
                    padding: '8px 4px',
                    transition: 'transform 0.2s'
                  }}
                >
                  {/* Etiqueta del tipo */}
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: `var(--type-color-${type}, #fff)`, // Usará los colores de tu index.css
                    marginBottom: 6
                  }}>
                    {type}
                  </span>

                  {/* Badges de debilidad / resistencia */}
                  <div style={{ display: 'flex', gap: 6, fontSize: 11, fontWeight: 700 }}>
                    {weak > 0 && (
                      <span style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)', padding: '1px 5px', borderRadius: 4 }}>
                        -{weak}
                      </span>
                    )}
                    {totalResist > 0 && (
                      <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '1px 5px', borderRadius: 4 }}>
                        +{totalResist}
                      </span>
                    )}
                    {weak === 0 && totalResist === 0 && (
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>-</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
