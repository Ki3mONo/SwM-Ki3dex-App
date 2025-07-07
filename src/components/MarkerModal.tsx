import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

interface Props {
  visible: boolean;
  marker: {
    id: string;
    name: string;
    displayName: string;
    imageUrl: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
  } | null;
  onClose: () => void;
  onRemove: (id: string) => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function MarkerModal({ visible, marker, onClose, onRemove }: Props) {
  if (!marker) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.name}>{capitalize(marker.displayName)}</Text>

          <Image
            source={{ uri: marker.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={styles.coords}>
            <Text style={styles.coordText}>Latitude: {marker.coordinate.latitude.toFixed(5)}</Text>
            <Text style={styles.coordText}>Longitude: {marker.coordinate.longitude.toFixed(5)}</Text>
          </View>

          <Pressable
            style={styles.removeButton}
            onPress={() => {
              onRemove(marker.id);
              onClose();
            }}
          >
            <Text style={styles.removeText}>Remove Marker</Text>
          </Pressable>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: '85%',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 6,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 12,
    color: '#1F2937',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  coords: {
    marginBottom: 20,
  },
  coordText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
