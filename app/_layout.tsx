import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';

import './globals.css';

import { TailwindProvider } from 'tailwindcss-react-native';

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
    <TailwindProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TailwindProvider>
  );
}
