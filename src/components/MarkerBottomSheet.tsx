import React, { useEffect, useMemo, useRef } from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface PokemonMarker {
  id: string;
  coordinate: { latitude: number; longitude: number };
  name: string;
}

export interface SelectedMarker extends PokemonMarker {
  displayName: string;
  imageUrl: string;
}

interface Props {
  selectedMarker: SelectedMarker | null;
  hasMarkers: boolean;             // <-- nowa właściwość
  onRemove: (id: string) => void;
}

const TAB_BAR_HEIGHT = 0;

const MarkerBottomSheet: React.FC<Props> = ({
  selectedMarker,
  hasMarkers,
  onRemove,
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const { bottom: safeBottom } = useSafeAreaInsets();

  const snapPoints = useMemo(() => ['10%', '35%'], []);

  useEffect(() => {
    if (selectedMarker) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.snapToIndex(0);
    }
  }, [selectedMarker]);

  const placeholderText = hasMarkers
    ? 'Select a marker on the map'
    : 'Put marker on the map by holding';

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={false}
      detached={true}
      enableOverDrag={false}
      bottomInset={safeBottom + TAB_BAR_HEIGHT}
    >
      <BottomSheetView style={styles.contentContainer}>
        {selectedMarker ? (
          <>
            <Text style={styles.title}>
              {capitalize(selectedMarker.displayName)}
            </Text>
            <Image
              source={{ uri: selectedMarker.imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.coords}>
              Latitude: {selectedMarker.coordinate.latitude.toFixed(5)}
            </Text>
            <Text style={styles.coords}>
              Longitude: {selectedMarker.coordinate.longitude.toFixed(5)}
            </Text>
            <Pressable
              style={styles.removeButton}
              onPress={() => onRemove(selectedMarker.id)}
            >
              <Text style={styles.removeButtonText}>Remove Marker</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.placeholder}>{placeholderText}</Text>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  placeholder: {
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  coords: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MarkerBottomSheet;
