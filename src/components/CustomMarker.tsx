import React, { useEffect } from 'react'
import type { ImageProps } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

interface Props extends Omit<ImageProps, 'source'> {
  name: string
}

export default function CustomMarker({ name, ...rest }: Props) {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${name}.png`

  const translateY = useSharedValue(-100)
  const scale = useSharedValue(0)

  useEffect(() => {
    translateY.value = withSpring(0, {
      stiffness: 80,
      damping: 10,
    })
    scale.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    })
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }))

  return (
    <Animated.Image
      {...rest}
      source={{ uri: imageUrl }}
      style={[{ width: 40, height: 40 }, animatedStyle]}
      resizeMode="contain"
    />
  )
}
