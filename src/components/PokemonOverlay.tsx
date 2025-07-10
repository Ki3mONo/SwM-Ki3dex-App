import { Canvas, Image as SkiaImage, useImage } from '@shopify/react-native-skia'
import React from 'react'
import { StyleSheet } from 'react-native'

interface OverlayProps {
  uri: string
  x: number
  y: number
  size: number
}

export default function PokemonOverlay({ uri, x, y, size }: OverlayProps) {
  const skImage = useImage(uri)
  if (!skImage) return null

  return (
    <Canvas style={styles.canvas}>
      <SkiaImage image={skImage} x={x} y={y} width={size} height={size} />
    </Canvas>
  )
}

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
})
