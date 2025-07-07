import * as dotenv from 'dotenv';
import { ConfigContext, ExpoConfig } from 'expo/config';

dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'ki3dex',
  slug: 'ki3dex',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    },
    
    bundleIdentifier: 'com.ki3mon.ki3dex',
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'This app uses location to show Pokemon on the map.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      },
    },
    
    package: 'com.ki3mon.ki3dex',

    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
    ],
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'react-native-vision-camera'
  ],
});