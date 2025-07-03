import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="relative mb-10 px-6">
        <Text className="text-4xl font-pokemon text-pokeText text-center leading-[48px]" style={{ textShadowColor: 'var(--poke-text-secondary)', textShadowOffset: { width: 4, height: 4 }, textShadowRadius: 3 }}>Witaj w Ki3Dex!</Text>
      </View>

      <Pressable
        onPress={() => router.push('/(tabs)/list')}
        className="mb-4 p-4 w-64 bg-primary rounded-xl"
      >
        <Text className="text-center text-pokeText font-semibold">Lista Pokémonów</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/(tabs)/favourites')}
        className="mb-4 p-4 w-64 bg-primary rounded-xl"
      >
        <Text className="text-center text-pokeText font-semibold fontsize-16px">Ulubiony Pokémon</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/(tabs)/map')}
        className="mb-4 p-4 w-64 bg-primary rounded-xl"
      >
        <Text className="text-center text-pokeText font-semibold">Mapa</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/(tabs)/camera')}
        className="p-4 w-64 bg-primary rounded-xl"
      >
        <Text className="text-center text-pokeText font-semibold">Kamera</Text>
      </Pressable>
    </View>
  );
}
