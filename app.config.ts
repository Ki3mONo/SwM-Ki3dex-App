import * as dotenv from 'dotenv';
import { ConfigContext, ExpoConfig } from 'expo/config';

dotenv.config();                     // <-- wczytuje .env

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: 'ki3dex',
  slug: 'ki3dex',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  assetBundlePatterns: ['**/*'],

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ki3mon.ki3dex',
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'This app uses location to show Pokémon on the map.',
    },
  },

  android: {
    package: 'com.ki3mon.ki3dex',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
    ],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      },
    },
  },

  web: { favicon: './assets/images/favicon.png' },

  plugins: [
    'expo-router',

    ['react-native-edge-to-edge', { enabled: true }], 

    ['expo-camera', { cameraPermission: 'Allow Ki3dex to use your camera' }],
    ['expo-media-library', {
      photosPermission: 'Allow Ki3dex to save Pokémon photos',
      savePhotosPermission: 'Allow Ki3dex to save Pokémon photos',
    }],
    ['expo-location', {
      locationAlwaysAndWhenInUsePermission:
        'Allow Ki3dex to tag photos with your location',
    }],

    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '16.0',
          useFrameworks: 'static',
          podfileLines: [
            "pod 'VisionCameraFaceDetector', :path => '../node_modules/react-native-vision-camera-face-detector'",
          ],
        },
        android: {
          minSdkVersion: 26,
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          kotlinVersion: '2.0.0',
          extraDependencies: [
            'com.google.mlkit:face-detection:17.1.0',
          ],
        },
      },
    ],

    'react-native-vision-camera',
  ],

  experiments: {
    typedRoutes: true,
  },
});
