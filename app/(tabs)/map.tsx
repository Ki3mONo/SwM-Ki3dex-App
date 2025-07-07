import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { LongPressEvent, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomMarker from '@/components/CustomMarker';
import MarkerModal from '@/components/MarkerModal';
import { useFavorite } from '@/hooks/useFavorite';

interface PokemonMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  name: string; // Pokémon ID (string)
}

interface SelectedMarker extends PokemonMarker {
  displayName: string;
  imageUrl: string;
}

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
        const userLocation = await Location.getCurrentPositionAsync({});
        setRegion({
          ...region,
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        });
      } catch (err) {
        console.error('Error fetching location:', err);
      }
    })();
  }, []);

  const handleLongPress = (event: LongPressEvent) => {
    if (!favoriteId) {
      Alert.alert('No favorite Pokémon', 'Set a favorite Pokémon before placing a marker.');
      return;
    }

    const { latitude, longitude } = event.nativeEvent.coordinate;

    const newMarker: PokemonMarker = {
      id: `${Date.now()}`,
      coordinate: { latitude, longitude },
      name: favoriteId,
    };

    setPokemonMarkers((prev) => [...prev, newMarker]);
  };

  const handleMarkerPress = async (marker: PokemonMarker) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${marker.name}`);
      const data = await res.json();

      const displayName = data.name;
      const imageUrl =
        data.sprites.other?.['official-artwork']?.front_default ||
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${marker.name}.png`;

      setSelectedMarker({
        ...marker,
        displayName,
        imageUrl,
      });
    } catch (err) {
      console.warn('Failed to fetch Pokémon data:', err);

      setSelectedMarker({
        ...marker,
        displayName: marker.name,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${marker.name}.png`,
      });
    }
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
        {pokemonMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
          >
            <CustomMarker name={marker.name} />
          </Marker>
        ))}
      </MapView>

      <MarkerModal
        visible={!!selectedMarker}
        marker={selectedMarker}
        onClose={() => setSelectedMarker(null)}
        onRemove={(id) =>
          setPokemonMarkers((prev) => prev.filter((m) => m.id !== id))
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  errorBanner: {
    backgroundColor: '#fdecea',
    padding: 8,
  },
  errorText: {
    color: '#d93025',
    textAlign: 'center',
  },
});
