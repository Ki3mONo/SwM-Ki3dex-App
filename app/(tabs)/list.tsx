import { View, Text, FlatList } from 'react-native';
import { Pokemon } from '@/types/pokemon';


export default function ListScreen() {
  const data: Pokemon[] = [];
  
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-gray-500">{item.types.join(', ')}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}