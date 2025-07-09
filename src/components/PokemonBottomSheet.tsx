import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import type { SharedValue } from 'react-native-reanimated';

interface Props {
  types: string[];
  description: string;
  color: string;
  height?: number;
  weight?: number;
  animatedPosition: SharedValue<number>;
}

export default function PokemonBottomSheet({
  types,
  description,
  color,
  height,
  weight,
  animatedPosition,
}: Props) {
  const sheetRef = useRef<BottomSheet>(null);
  const windowHeight = Dimensions.get('window').height;

  const [contentHeight, setContentHeight] = useState(0);
  const onContentLayout = (e: LayoutChangeEvent) => {
    if (contentHeight === 0) {
      setContentHeight(e.nativeEvent.layout.height);
    }
  };

  const snapPoints = useMemo(() => {
    const first = contentHeight > 0
      ? contentHeight
      : windowHeight * 0.3;
    return [first, windowHeight * 0.5];
  }, [contentHeight, windowHeight]);

  const [expanded, setExpanded] = useState(false);

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={(idx) => setExpanded(idx >= 1)}
      enableOverDrag={false}
      enablePanDownToClose={false}
      handleIndicatorStyle={styles.indicator}
      animatedPosition={animatedPosition}
    >
      <BottomSheetView style={styles.content} onLayout={onContentLayout}>
        <View style={styles.typesContainer}>
          {types.map((t, i) => (
            <View key={i} style={[styles.typeChip, { backgroundColor: color }]}>
              <Text style={styles.typeText}>{t}</Text>
            </View>
          ))}
        </View>

        {description.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        )}

        <View style={[styles.section, expanded ? null : styles.hiddenSection]}>
          <Text style={styles.sectionTitle}>Physical Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Height</Text>
              <Text style={styles.statValue}>
                {height != null ? `${(height / 10).toFixed(1)} m` : 'Unknown'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>
                {weight != null ? `${(weight / 10).toFixed(1)} kg` : 'Unknown'}
              </Text>
            </View>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  typeText: {
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 16,
  },
  hiddenSection: {
    maxHeight: 0,
    opacity: 0,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#4B5563',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
});
