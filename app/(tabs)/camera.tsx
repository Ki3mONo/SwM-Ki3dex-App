import React, { useRef, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
  Camera,
} from 'react-native-vision-camera';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { captureRef } from 'react-native-view-shot';

import { useFavorite } from '@/hooks/useFavorite';
import { fetchPokemonDetail } from '@/services/pokeapi';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PokemonPlacement {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function CameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const { favoriteId } = useFavorite();
  const cameraRef = useRef<Camera | null>(null);
  const overlayRef = useRef<View | null>(null);
  const device = useCameraDevice('front');
  
  const [pokemonPlacements, setPokemonPlacements] = useState<PokemonPlacement[]>([]);
  const [photo, setPhoto] = useState<string>('');
  const [pokemonImage, setPokemonImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaPermission, setMediaPermission] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await requestPermission();
      
      // Request media library permission
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(mediaStatus === 'granted');
      
      // Request location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locationStatus === 'granted');
    })();
  }, [requestPermission]);

  useEffect(() => {
    if (favoriteId) {
      loadFavoritePokemon();
    }
  }, [favoriteId]);

  const loadFavoritePokemon = async () => {
    if (!favoriteId) return;
    
    try {
      const { pokemon } = await fetchPokemonDetail(favoriteId);
      const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default || 
                     pokemon.sprites.front_default;
      setPokemonImage(imageUrl || '');
    } catch (error) {
      console.error('Failed to load favorite Pokemon:', error);
    }
  };

  const handleScreenTap = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const newPlacement = {
      x: locationX - 50,
      y: locationY - 50,
      width: 100,
      height: 100,
    };
    setPokemonPlacements([newPlacement]);
  };

  const saveToGallery = async (uri: string) => {
    if (!mediaPermission) {
      Alert.alert('Permission Required', 'Please grant media library access to save photos');
      return;
    }

    try {
      let location = null;
      if (locationPermission) {
        const currentLocation = await Location.getCurrentPositionAsync({});
        location = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Ki3dex', asset, false);
      
      if (location) {
        console.log('Photo taken at:', location);
        // You could save this location data to AsyncStorage for map display later
      }
      
      Alert.alert('Success', 'Photo saved to gallery!');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save photo');
    }
  };

  const handleTakePicture = async () => {
    if (!overlayRef.current) return;
    
    setIsProcessing(true);
    
    try {
      const uri = await captureRef(overlayRef.current, {
        format: 'png',
        quality: 0.8,
      });
      
      setPhoto(uri);
      await saveToGallery(uri);
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCamera = () => {
    setPhoto('');
    setPokemonPlacements([]);
  };

  const clearPokemon = () => {
    setPokemonPlacements([]);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#FFCB05" size="large" />
        <Text style={styles.statusText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>No camera device found</Text>
      </View>
    );
  }

  if (!favoriteId) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Please select a favorite Pokemon first!</Text>
        <Text style={styles.subText}>Go to the Pokemon list and mark one as favorite</Text>
      </View>
    );
  }

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.fullImage} />
        <View style={styles.photoControls}>
          <TouchableOpacity style={styles.controlButton} onPress={resetCamera}>
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.controlText}>Take Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        ref={overlayRef} 
        style={styles.cameraContainer}
        onPress={handleScreenTap}
        activeOpacity={1}
      >
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive={true}
          pixelFormat="yuv"
        />
        
        {/* Pokemon overlay */}
        {pokemonPlacements.map((placement, index) => (
          <View
            key={index}
            style={[
              styles.pokemonOverlay,
              {
                left: placement.x,
                top: placement.y,
                width: placement.width,
                height: placement.height,
              },
            ]}
          >
            {pokemonImage && (
              <Image
                source={{ uri: pokemonImage }}
                style={styles.pokemonImage}
                resizeMode="contain"
              />
            )}
          </View>
        ))}
      </TouchableOpacity>

      <View style={styles.bottomBar}>
        <Text style={styles.instructionText}>
          {pokemonPlacements.length > 0 
            ? 'Pokemon placed! Ready to capture!' 
            : 'Tap on the camera to place your Pokemon'
          }
        </Text>
        
        <View style={styles.buttonContainer}>
          {pokemonPlacements.length > 0 && (
            <TouchableOpacity
              onPress={clearPokemon}
              style={styles.clearButton}
            >
              <Ionicons name="close" size={24} color="#1A1E3F" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={handleTakePicture}
            style={styles.shutterButton}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#1A1E3F" />
            ) : (
              <Ionicons name="camera" size={32} color="#1A1E3F" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1E3F',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  pokemonOverlay: {
    position: 'absolute',
    zIndex: 10,
  },
  pokemonImage: {
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(26, 30, 63, 0.8)',
  },
  instructionText: {
    color: '#FFCB05',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  clearButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFCB05',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fullImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  photoControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  controlText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  statusText: {
    color: '#FFCB05',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  subText: {
    color: '#FFCB05',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
  },
});