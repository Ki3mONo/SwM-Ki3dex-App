import React from 'react';
import { View, Text, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  { label: 'Pokémon List',      route: '/(tabs)/list',       icon: 'list'   },
  { label: 'Favourite Pokémon', route: '/(tabs)/favourites', icon: 'heart'  },
  { label: 'Map',               route: '/(tabs)/map',        icon: 'map'    },
  { label: 'Camera',            route: '/(tabs)/camera',     icon: 'camera' },
] as const;

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('@/../assets/images/forest.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        className="flex-1 items-center justify-center px-4"
        style={{ backgroundColor: 'transparent' }}
      >
        <Text
          className="font-pokemon text-pokeText text-center mb-12"
          style={{
            textShadowColor: 'var(--poke-text-secondary)',
            textShadowOffset: { width: 4, height: 4 },
            textShadowRadius: 3,
          }}
        >
          <Text className="text-4xl">Welcome to</Text>
          {'\n\n'}
          <Text className="text-6xl">Ki3Dex!</Text>
        </Text>

        {menuItems.map(({ label, route, icon }) => (
          <Pressable
            key={route}
            onPress={() => router.push(route)}
            className="w-full flex-row items-center bg-primary rounded-xl px-6 py-4 mb-4 opacity-85"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name={icon} size={24} color="white" className="mr-4" />
            <Text className="text-pokeText font-pokemon text-lg">{label}</Text>
          </Pressable>
        ))}
      </View>
    </ImageBackground>
  );
}
