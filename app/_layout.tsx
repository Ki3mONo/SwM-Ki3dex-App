import { FavoriteProvider } from '@/hooks/useFavorite'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TailwindProvider } from 'tailwindcss-react-native'

import './globals.css'

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PokemonHollow: require('../assets/fonts/PokemonHollow.ttf'),
  })

  if (!fontsLoaded && !fontError) {
    return null
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
  )
}
