import { FavoriteStorage } from '@/services/favoriteStorage';
import type { Pokemon } from '@/types/pokemon';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function PokemonListItem({ pokemon }: { pokemon: Pokemon }) {
  const router = useRouter();
  const displayName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  const [isFav, setIsFav] = useState(false);

  useFocusEffect(
    useCallback(() => {
      FavoriteStorage.isFavorite(pokemon.id.toString()).then(setIsFav);
    }, [pokemon.id])
  );

  const handlePress = () => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between p-3 border-b border-gray-200"
      onPress={handlePress}
    >
      <View className="flex-1 pr-3">
        <View className="flex-row items-center">
          <Text className="text-lg font-semibold">{displayName}</Text>
          {isFav && (
            <>
              <Ionicons
                name="heart"
                size={16}
                color="red"
                className="ml-1"
              />
              <Text className="ml-1 text-red-500 text-xs font-semibold">
                favorite
              </Text>
            </>
          )}
        </View>
        <Text className="mt-1 text-gray-500">{pokemon.types.join(', ')}</Text>
      </View>
      {pokemon.sprites.front_default ? (
        <Image
          source={{ uri: pokemon.sprites.front_default }}
          className="w-12 h-12"
          style={{ resizeMode: 'contain' }}
        />
      ) : (
        <View className="w-12 h-12 bg-gray-200 rounded-full" />
      )}
    </TouchableOpacity>
  );
}