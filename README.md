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

- **React Native**: 0.79.1
- **React**: 19.0.0
- **TypeScript**: 5.0.4
- **React Navigation**: 7.x
- **State Management**: Context API
- **AsyncStorage**: For storing user settings
- **Location Services**: react-native-geolocation-service
- **Permissions**: react-native-permissions
- **UI Components**: react-native-vector-icons
- **Responsive Design**: react-native-responsive-screen

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
│   └── app/
│       └── build.gradle          # Build configuration
├── src/
│   ├── api/                      # API handling
│   │   └── weatherApi.ts         # Weather API functions
│   ├── components/               # Reusable components
│   ├── contexts/                 # Context API for global state
│   ├── hooks/                    # Custom React hooks
│   ├── navigation/               # App navigation setup
│   ├── screens/                  # Screens for the app
│   ├── types/                    # TypeScript types
│   └── utils/                    # Utility functions
├── App.tsx                       # Main entry point for the app
├── package.json                  # Project dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
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
