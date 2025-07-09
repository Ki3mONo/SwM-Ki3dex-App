import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TailwindProvider } from 'tailwindcss-react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { FavoriteProvider } from '@/hooks/useFavorite';
import { Stack } from 'expo-router';

import './globals.css';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PokemonHollow: require('../assets/fonts/PokemonHollow.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TailwindProvider>
          <BottomSheetModalProvider>
            <FavoriteProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </FavoriteProvider>
          </BottomSheetModalProvider>
        </TailwindProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
