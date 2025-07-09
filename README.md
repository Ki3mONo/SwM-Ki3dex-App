# Pokédex APP - Ki3dex

Pokédex application built with React Native, Expo, and TypeScript. 

Built using [PokéAPI](https://pokeapi.co)

## 🚀 Features

- Browse Pokémon
- Set your favourite Pokémon
- View detailed Pokémon information
- Set custom marker
- Place your favourite Pokémon on your forehead
- Cross-platform compatibility (iOS, Android, Web)
- Modern UI

## 🛠️ Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe JavaScript
- **Metro** - JavaScript bundler

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Expo CLI
- For iOS development: Xcode
- For Android development: Android Studio

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pokedex
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (for Google Maps):
```bash
cp .env.example .env
# Edit .env with your configuration
```

## 🚀 Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

### Platform-specific Commands

```bash
# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

### Building for Production

```bash
# Build for production
npm run build

# Build for specific platforms
expo build:ios
expo build:android
```

## 📁 Project Structure

```
├── app/                   # App router pages
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home screen
│   └── globals.css        # Global styles
├── src/                   # Source code
├── assets/                # Static assets (images, fonts)
├── android/               # Android-specific code
├── ios/                   # iOS-specific code
├── .expo/                 # Expo configuration
└── ...config files
```

## ⚙️ Configuration

- [`app.config.ts`](app.config.ts) - Expo app configuration
- [`tsconfig.json`](tsconfig.json) - TypeScript configuration
- [`babel.config.js`](babel.config.js) - Babel configuration
- [`metro.config.js`](metro.config.js) - Metro bundler configuration

## 🧪 Development Tools

- **Hot reloading** enabled for fast development
- **TypeScript** for compile-time error checking

## 📱 Platform Support

- ✅ iOS
- ✅ Android
- ✅ Web


## 📄 License

This project is licensed under the no license.

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`

---

Built with pure hate.