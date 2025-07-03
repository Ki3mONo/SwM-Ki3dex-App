import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import type { Pokemon } from '@/types/pokemon';
import { fetchPokemonList } from '@/services/pokeapi';
import PokemonListItem from '@/components/pokemonListItem';

export default function ListScreen() {
  const [data, setData] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = async (url?: string) => {
    setRefreshing(true);
    try {
      const { pokemons, next } = await fetchPokemonList(url);
      setData((url ? d => [...d, ...pokemons] : () => pokemons));
      setNextUrl(next);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPage(); 
  }, []);

  const handleLoadMore = () => {
    if (nextUrl && !loadingMore) {
      setLoadingMore(true);
      loadPage(nextUrl);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <FlatList
        data={data}
        keyExtractor={(p) => p.id.toString()}
        renderItem={({ item }) => <PokemonListItem pokemon={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadPage()} />
        }
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <ActivityIndicator size="large" />
            <Text style={styles.emptyText}>Ładowanie Pokémonów…</Text>
          </View>
        )}
        ListFooterComponent={() =>
          loadingMore ? (
            <ActivityIndicator style={styles.footer} />
          ) : null
        }
        contentContainerStyle={
          data.length === 0 ? styles.flatEmpty : styles.flat
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flat: { paddingBottom: 16 },
  flatEmpty: { flexGrow: 1 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 12,
    color: '#6B7280',
  },
  footer: {
    marginVertical: 16,
  },
});
