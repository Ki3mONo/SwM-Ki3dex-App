import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { TailwindProvider } from 'tailwindcss-react-native';
import { FavoriteProvider } from '@/hooks/useFavorite';
import { Stack } from 'expo-router';
import './globals.css';

export default function RootLayout() {
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
