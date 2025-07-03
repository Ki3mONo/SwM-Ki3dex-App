import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './globals.css';

import { TailwindProvider } from 'tailwindcss-react-native';
import { FavoriteProvider } from '@/hooks/useFavorite';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PokemonHollow: require('../assets/fonts/PokemonHollow.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <TailwindProvider>
        <FavoriteProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </FavoriteProvider>
      </TailwindProvider>
    </SafeAreaProvider>
  );
}