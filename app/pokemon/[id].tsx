import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import type { Pokemon, PokemonSpecies } from '@/types/pokemon';

const { width } = Dimensions.get('window');

// Pokemon color to hex mapping
const POKEMON_COLORS: Record<string, string> = {
  red: '#FF6B6B',
  blue: '#4DABF7',
  yellow: '#FFD93D',
  green: '#51CF66',
  black: '#495057',
  brown: '#8D6E63',
  purple: '#9775FA',
  gray: '#868E96',
  white: '#F8F9FA',
  pink: '#F783AC',
};

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPokemon = async () => {
      try {
        setLoading(true);
        const data = await fetchPokemonDetail(id);
        setPokemon(data.pokemon);
        setSpecies(data.species);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Pokemon');
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading Pokemon...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !pokemon || !species) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Pokemon not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const pokemonColor = POKEMON_COLORS[species.color.name] || '#6366F1';
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  
  // Get English description
  const englishEntry = species.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  );
  const description = englishEntry?.flavor_text
    .replace(/\f/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || '';

  // Get the best quality image
  const imageUrl = 
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: pokemonColor }]}>
        <SafeAreaView edges={['top']}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.pokemonName}>{displayName}</Text>
            <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(3, '0')}</Text>
            
            <View style={styles.imageContainer}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.pokemonImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.content}>
        <View style={styles.typesContainer}>
          {pokemon.types.map((type, index) => (
            <View key={index} style={[styles.typeChip, { backgroundColor: pokemonColor }]}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>

        {description && (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  header: {
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pokemonId: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  pokemonImage: {
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 300,
    maxHeight: 300,
  },
  imagePlaceholder: {
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 300,
    maxHeight: 300,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 16,
  },
  content: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});
