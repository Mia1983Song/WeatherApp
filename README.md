# WeatherApp

A simple weather application built with React Native, providing weather information based on your location or by searching for a city. This app is developed using TypeScript and supports Android platforms.

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Features](#features)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Introduction

WeatherApp is a React Native app designed to provide weather information using the OpenWeatherMap API. It allows users to view weather data for their current location or search for a different city. The app also provides customization options for units and cities.

## Technologies

### Core Framework

- **React**: 19.0.0
- **React Native**: 0.79.1
- **TypeScript**: 5.0.4
- **Node.js**: ≥ 18

### Navigation

- **React Navigation** 7.x
  - @react-navigation/native: 7.1.6
  - @react-navigation/bottom-tabs: 7.3.10
  - @react-navigation/native-stack: 7.3.10

### State Management

- **Context API** (custom Providers and Hooks)

### Data Persistence

- **AsyncStorage** 2.1.2

### UI Components & Styling

- **react-native-vector-icons** 10.2.0
- Custom responsive system (based on Dimensions API)

### Location Services

- **react-native-geolocation-service** 5.3.1

### Permissions Management

- **react-native-permissions** 5.3.0

## Installation

Follow these steps to set up the project:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/WeatherApp.git
   cd WeatherApp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the Android environment by following the React Native documentation.

4. Run the app on Android:

   ```bash
   npm run android
   ```

5. For iOS (if needed), you can use:
   ```bash
   npm run ios
   ```

## Project Structure

```
WeatherApp/
├── android/                      # Android-specific files
├── src/
│   ├── api/                      # API related functionality
│   │   └── weatherApi.ts         # Weather API interfaces and functions
│   ├── components/               # Reusable components
│   │   ├── WeatherCard.tsx       # Weather information card
│   │   ├── SearchBar.tsx         # Search input component
│   │   └── common/               # Common UI components
│   │       ├── StatusDisplay.tsx # Unified status display component
│   │       ├── LoadingIndicator.tsx # Loading indicator component
│   │       └── ErrorDisplay.tsx  # Error display component
│   ├── contexts/                 # Context API related
│   │   └── SettingsContext.tsx   # Settings management context
│   ├── hooks/                    # Custom React Hooks
│   │   └── useLocation.ts        # Location services hook
│   ├── navigation/               # Navigation related
│   │   ├── AppNavigator.tsx      # Main app navigation configuration
│   │   └── HomeStack.tsx         # Home stack navigation
│   ├── screens/                  # Main screens
│   │   ├── HomeScreen.tsx        # Home page
│   │   ├── SearchScreen.tsx      # Search page
│   │   ├── SettingsScreen.tsx    # Settings page
│   │   ├── WeatherDetailScreen.tsx # Weather details page
│   │   └── ForecastScreen.tsx    # Forecast page
│   ├── types/                    # Type definitions
│   │   └── settings.ts           # Settings related types
│   └── utils/                    # Utility functions
│       ├── responsive.ts         # Responsive design utilities
│       └── temperatureUtils.ts   # Temperature conversion utilities
├── App.tsx                       # App entry point
└── index.js                      # React Native entry point
```

## Features

- View weather data for the current location or a searched city.
- Supports temperature units in Celsius and Fahrenheit.
- Save user settings (e.g., default city, units, etc.) with AsyncStorage.
- Supports navigation to different screens for detailed weather information.
- Uses `react-native-geolocation-service` to get the user's current location.
- Ability to change the default city and unit settings in the app.

## Screenshots

- Home Screen
- Search Screen
- Settings Screen

(Screenshot here)

## Contributing

Feel free to fork the repository and submit issues and pull requests for new features or improvements. Please make sure to follow the project's coding style and write tests for new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
