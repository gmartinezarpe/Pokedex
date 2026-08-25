import React from 'react'
import { Card, Button, Row, Col, Empty, Statistic, Divider } from 'antd'
import { usePokedexStore } from '../services/pokedexStore'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts'

const translationMap = {
    hp: 'Vida',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'At. Esp',
    'special-defense': 'Def. Esp',
    speed: 'Velocidad'
}

export default function ComparePokemon() {
    // Obtenemos los Pokémon en comparación y las acciones del store
    const { compareList, toggleCompare, clearCompare } = usePokedexStore()

    // Si no hay ningún Pokémon seleccionado, mostramos un estado vacío
    if (compareList.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: 40, textAlign: 'center', margin: '20px auto', maxWidth: 800 }}>
                <Empty
                    description={<span style={{ color: '#fff', fontSize: 16 }}>No hay Pokémon seleccionados para comparar.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <p style={{ color: '#aaa', marginTop: 10 }}>Haz clic en un Pokémon en la Pokédex y presiona "VS" en el modal</p>
            </div>
        )
    }

    const [pk1, pk2] = compareList

    // Preparar datos para el gráfico de radar comparativo
    const statsList = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']

    // Transformamos los stats de la PokeAPI al formato que requiere Recharts:
    // [{ subject: 'Vida', 'pikachu': 35, 'charizard': 78, fullMark: 150 }, ...]
    const radarData = statsList.map((statName) => {
        const dataPoint = {
            subject: translationMap[statName] || statName,
            fullMark: 150
        }
        if (pk1) {
            dataPoint[pk1.name] = pk1.stats.find(s => s.stat.name === statName)?.base_stat || 0
        }
        if (pk2) {
            dataPoint[pk2.name] = pk2.stats.find(s => s.stat.name === statName)?.base_stat || 0
        }
        return dataPoint
    })

    return (
        <div className="glass-panel" style={{ padding: 24, margin: '20px auto', maxWidth: 1000 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ color: '#ffd400', margin: 0, fontSize: 18, fontWeight: 700 }}>
                    ⚔️ COMPARADOR VS ({compareList.length}/2)
                </h3>
                <Button danger onClick={clearCompare}>Limpiar Comparación</Button>
            </div>

            <Row gutter={[24, 24]} align="middle">
                {/* Pokémon 1 */}
                <Col xs={24} md={pk2 ? 8 : 12}>
                    <Card
                        className="glass-panel"
                        style={{ height: '100%', borderColor: 'rgba(255, 77, 79, 0.3)' }}
                        bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}
                    >
                        <Button
                            type="text"
                            style={{ position: 'absolute', top: 12, right: 12, color: '#ef4444', fontWeight: 'bold' }}
                            onClick={() => toggleCompare(pk1)}
                        >
                            ✕
                        </Button>
                        <img
                            src={pk1.sprites?.other?.['official-artwork']?.front_default}
                            alt={pk1.name}
                            style={{ width: 120, height: 120, objectFit: 'contain' }}
                        />
                        <h4 style={{ color: '#fff', textTransform: 'capitalize', fontSize: 20, marginTop: 12 }}>{pk1.name}</h4>
                        <div style={{ display: 'flex', gap: 6, margin: '8px 0' }}>
                            {pk1.types.map((t) => (
                                <span
                                    key={t.type.name}
                                    style={{
                                        padding: '2px 8px',
                                        borderRadius: 12,
                                        fontSize: 11,
                                        background: 'rgba(255,255,255,0.1)',
                                        textTransform: 'uppercase',
                                        color: '#fff'
                                    }}
                                >
                                    {t.type.name}
                                </span>
                            ))}
                        </div>
                        <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '12px 0' }} />
                        <Row style={{ width: '100%' }} justify="space-around">
                            <Statistic title={<span style={{ color: '#aaa', fontSize: 12 }}>Altura</span>} value={pk1.height / 10} suffix="m" valueStyle={{ color: '#fff', fontSize: 16 }} />
                            <Statistic title={<span style={{ color: '#aaa', fontSize: 12 }}>Peso</span>} value={pk1.weight / 10} suffix="kg" valueStyle={{ color: '#fff', fontSize: 16 }} />
                        </Row>
                    </Card>
                </Col>

                {/* Gráfico de Radar comparativo en el centro (solo si hay 2 Pokémon) */}
                {pk2 && (
                    <Col xs={24} md={8} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ color: '#aaa', fontSize: 12, marginBottom: 8, fontWeight: 600 }}>ATRIBUTOS FRENTE A FRENTE</span>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#e0e0e0', fontSize: 11 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: '#666' }} />
                                    {/* Radar para Pokémon 1 */}
                                    <Radar
                                        name={pk1.name.toUpperCase()}
                                        dataKey={pk1.name}
                                        stroke="#ff4d4f"
                                        fill="#ff4d4f"
                                        fillOpacity={0.25}
                                    />
                                    {/* Radar para Pokémon 2 */}
                                    <Radar
                                        name={pk2.name.toUpperCase()}
                                        dataKey={pk2.name}
                                        stroke="#1890ff"
                                        fill="#1890ff"
                                        fillOpacity={0.25}
                                    />
                                    <Legend wrapperStyle={{ color: '#fff', fontSize: 10, paddingTop: 10 }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </Col>
                )}

                {/* Pokémon 2 o ranura vacía */}
                <Col xs={24} md={pk2 ? 8 : 12}>
                    {pk2 ? (
                        <Card
                            className="glass-panel"
                            style={{ height: '100%', borderColor: 'rgba(24, 144, 255, 0.3)' }}
                            bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}
                        >
                            <Button
                                type="text"
                                style={{ position: 'absolute', top: 12, right: 12, color: '#ef4444', fontWeight: 'bold' }}
                                onClick={() => toggleCompare(pk2)}
                            >
                                ✕
                            </Button>
                            <img
                                src={pk2.sprites?.other?.['official-artwork']?.front_default}
                                alt={pk2.name}
                                style={{ width: 120, height: 120, objectFit: 'contain' }}
                            />
                            <h4 style={{ color: '#fff', textTransform: 'capitalize', fontSize: 20, marginTop: 12 }}>{pk2.name}</h4>
                            <div style={{ display: 'flex', gap: 6, margin: '8px 0' }}>
                                {pk2.types.map((t) => (
                                    <span
                                        key={t.type.name}
                                        style={{
                                            padding: '2px 8px',
                                            borderRadius: 12,
                                            fontSize: 11,
                                            background: 'rgba(255,255,255,0.1)',
                                            textTransform: 'uppercase',
                                            color: '#fff'
                                        }}
                                    >
                                        {t.type.name}
                                    </span>
                                ))}
                            </div>
                            <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '12px 0' }} />
                            <Row style={{ width: '100%' }} justify="space-around">
                                <Statistic title={<span style={{ color: '#aaa', fontSize: 12 }}>Altura</span>} value={pk2.height / 10} suffix="m" valueStyle={{ color: '#fff', fontSize: 16 }} />
                                <Statistic title={<span style={{ color: '#aaa', fontSize: 12 }}>Peso</span>} value={pk2.weight / 10} suffix="kg" valueStyle={{ color: '#fff', fontSize: 16 }} />
                            </Row>
                        </Card>
                    ) : (
                        <div
                            style={{
                                height: 250,
                                border: '2px dashed rgba(255,255,255,0.15)',
                                borderRadius: 20,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.01)',
                                padding: 20,
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ fontSize: 32, opacity: 0.3 }}>⚔️</div>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 8 }}>
                                Selecciona otro Pokémon para comparar estadísticas.
                            </span>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    )
}
