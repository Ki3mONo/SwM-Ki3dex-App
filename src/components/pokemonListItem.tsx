import type { Pokemon } from '@/types/pokemon';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PokemonListItem({ pokemon }: { pokemon: Pokemon }) {
  const router = useRouter();
  const displayName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  const handlePress = () => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  return (
    <TouchableOpacity style={styles.row} onPress={handlePress}>
      <View style={styles.text}>
        <Text style={styles.name}>{displayName}</Text>
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
  name: {
    fontSize: 17,
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
