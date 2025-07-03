import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
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

  const topPadding = StatusBar.currentHeight || 0;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: leafletHtml }}
        style={styles.map}
        nestedScrollEnabled={false}
        androidHardwareAccelerationDisabled={false}
      />
    </View>
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
