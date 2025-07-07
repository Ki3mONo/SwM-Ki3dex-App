import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './globals.css';

import { FavoriteProvider } from '@/hooks/useFavorite';
import { TailwindProvider } from 'tailwindcss-react-native';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PokemonHollow: require('../assets/fonts/PokemonHollow.ttf'),
  });

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
