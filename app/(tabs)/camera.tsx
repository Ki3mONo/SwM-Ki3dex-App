import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  useFaceDetector,
  Face,
  FaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

import { useFavorite } from '@/hooks/useFavorite';
import { fetchPokemonDetail } from '@/services/pokeapi';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

interface Overlay {
  x: number;
  y: number;
  size: number;
}

export default function CameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');

  const { favoriteId } = useFavorite();
  const [pokemonUri, setPokemonUri] = useState<string | null>(null);

  const [overlay, setOverlay] = useState<Overlay | null>(null);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    const load = async () => {
      if (!favoriteId) return;
      const { pokemon } = await fetchPokemonDetail(favoriteId);
      const uri =
        pokemon.sprites.other?.['official-artwork']?.front_default ??
        pokemon.sprites.front_default;
      setPokemonUri(uri ?? null);
    };
    load();
  }, [favoriteId]);

  const faceOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'fast',
    landmarkMode: 'none',
    classificationMode: 'none',
    autoMode: true, 
    windowWidth: WINDOW_WIDTH,
    windowHeight: WINDOW_HEIGHT,
    cameraFacing: 'front',
  }).current;

  const { detectFaces } = useFaceDetector(faceOptions);

  const handleFaces = Worklets.createRunOnJS((faces: Face[]) => {
    if (faces.length === 0) {
      setOverlay(null);
      return;
    }
    const face = faces[0];
    const { x, y, width } = face.bounds;

    const size = width * 0.6;
    const centerX = x + width / 2;
    const foreheadY = Math.max(y - size * 0.4, 0);

    setOverlay({
      x: centerX - size / 2,
      y: foreheadY,
      size,
    });
  });

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      const faces = detectFaces(frame);
      handleFaces(faces);
    },
    [detectFaces, handleFaces],
  );

  if (!hasPermission || !device) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFCB05" />
      </View>
    );
  }
  if (!favoriteId || !pokemonUri) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFCB05" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        frameProcessor={frameProcessor}
      />

      {overlay && (
        <Image
          source={{ uri: pokemonUri }}
          style={[
            styles.pokemon,
            {
              left: overlay.x,
              top: overlay.y,
              width: overlay.size,
              height: overlay.size,
            },
          ]}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1E3F',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1E3F',
  },
  pokemon: {
    position: 'absolute',
    zIndex: 10,
  },
});