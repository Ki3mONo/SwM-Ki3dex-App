import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchPokemonDetail } from '@/services/pokeapi';
import { useFavorite } from '@/hooks/useFavorite';
import type { Pokemon, PokemonSpecies } from '@/types/pokemon';
import ChangeFavoriteModal, { PokemonInfo } from '@/components/changeFavouriteModal';

const { width } = Dimensions.get('window');

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
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface Props {
  id: string;
  showBackButton?: boolean;
}

export default function PokemonDetail({ id, showBackButton = true }: Props) {
  const router = useRouter();
  const { favoriteId, setFavorite, removeFavorite } = useFavorite();

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [existingFav, setExistingFav] = useState<PokemonInfo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmRemoveVisible, setConfirmRemoveVisible] = useState(false);

  const isFav = favoriteId === id;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { pokemon: p, species: s } = await fetchPokemonDetail(id);
        setPokemon(p);
        setSpecies(s);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Pokémon');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (favoriteId && favoriteId !== id) {
      (async () => {
        const { pokemon: p } = await fetchPokemonDetail(favoriteId);
        const sprite =
          p.sprites.other?.['official-artwork']?.front_default ||
          p.sprites.front_default;
        setExistingFav({
          id: favoriteId,
          name: capitalize(p.name),
          imageUrl: sprite!,
        });
      })();
    } else {
      setExistingFav(null);
    }
  }, [favoriteId, id]);

  const handlePressFav = () => {
    if (!favoriteId) {
      setFavorite(id);
    } else if (isFav) {
      setConfirmRemoveVisible(true);
    } else {
      setModalVisible(true);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
      </SafeAreaView>
    );
  }
  if (error || !pokemon || !species) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{error || 'Pokémon not found'}</Text>
      </SafeAreaView>
    );
  }

  const color = POKEMON_COLORS[species.color.name] || '#6366F1';
  const displayName = capitalize(pokemon.name);
  const imageUrl =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default!;
  const englishEntry = species.flavor_text_entries.find(e => e.language.name === 'en');
  const description = englishEntry
    ? englishEntry.flavor_text.replace(/\s+/g, ' ').trim()
    : '';

  return (
    <>
      <ScrollView style={styles.container}>
        <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: color }]}>
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

        <View style={styles.content}>
          <View style={styles.typesContainer}>
            {pokemon.types.map((t, i) => (
              <View key={i} style={[styles.typeChip, { backgroundColor: color }]}>
                <Text style={styles.typeText}>{t}</Text>
              </View>
            ))}
          </View>

          {description.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Height</Text>
                <Text style={styles.statValue}>
                  {pokemon.height ? `${(pokemon.height / 10).toFixed(1)}m` : 'Unknown'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Weight</Text>
                <Text style={styles.statValue}>
                  {pokemon.weight ? `${(pokemon.weight / 10).toFixed(1)}kg` : 'Unknown'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {existingFav && (
        <ChangeFavoriteModal
          visible={modalVisible}
          existingPokemon={existingFav}
          newPokemon={{ id, name: displayName, imageUrl }}
          onCancel={() => setModalVisible(false)}
          onSelect={(selectedId) => {
            setModalVisible(false);
            if (selectedId === id) {
              setFavorite(id);
            }
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
                onPress={() => setConfirmRemoveVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={async () => {
                  await removeFavorite();
                  setConfirmRemoveVisible(false);
                }}
              >
                <Text style={styles.confirmText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  errorText: { fontSize: 16, color: '#EF4444' },
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingBottom: 40 },
  back: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  like: { position: 'absolute', top: 60, right: 20, zIndex: 10 },
  headerContent: { alignItems: 'center', paddingTop: 60 },
  name: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  id: { fontSize: 18, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  image: { width: width * 0.6, height: width * 0.6, marginTop: 20 },
  content: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  typesContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginHorizontal: 4 },
  typeText: { color: 'white', fontWeight: '600', textTransform: 'capitalize' },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  description: { fontSize: 16, lineHeight: 22, color: '#4B5563' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  statItem: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },

  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#374151',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#EF4444',
  },
  cancelText: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
