import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import PokemonDetail from '@/components/pokemonDetail';

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PokemonDetail id={id!} />;
}