import React, { useEffect, useState } from 'react'

export default function PokemonStatsChart({ stats = [] }) {
  const [animated, setAnimated] = useState(false)

  // Activamos la animación de barra cuando el componente se monta
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 50)
    return () => clearTimeout(timer)
  }, [stats])

  if (!stats || stats.length === 0) {
    return <div style={{ color: '#aaa', textAlign: 'center' }}>Cargando estadísticas...</div>
  }

  // Mapa de nombres en español y color neón temático para cada estadística
  const translationMap = {
    hp: { label: 'Vida (HP)', color: '#10b981' }, // Verde esmeralda
    attack: { label: 'Ataque', color: '#ef4444' }, // Rojo
    defense: { label: 'Defensa', color: '#3b82f6' }, // Azul
    'special-attack': { label: 'Ataque Especial', color: '#f59e0b' }, // Naranja/Amarillo
    'special-defense': { label: 'Defensa Especial', color: '#6366f1' }, // Indigo
    speed: { label: 'Velocidad', color: '#ec4899' } // Rosa
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16, width: '100%' }}>
      {stats.map((item) => {
        const key = item.stat.name
        const statConfig = translationMap[key] || { label: key, color: '#10b981' }
        const value = item.base_stat
        const maxVal = 150 // Valor máximo de referencia para calcular el %
        const percentage = Math.min((value / maxVal) * 100, 100)

        return (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Texto y valor de la estadística */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>
              <span>{statConfig.label}</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>{value}</span>
            </div>

            {/* Contenedor de la barra (fondo oscuro translúcido estilo cristal) */}
            <div style={{
              width: '100%',
              height: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 6,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              {/* Barra de progreso de neón animada */}
              <div style={{
                width: animated ? `${percentage}%` : '0%',
                height: '100%',
                background: `linear-gradient(90deg, ${statConfig.color}aa, ${statConfig.color})`,
                boxShadow: `0 0 10px ${statConfig.color}88`,
                borderRadius: 6,
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' // Animación de aceleración suave
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
