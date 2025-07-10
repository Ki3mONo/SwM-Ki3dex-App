import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import ChangeFavoriteModal, { PokemonInfo } from '@/components/ChangeFavouriteModal'
import PokemonBottomSheet from '@/components/PokemonBottomSheet'
import { useFavorite } from '@/hooks/useFavorite'
import { fetchPokemonDetail } from '@/services/pokeapi'
import type { Pokemon, PokemonSpecies } from '@/types/pokemon'

const { width } = Dimensions.get('window')

const POKEMON_COLORS: Record<string, string> = {
  red: '#FF6B6B',
  blue: '#4DABF7',
  yellow: '#FFD93D',
  green: '#51CF66',
  black: '#495057',
  brown: '#8D6E63',
  purple: '#9775FA',
  gray: '#868E96',
  white: '#DAE0E5',
  pink: '#F783AC',
}
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

interface Props {
  id: string
  showBackButton?: boolean
}

export default function PokemonDetail({ id, showBackButton = true }: Props) {
  const router = useRouter()
  const { favoriteId, setFavorite, removeFavorite } = useFavorite()

  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [species, setSpecies] = useState<PokemonSpecies | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [existingFav, setExistingFav] = useState<PokemonInfo | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmRemoveVisible, setConfirmRemoveVisible] = useState(false)

  const isFav = favoriteId === id
  const animatedPosition = useSharedValue(0)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const { pokemon: p, species: s } = await fetchPokemonDetail(id)
        setPokemon(p)
        setSpecies(s)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Pokémon')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  useEffect(() => {
    if (favoriteId && favoriteId !== id) {
      ;(async () => {
        const { pokemon: p } = await fetchPokemonDetail(favoriteId)
        const sprite =
          p.sprites.other?.['official-artwork']?.front_default || p.sprites.front_default!
        setExistingFav({
          id: favoriteId,
          name: capitalize(p.name),
          imageUrl: sprite,
        })
      })()
    } else {
      setExistingFav(null)
    }
  }, [favoriteId, id])

  const handlePressFav = () => {
    if (!favoriteId) {
      setFavorite(id)
    } else if (isFav) {
      setConfirmRemoveVisible(true)
    } else {
      setModalVisible(true)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
      </SafeAreaView>
    )
  }
  if (error || !pokemon || !species) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{error || 'Pokémon not found'}</Text>
      </SafeAreaView>
    )
  }

  const color = POKEMON_COLORS[species.color.name] || '#6366F1'
  const displayName = capitalize(pokemon.name)
  const imageUrl =
    pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default!
  const englishEntry = species.flavor_text_entries.find(e => e.language.name === 'en')
  const description = englishEntry ? englishEntry.flavor_text.replace(/\s+/g, ' ').trim() : ''

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: color }]}>
        {showBackButton && (
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.like} onPress={handlePressFav}>
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={24}
            color={isFav ? 'red' : 'white'}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
      </SafeAreaView>

      <PokemonBottomSheet
        types={pokemon.types.map(capitalize)}
        description={description}
        color={color}
        height={pokemon.height}
        weight={pokemon.weight}
        animatedPosition={animatedPosition}
      />

      {existingFav && (
        <ChangeFavoriteModal
          visible={modalVisible}
          existingPokemon={existingFav}
          newPokemon={{ id, name: displayName, imageUrl }}
          onCancel={() => setModalVisible(false)}
          onSelect={sel => {
            setModalVisible(false)
            if (sel === id) setFavorite(id)
          }}
        />
      )}

      {confirmRemoveVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Remove Favorite</Text>
            <Text style={styles.modalText}>
              Are you sure you want to remove your favorite Pokémon?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setConfirmRemoveVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={async () => {
                  await removeFavorite()
                  setConfirmRemoveVisible(false)
                }}>
                <Text style={styles.confirmText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorText: { fontSize: 16, color: '#EF4444' },
  back: { position: 'absolute', top: 40, left: 20 },
  like: { position: 'absolute', top: 40, right: 20 },
  headerContent: { alignItems: 'center', marginTop: 20 },
  name: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  id: { fontSize: 18, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  image: { width: width * 0.6, height: width * 0.6, marginTop: 16 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#111827' },
  modalText: { fontSize: 16, textAlign: 'center', color: '#374151', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: { backgroundColor: '#E5E7EB' },
  confirmButton: { backgroundColor: '#EF4444' },
  cancelText: { color: '#1F2937', fontWeight: 'bold' },
  confirmText: { color: 'white', fontWeight: 'bold' },
})
