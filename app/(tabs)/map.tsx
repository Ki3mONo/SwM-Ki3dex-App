import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import MapView, { LongPressEvent, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomMarker from '@/components/CustomMarker';
import { useFavorite } from '@/hooks/useFavorite';
import MarkerBottomSheet, {
  PokemonMarker,
  SelectedMarker,
} from '@/components/MarkerBottomSheet';

const DEFAULT_REGION = {
  latitude: 50.049,
  longitude: 19.965,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapScreen() {
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [pokemonMarkers, setPokemonMarkers] = useState<PokemonMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { favoriteId } = useFavorite();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location access denied. Using default region.');
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion(r => ({
          ...r,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }));
      } catch (err) {
        console.error('Error fetching location:', err);
      }
    })();
  }, []);

  const handleLongPress = (e: LongPressEvent) => {
    if (!favoriteId) {
      Alert.alert('No favorite Pokémon', 'Set a favorite Pokémon first.');
      return;
    }
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPokemonMarkers(m => [
      ...m,
      { id: `${Date.now()}`, coordinate: { latitude, longitude }, name: favoriteId },
    ]);
  };

  const handleMarkerPress = async (marker: PokemonMarker) => {
    let displayName = marker.name;
    let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${marker.name}.png`;
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${marker.name}`);
      const data = await res.json();
      displayName = data.name;
      imageUrl =
        data.sprites.other?.['official-artwork']?.front_default ||
        imageUrl;
    } catch {
      console.warn('Failed to fetch Pokémon data:', marker.name);
    }
    setSelectedMarker({ ...marker, displayName, imageUrl });
  };

  const handleRemove = (id: string) => {
    setPokemonMarkers(m => m.filter(x => x.id !== id));
    setSelectedMarker(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {errorMsg && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      <MapView
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        region={region}
        onLongPress={handleLongPress}
        showsUserLocation
        showsMyLocationButton
      >
        {pokemonMarkers.map(m => (
          <Marker
            key={m.id}
            coordinate={m.coordinate}
            onPress={() => handleMarkerPress(m)}
          >
            <CustomMarker name={m.name} />
          </Marker>
        ))}
      </MapView>

      <MarkerBottomSheet
        selectedMarker={selectedMarker}
        hasMarkers={pokemonMarkers.length > 0}   // <-- tutaj
        onRemove={handleRemove}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1 },
  errorBanner: {
    backgroundColor: '#fdecea',
    padding: 8,
  },
  errorText: {
    color: '#d93025',
    textAlign: 'center',
  },
});
