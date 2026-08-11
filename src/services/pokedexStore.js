import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePokedexStore = create(
    persist(
        (set, get) => ({
            favorites: [],
            team: [],
            compareList: [],
            activeType: 'normal', // Tema dinámico de fondo basado en el Pokémon activo

            // Agregar o quitar de favoritos
            toggleFavorite: (pokemonName) => {
                const { favorites } = get()
                if (favorites.includes(pokemonName)) {
                    set({ favorites: favorites.filter((name) => name !== pokemonName) })
                } else {
                    set({ favorites: [...favorites, pokemonName] })
                }
            },

            // Agregar al equipo de 6 (máx 6)
            addToTeam: (pokemon) => {
                const { team } = get()
                if (team.length >= 6) {
                    return { error: '¡Tu equipo está lleno! (Máximo 6 Pokémon)' }
                }
                if (team.some((p) => p.name === pokemon.name)) {
                    return { error: 'Este Pokémon ya está en tu equipo.' }
                }
                set({ team: [...team, pokemon] })
                return { success: true }
            },

            // Quitar del equipo
            removeFromTeam: (pokemonName) => {
                const { team } = get()
                set({ team: team.filter((p) => p.name !== pokemonName) })
            },

            // Agregar o quitar del comparador (máx 2)
            toggleCompare: (pokemon) => {
                const { compareList } = get()
                const exists = compareList.some((p) => p.name === pokemon.name)
                if (exists) {
                    set({ compareList: compareList.filter((p) => p.name !== pokemon.name) })
                } else {
                    if (compareList.length >= 2) {
                        // Si ya hay 2, reemplaza el último
                        set({ compareList: [compareList[1], pokemon] })
                    } else {
                        set({ compareList: [...compareList, pokemon] })
                    }
                }
            },

            clearCompare: () => set({ compareList: [] }),

            // Cambiar el color/tipo activo de la interfaz
            setActiveType: (type) => set({ activeType: type || 'normal' }),
        }),
        {
            name: 'pokedex-storage', // Nombre de la clave en LocalStorage
            partialize: (state) => ({
                favorites: state.favorites,
                team: state.team,
            }), // Solo persistimos favoritos y equipo
        }
    )
)
