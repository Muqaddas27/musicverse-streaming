# 🎵 MusicVerse - Premium Music Streaming Platform

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)

A professional web-based music streaming platform featuring English and Pakistani/Urdu music libraries, Spotify integration, custom playlists, and a sleek dark/light theme interface.

## ✨ Features

### 🎧 Core Features
- **Dual Language Libraries**: Browse 200+ demo tracks across English and Urdu/Pakistani music
- **Smart Search**: Real-time filtering by artist, title, or category
- **Custom Playlists**: Create, manage, and organize your favorite tracks
- **Spotify Integration**: Connect your Spotify account to sync preview tracks and profile
- **Persistent Storage**: Favorites, playlists, and recently played tracks saved locally
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🎨 UI/UX
- **Dark/Light Themes**: Toggle between dark and light modes with smooth transitions
- **Motion Animations**: Powered by Framer Motion for fluid interactions
- **Custom Modals**: Native-styled confirmation and info dialogs
- **Audio Player**: Full-featured player with volume control, shuffle, repeat, and progress seeking
- **Empty States**: Helpful messages and actions when no content is available

### 🔐 Authentication
- **Spotify OAuth**: Secure authentication flow with session management
- **Profile Display**: Shows authenticated user's Spotify profile and avatar

## 🚀 Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite 6 (build tooling)
- TailwindCSS 4 (styling)
- Motion/Framer Motion (animations)
- Lucide React (icons)

**Backend:**
- Express.js (server)
- Axios (HTTP client)
- Express Session (authentication)
- Spotify Web API (music data)

**Development:**
- TypeScript 5.8
- TSX (TypeScript execution)
- Better SQLite3 (session storage)

## 📋 Prerequisites

- Node.js 18+ and npm
- Spotify Developer Account (for OAuth integration)

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd musicverse---premium-music-streaming
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Server Configuration
PORT=3000
APP_URL=http://localhost:3000

# Spotify API Credentials (get from https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SESSION_SECRET=your_random_secret_key_here
```

**Getting Spotify Credentials:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy Client ID and Client Secret
4. Add `http://localhost:3000/auth/callback` to Redirect URIs in app settings

### 4. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check TypeScript types |
| `npm run clean` | Remove build artifacts |

## 🎯 Usage Guide

### Basic Navigation
1. **Home**: Featured sections, quick play cards, and trending artists
2. **Browse**: Explore music by language and category
3. **English/Pakistani**: Language-specific music libraries
4. **Favorites**: Your liked tracks
5. **Recently Played**: Last 10 tracks you listened to
6. **Playlists**: Your custom playlists

### Creating Playlists
1. Click **Create** button in header
2. Enter playlist name
3. Navigate to any music view
4. Click three-dot menu on any song
5. Select "Add to Playlist"

### Connecting Spotify
1. Click **Connect** button in header
2. Authorize with Spotify
3. Access additional preview tracks and your profile

### Search
- Use the search bar in header to filter by artist, title, or category
- Search works across all views (Home, Browse, English, Pakistani, etc.)
- Clear search to reset filters

## 🏗️ Project Structure

```
musicverse---premium-music-streaming/
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles and theme variables
│   ├── types.ts             # TypeScript interfaces
│   └── services/
│       └── songGenerator.ts # Mock data generation
├── server.ts                # Express backend server
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── .env.example             # Environment variables template
```

## 🎵 Audio Sources

- **Demo Tracks**: Uses SoundHelix demo audio for fully playable preview tracks
- **Spotify Previews**: When connected, fetches 30-second previews from Spotify API
- **Demo Artists**: Features original demo artist names (North Harbor, City Echo, Lahore Collective, etc.)

## 🔒 Security

- Environment variables for sensitive credentials
- `.gitignore` configured to exclude `.env` files
- Session-based authentication with httpOnly cookies
- CORS and CSRF protection in production mode

## 🐛 Known Limitations

1. **Demo Audio**: Local tracks use demo audio, not actual commercial recordings
2. **Spotify Preview Length**: Spotify previews are 30 seconds only
3. **No Backend Persistence**: Playlists stored in localStorage (client-side only)
4. **Single User**: No multi-user authentication or shared playlists

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for music data
- [SoundHelix](https://www.soundhelix.com/) for demo audio tracks
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [TailwindCSS](https://tailwindcss.com/) for utility-first styling
- [Motion](https://motion.dev/) for smooth animations

## 📸 Screenshots

_Add screenshots of your application here to showcase the UI_

---

**Built with ❤️ using React, TypeScript, and TailwindCSS**
