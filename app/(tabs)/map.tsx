import { Platform } from 'react-native';

const MapScreen = Platform.select({
  ios:  () => require('./map.ios').default,
  android: () => require('./map.android').default,
  default: () => require('./map.ios').default,
})();

export default MapScreen;
