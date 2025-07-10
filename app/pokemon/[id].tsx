import PokemonDetail from '@/components/PokemonDetail'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <PokemonDetail id={id!} />
}
