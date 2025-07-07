import React from 'react';
import { Image } from 'react-native';

interface Props {
  name: string;
}

export default function CustomMarker({ name }: Props) {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${name}.png`;

  return (
    <Image
      source={{ uri: imageUrl }}
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  );
}
