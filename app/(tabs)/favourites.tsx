import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFavorite } from '@/hooks/useFavorite';
import PokemonDetail from '@/components/pokemonDetail';
import { useRouter } from 'expo-router';

export default function FavouritesScreen() {
  const { favoriteId } = useFavorite();
  const router = useRouter();
  const firstRender = useRef(true);

  useEffect(() => {
    if (!favoriteId && !firstRender.current) {
      router.replace('/(tabs)/list');
    }
    firstRender.current = false;
  }, [favoriteId]);

  if (!favoriteId) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          You don’t have any favorite Pokémon.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PokemonDetail id={favoriteId} showBackButton={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emptyText: { fontSize: 16, color: '#6B7280' },
});
