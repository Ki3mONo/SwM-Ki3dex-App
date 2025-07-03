import React, { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FavoriteStorage } from '@/services/favoriteStorage';
import type { Pokemon } from '@/types/pokemon';

export default function PokemonListItem({ pokemon }: { pokemon: Pokemon }) {
  const router = useRouter();
  const displayName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  const [isFav, setIsFav] = useState(false);

  // Re-check favorite status whenever this route/screen is focused
  useFocusEffect(
    useCallback(() => {
      FavoriteStorage.isFavorite(pokemon.id.toString()).then(setIsFav);
    }, [pokemon.id])
  );

  const handlePress = () => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  return (
    <TouchableOpacity style={styles.row} onPress={handlePress}>
      <View style={styles.text}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{displayName}</Text>
          {isFav && (
            <>
              <Ionicons
                name="heart"
                size={16}
                color="red"
                style={styles.heart}
              />
              <Text style={styles.favText}>favorite</Text>
            </>
          )}
        </View>
        <Text style={styles.types}>{pokemon.types.join(', ')}</Text>
      </View>
      {pokemon.sprites.front_default ? (
        <Image
          source={{ uri: pokemon.sprites.front_default }}
          style={styles.image}
        />
      ) : (
        <View style={styles.placeholder} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  text: {
    flex: 1,
    paddingRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  heart: {
    marginLeft: 4,
  },
  favText: {
    marginLeft: 4,
    color: 'red',
    fontSize: 12,
    fontWeight: '600',
  },
  types: {
    marginTop: 4,
    color: '#6B7280',
  },
  image: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  placeholder: {
    width: 48,
    height: 48,
    backgroundColor: '#E5E7EB',
    borderRadius: 24,
  },
});