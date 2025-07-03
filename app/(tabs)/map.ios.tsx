import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function ListScreen() {
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"/>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <style>
          html, body, #map {
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([52.2297, 21.0122], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ''
          }).addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: leafletHtml }}
        style={styles.map}
        nestedScrollEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
