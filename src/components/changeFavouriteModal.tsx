import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface PokemonInfo {
  id: string;
  name: string;
  imageUrl: string;
}

interface Props {
  visible: boolean;
  existingPokemon: PokemonInfo;
  newPokemon: PokemonInfo;
  onCancel: () => void;
  onSelect: (id: string) => void;
}

export default function ChangeFavoriteModal({
  visible,
  existingPokemon,
  newPokemon,
  onCancel,
  onSelect,
}: Props) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            You already have a favorite Pokémon.
          </Text>
          <Text style={styles.title}>
            Choose which one to keep:
          </Text>

          <View style={styles.choices}>
            <TouchableOpacity
              style={styles.choice}
              onPress={() => onSelect(existingPokemon.id)}
            >
              <Image
                source={{ uri: existingPokemon.imageUrl }}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.name}>{existingPokemon.name}</Text>
              <Text style={styles.label}>(Current)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.choice}
              onPress={() => onSelect(newPokemon.id)}
            >
              <Image
                source={{ uri: newPokemon.imageUrl }}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.name}>{newPokemon.name}</Text>
              <Text style={styles.label}>(New)</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
    color: '#1F2937',
  },
  choices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  choice: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  cancelBtn: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  cancelText: {
    color: '#4B5563',
    fontSize: 14,
  },
});
