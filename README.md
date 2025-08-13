# Eduva Mobile App

A React Native mobile application that provides an interactive learning platform for students and teachers. Built with Expo and TypeScript.

## Features

- 🏫 **Class Management**
  - Join classes using class codes
  - View enrolled classes and course materials
  - Track learning progress

- 📚 **Learning Materials**
  - Support multiple content types (Video, Audio, PDF, DOCX)
  - Interactive media players with playback controls
  - Progress tracking across lessons

- 💬 **Interactive Learning**
  - Ask questions during lessons
  - Comment and discuss with teachers and peers
  - Rich text editor for detailed responses
  - Best answer highlighting

- 👤 **User Profile**
  - View enrolled classes
  - Track learning activities
  - Manage personal information

## Getting Started

1. Install dependencies
```bash
npm install
```

2. Set up environment variables
```bash
cp .env.example .env
# Configure your environment variables
```

3. Start the development server
```bash
npx expo start
```

## Running the App

- **iOS**: Press `i` in terminal or use iOS Simulator
- **Android**: Press `a` in terminal or use Android Emulator
- **Web**: Press `w` in terminal for web version
- **Device**: Scan QR code with Expo Go app

## Tech Stack

- React Native
- Expo
- TypeScript
- React Query
- React Navigation
- Expo Router
- React Native Rich Text Editor

## Project Structure

```
eduva-mobile/
├── app/                  # Main application screens
├── api/                  # API client and endpoints
├── components/          # Reusable components
├── constants/          # App constants
├── contexts/           # React contexts
├── hooks/             # Custom hooks
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Development

The app uses Expo's file-based routing system. Main features are organized in the following directories:

- `app/(tabs)`: Main tab navigation screens
- `app/(routes)`: Other app routes
- `components/learn`: Learning-related components
- `components/profile`: Profile-related components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary software.

## Support

For support or questions, please contact the development team.
