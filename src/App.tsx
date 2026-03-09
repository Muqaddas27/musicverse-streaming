import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, 
  Volume2, VolumeX, Heart, ListMusic, Search,
  Compass, Music2, Clock, MoreHorizontal,
  ChevronLeft, ChevronRight, PlayCircle, Mail, ExternalLink,
  Headphones, SearchCode, Mic2, Globe, MoonStar, Sun, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Song, Playlist, View } from './types';

// Mock data generation for 200 songs since I can't call Gemini in real-time for 200 items easily without potential timeouts or limits in a single turn.
// I will create a robust generator function that populates the list.

const ENGLISH_ARTISTS = ['The Weeknd', 'Taylor Swift', 'Ed Sheeran', 'Ariana Grande', 'Drake', 'Justin Bieber', 'Dua Lipa', 'Post Malone', 'Billie Eilish', 'Harry Styles'];
const PAKISTANI_ARTISTS = ['Atif Aslam', 'Ali Zafar', 'Rahat Fateh Ali Khan', 'Abida Parveen', 'Nusrat Fateh Ali Khan', 'Ali Sethi', 'Momina Mustehsan', 'Asim Azhar', 'Quratulain Balouch', 'Strings'];
const DEMO_ENGLISH_ARTISTS = ['North Harbor', 'City Echo', 'Velvet Horizon', 'Blue Atlas', 'Pulse District'];
const DEMO_URDU_ARTISTS = ['Lahore Collective', 'Karachi Waves', 'Mehfil Studio', 'Sufi Avenue', 'Darya Sessions'];

const ARTIST_SONGS: Record<string, { title: string, url: string }[]> = {
  'Atif Aslam': [
    { title: 'Tajdar-e-Haram', url: 'https://archive.org/download/CokeStudioSeason8/Tajdar-e-Haram%20-%20Atif%20Aslam.mp3' },
    { title: 'Dil Diyan Gallan', url: 'https://archive.org/download/AtifAslamCollection/Dil%20Diyan%20Gallan.mp3' },
    { title: 'Tera Hone Laga Hoon', url: 'https://archive.org/download/AtifAslamCollection/Tera%20Hone%20Laga%20Hoon.mp3' },
    { title: 'Aadat', url: 'https://archive.org/download/AtifAslamCollection/Aadat.mp3' },
    { title: 'Jeena Jeena', url: 'https://archive.org/download/AtifAslamCollection/Jeena%20Jeena.mp3' }
  ],
  'Ali Zafar': [
    { title: 'Jhoom', url: 'https://archive.org/download/AliZafarJhoom/Jhoom.mp3' },
    { title: 'Rockstar', url: 'https://archive.org/download/AliZafarCollection/Rockstar.mp3' },
    { title: 'Channo', url: 'https://archive.org/download/AliZafarCollection/Channo.mp3' },
    { title: 'Voh Dekhnay Mein', url: 'https://archive.org/download/AliZafarCollection/Voh%20Dekhnay%20Mein.mp3' },
    { title: 'Sajania', url: 'https://archive.org/download/AliZafarCollection/Sajania.mp3' }
  ],
  'Rahat Fateh Ali Khan': [
    { title: 'Afreen Afreen', url: 'https://archive.org/download/CokeStudioSeason9/Afreen%20Afreen%20-%20Rahat%20Fateh%20Ali%20Khan%20%26%20Momina%20Mustehsan.mp3' },
    { title: 'O Re Piya', url: 'https://archive.org/download/RahatFatehAliKhanCollection/O%20Re%20Piya.mp3' },
    { title: 'Mere Rashke Qamar', url: 'https://archive.org/download/RahatFatehAliKhanCollection/Mere%20Rashke%20Qamar.mp3' },
    { title: 'Zaroori Tha', url: 'https://archive.org/download/RahatFatehAliKhanCollection/Zaroori%20Tha.mp3' },
    { title: 'Tum Jo Aaye', url: 'https://archive.org/download/RahatFatehAliKhanCollection/Tum%20Jo%20Aaye.mp3' }
  ],
  'Abida Parveen': [
    { title: 'Chaap Tilak', url: 'https://archive.org/download/AbidaParveenCollection/Chaap%20Tilak.mp3' },
    { title: 'Tu Jhoom', url: 'https://archive.org/download/CokeStudioSeason14/Tu%20Jhoom%20-%20Abida%20Parveen%20%26%20Naseebo%20Lal.mp3' },
    { title: 'Yaar Ko Humne', url: 'https://archive.org/download/AbidaParveenCollection/Yaar%20Ko%20Humne.mp3' },
    { title: 'Gharoli', url: 'https://archive.org/download/AbidaParveenCollection/Gharoli.mp3' },
    { title: 'Man Kunto Maula', url: 'https://archive.org/download/AbidaParveenCollection/Man%20Kunto%20Maula.mp3' }
  ],
  'Nusrat Fateh Ali Khan': [
    { title: 'Mere Rashke Qamar', url: 'https://archive.org/download/NusratFatehAliKhanCollection/Mere%20Rashke%20Qamar.mp3' },
    { title: 'Yeh Jo Halka Halka Suroor', url: 'https://archive.org/download/NusratFatehAliKhanCollection/Yeh%20Jo%20Halka%20Halka%20Suroor.mp3' },
    { title: 'Tum Ek Gorakh Dhanda Ho', url: 'https://archive.org/download/NusratFatehAliKhanCollection/Tum%20Ek%20Gorakh%20Dhanda%20Ho.mp3' },
    { title: 'Sanu Ek Pal Chain Na Aave', url: 'https://archive.org/download/NusratFatehAliKhanCollection/Sanu%20Ek%20Pal%20Chain%20Na%20Aave.mp3' },
    { title: 'Allah Hoo', url: 'https://archive.org/download/NusratFatehAliKhanCollection/Allah%20Hoo.mp3' }
  ],
  'Ed Sheeran': [
    { title: 'Shape of You', url: 'https://archive.org/download/EdSheeranShapeOfYou/Ed%20Sheeran%20-%20Shape%20of%20You.mp3' },
    { title: 'Perfect', url: 'https://archive.org/download/EdSheeranCollection/Perfect.mp3' },
    { title: 'Thinking Out Loud', url: 'https://archive.org/download/EdSheeranCollection/Thinking%20Out%20Loud.mp3' },
    { title: 'Bad Habits', url: 'https://archive.org/download/EdSheeranCollection/Bad%20Habits.mp3' },
    { title: 'Photograph', url: 'https://archive.org/download/EdSheeranCollection/Photograph.mp3' }
  ],
  'Taylor Swift': [
    { title: 'Anti-Hero', url: 'https://archive.org/download/TaylorSwiftCollection/Anti-Hero.mp3' },
    { title: 'Blank Space', url: 'https://archive.org/download/TaylorSwiftCollection/Blank%20Space.mp3' },
    { title: 'Shake It Off', url: 'https://archive.org/download/TaylorSwiftCollection/Shake%20It%20Off.mp3' },
    { title: 'Love Story', url: 'https://archive.org/download/TaylorSwiftCollection/Love%20Story.mp3' },
    { title: 'Cruel Summer', url: 'https://archive.org/download/TaylorSwiftCollection/Cruel%20Summer.mp3' }
  ],
  'The Weeknd': [
    { title: 'Blinding Lights', url: 'https://archive.org/download/TheWeekndCollection/Blinding%20Lights.mp3' },
    { title: 'Starboy', url: 'https://archive.org/download/TheWeekndCollection/Starboy.mp3' },
    { title: 'Save Your Tears', url: 'https://archive.org/download/TheWeekndCollection/Save%20Your%20Tears.mp3' },
    { title: 'The Hills', url: 'https://archive.org/download/TheWeekndCollection/The%20Hills.mp3' },
    { title: 'Can\'t Feel My Face', url: 'https://archive.org/download/TheWeekndCollection/Can\'t%20Feel%20My%20Face.mp3' }
  ],
  'Ariana Grande': [
    { title: '7 Rings', url: 'https://archive.org/download/ArianaGrandeCollection/7%20Rings.mp3' },
    { title: 'Thank U Next', url: 'https://archive.org/download/ArianaGrandeCollection/Thank%20U%20Next.mp3' },
    { title: 'Side To Side', url: 'https://archive.org/download/ArianaGrandeCollection/Side%20To%20Side.mp3' },
    { title: 'Positions', url: 'https://archive.org/download/ArianaGrandeCollection/Positions.mp3' },
    { title: 'No Tears Left To Cry', url: 'https://archive.org/download/ArianaGrandeCollection/No%20Tears%20Left%20To%20Cry.mp3' }
  ],
};

const CATEGORIES = ['Pop', 'Romantic', 'Chill', 'Sad', 'Rock', 'Classical', 'Coke Studio', 'Party'];
const PLAYLIST_STORAGE_KEYS = ['musicverse_playlists', 'melodix_playlists'] as const;
const DEMO_AUDIO_SOURCES = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
];

const generateMockSongs = (): Song[] => {
  const songs: Song[] = [];

  for (let i = 1; i <= 200; i++) {
    const isEnglish = i <= 100;
    const artists = isEnglish ? DEMO_ENGLISH_ARTISTS : DEMO_URDU_ARTISTS;
    const artist = artists[Math.floor(Math.random() * artists.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const title = isEnglish ? `English Demo Track ${i}` : `Urdu Demo Track ${i - 100}`;
    const audioUrl = DEMO_AUDIO_SOURCES[(i - 1) % DEMO_AUDIO_SOURCES.length];
    
    songs.push({
      id: i,
      title: title,
      artist: artist,
      language: isEnglish ? 'English' : 'Urdu',
      category: category,
      cover: `https://picsum.photos/seed/${i + 100}/300/300`,
      audio: audioUrl,
      duration: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 50) + 10}`
    });
  }
  return songs;
};

const ALL_SONGS = generateMockSongs();

const readStoredPlaylists = (): Playlist[] => {
  if (typeof window === 'undefined') return [];

  for (const key of PLAYLIST_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) continue;

      const safePlaylists: Playlist[] = parsed
        .filter((p: any) => p && typeof p.id === 'string' && typeof p.name === 'string' && Array.isArray(p.songIds))
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          songIds: p.songIds.filter((id: any) => typeof id === 'number')
        }));

      return safePlaylists;
    } catch {
      // Ignore invalid JSON from old/broken local values and try next key.
    }
  }

  return [];
};

const writeStoredPlaylists = (nextPlaylists: Playlist[]) => {
  if (typeof window === 'undefined') return;
  const serialized = JSON.stringify(nextPlaylists);

  for (const key of PLAYLIST_STORAGE_KEYS) {
    try {
      localStorage.setItem(key, serialized);
    } catch {
      // Ignore storage write errors (private mode/quota); state still updates in memory.
    }
  }
};

const NAV_VIEWS: View[] = ['home', 'browse', 'english', 'pakistani', 'favorites', 'recently-played', 'playlists', 'about', 'features', 'contact'];
const VIEW_TITLES: Record<View, string> = {
  home: 'Home',
  browse: 'Browse Music',
  english: 'English Music',
  pakistani: 'Pakistani Music',
  favorites: 'Favorites',
  playlists: 'Playlists',
  search: 'Search',
  'recently-played': 'Recently Played',
  about: 'About',
  features: 'Features',
  contact: 'Contact',
  'player-full': 'Now Playing'
};
const HEADER_LINKS: Array<{ label: string; view: View }> = [
  { label: 'Home', view: 'home' },
  { label: 'Browse', view: 'browse' },
  { label: 'English', view: 'english' },
  { label: 'Pakistani', view: 'pakistani' },
  { label: 'Playlists', view: 'playlists' },
  { label: 'About', view: 'about' },
  { label: 'Features', view: 'features' },
  { label: 'Contact', view: 'contact' }
];

const isSongPlayable = (song: Song) => Boolean(song.audio && song.audio.trim().length > 0);
const FALLBACK_COVER = 'https://picsum.photos/seed/musicverse-cover-fallback/300/300';

const resolveCover = (cover: string) => {
  const safe = (cover || '').trim();
  return safe.length > 0 ? safe : FALLBACK_COVER;
};

const handleCoverImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const image = e.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = FALLBACK_COVER;
};

type ModalKind = 'info' | 'success' | 'error' | 'confirm';

interface AppModalState {
  isOpen: boolean;
  title: string;
  message: string;
  kind: ModalKind;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm?: () => void;
}

export default function App() {
  // State
  const [currentView, setCurrentView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('melodix_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('melodix_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [playlists, setPlaylists] = useState<Playlist[]>(readStoredPlaylists);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [spotifyUser, setSpotifyUser] = useState<any>(null);
  const [spotifySongs, setSpotifySongs] = useState<Song[]>([]);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('musicverse_theme') === 'light' ? 'light' : 'dark';
  });
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  const [appModal, setAppModal] = useState<AppModalState>({
    isOpen: false,
    title: '',
    message: '',
    kind: 'info',
    confirmLabel: 'OK',
    cancelLabel: 'Cancel'
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistNameInputRef = useRef<HTMLInputElement | null>(null);

  const openInfoModal = (title: string, message: string, kind: Exclude<ModalKind, 'confirm'> = 'info') => {
    setAppModal({
      isOpen: true,
      title,
      message,
      kind,
      confirmLabel: 'OK',
      cancelLabel: 'Cancel',
      onConfirm: undefined
    });
  };

  const openConfirmModal = (title: string, message: string, onConfirm: () => void, confirmLabel = 'Confirm') => {
    setAppModal({
      isOpen: true,
      title,
      message,
      kind: 'confirm',
      confirmLabel,
      cancelLabel: 'Cancel',
      onConfirm
    });
  };

  const closeAppModal = () => {
    setAppModal(prev => ({ ...prev, isOpen: false, onConfirm: undefined }));
  };

  const confirmAppModal = () => {
    const action = appModal.onConfirm;
    closeAppModal();
    action?.();
  };

  // Spotify Logic
  const checkSpotifyAuth = async () => {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        const data = await response.json();
        setSpotifyUser(data);
        setIsSpotifyConnected(true);
        fetchSpotifyInitialSongs();
      } else {
        setSpotifyUser(null);
        setIsSpotifyConnected(false);
      }
    } catch (error) {
      console.error("Spotify auth check failed", error);
      setSpotifyUser(null);
      setIsSpotifyConnected(false);
    }
  };

  const fetchSpotifyInitialSongs = async () => {
    const artists = [...ENGLISH_ARTISTS, ...PAKISTANI_ARTISTS].slice(0, 5);
    const allTracks: Song[] = [];
    
    for (const artist of artists) {
      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(artist)}`);
        if (response.ok) {
          const data = await response.json();
          const tracks = data.tracks.items
            .filter((t: any) => t.preview_url)
            .map((t: any, index: number) => ({
              id: 1000 + allTracks.length + index,
              title: t.name,
              artist: t.artists.map((a: any) => a.name).join(', '),
              language: ENGLISH_ARTISTS.includes(artist) ? 'English' : 'Urdu',
              category: 'Spotify',
              cover: t.album.images[0]?.url || `https://picsum.photos/seed/${t.id}/300/300`,
              audio: t.preview_url,
              duration: formatTime(t.duration_ms / 1000)
            }));
          allTracks.push(...tracks);
        }
      } catch (error) {
        console.error(`Failed to fetch tracks for ${artist}`, error);
      }
    }
    setSpotifySongs(allTracks);
  };

  const connectSpotify = async () => {
    try {
      const response = await fetch('/api/auth/url');
      if (!response.ok) {
        openInfoModal(
          'Spotify Setup Required',
          'Spotify login is not configured yet. Please check server environment variables and try again.',
          'error'
        );
        return;
      }

      const { url } = await response.json();
      const authWindow = window.open(url, 'spotify_auth', 'width=600,height=700');
      if (!authWindow) {
        openInfoModal('Popup Blocked', 'Please allow popups to connect Spotify.', 'error');
        return;
      }
      openInfoModal('Spotify Window Opened', 'Complete login in the popup window. MusicVerse will sync automatically after authorization.', 'success');
    } catch (error) {
      console.error("Failed to get Spotify auth URL", error);
      openInfoModal('Spotify Connection Failed', 'Could not start Spotify login right now. Please try again in a moment.', 'error');
    }
  };

  const logoutSpotify = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSpotifyUser(null);
      setIsSpotifyConnected(false);
      setSpotifySongs([]);
      openInfoModal('Spotify Disconnected', 'Your Spotify session has been disconnected successfully.', 'success');
    } catch (error) {
      console.error("Logout failed", error);
      openInfoModal('Logout Failed', 'Could not disconnect Spotify right now. Please try again.', 'error');
    }
  };

  const requestSpotifyLogout = () => {
    openConfirmModal(
      'Disconnect Spotify?',
      'You will need to connect again to sync Spotify previews and profile data.',
      () => {
        void logoutSpotify();
      },
      'Disconnect'
    );
  };

  useEffect(() => {
    checkSpotifyAuth();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        openInfoModal('Spotify Connected', 'Your Spotify account is now connected.', 'success');
        checkSpotifyAuth();
      }

      if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        openInfoModal('Spotify Login Failed', 'Authentication was not completed. Please try connecting again.', 'error');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const songsToDisplay = isSpotifyConnected && spotifySongs.length > 0 ? [...spotifySongs, ...ALL_SONGS] : ALL_SONGS;
  const playableSongs = songsToDisplay.filter(isSongPlayable);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    localStorage.setItem('musicverse_theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    const pageName = VIEW_TITLES[currentView] || 'MusicVerse';
    document.title = currentSong ? `${currentSong.title} - ${currentSong.artist} | MusicVerse` : `${pageName} | MusicVerse`;
  }, [currentView, currentSong]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('melodix_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('melodix_recent', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    if (!isCreatePlaylistModalOpen) return;
    const timer = window.setTimeout(() => playlistNameInputRef.current?.focus(), 10);
    return () => window.clearTimeout(timer);
  }, [isCreatePlaylistModalOpen]);

  // Audio Logic
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      // Small delay to ensure src is updated before play
      const playAudio = async () => {
        try {
          audioRef.current?.load();
          if (isPlaying) {
            await audioRef.current?.play();
          }
        } catch (e: any) {
          console.error("Playback failed:", e.message || "Unknown error");
          setIsPlaying(false);
        }
      };
      playAudio();
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.play().catch((e: any) => {
          console.error("Playback failed:", e.message || "Unknown error");
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlaySong = (song: Song) => {
    if (!isSongPlayable(song)) {
      openInfoModal('Preview Unavailable', 'This track preview is not available right now. You can play demo tracks or connect Spotify for additional previews.', 'info');
      return;
    }

    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(e => console.error("Play failed", e));
        setIsPlaying(true);
      }
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setShowPlayer(true);
      addToRecentlyPlayed(song.id);
    }
  };

  const addToRecentlyPlayed = (id: number) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(songId => songId !== id);
      return [id, ...filtered].slice(0, 10);
    });
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (!currentSong) return;
    if (playableSongs.length === 0) {
      openInfoModal('No Playable Tracks', 'No track previews are currently available to play.', 'info');
      return;
    }

    const currentIndex = playableSongs.findIndex(s => s.id === currentSong.id);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    let nextIndex = (safeIndex + 1 + playableSongs.length) % playableSongs.length;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playableSongs.length);
    }
    handlePlaySong(playableSongs[nextIndex]);
  };

  const handlePrev = () => {
    if (!currentSong) return;
    if (playableSongs.length === 0) {
      openInfoModal('No Playable Tracks', 'No track previews are currently available to play.', 'info');
      return;
    }

    const currentIndex = playableSongs.findIndex(s => s.id === currentSong.id);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const prevIndex = (safeIndex - 1 + playableSongs.length) % playableSongs.length;
    handlePlaySong(playableSongs[prevIndex]);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);

  const onLoadStart = () => {
    setIsLoading(true);
    console.log("Audio loading started:", currentSong?.title);
  };

  const onCanPlay = () => {
    setIsLoading(false);
    console.log("Audio can play:", currentSong?.title);
    if (isPlaying) {
      audioRef.current?.play().catch((e: any) => console.error("Play failed on canplay:", e.message || "Unknown error"));
    }
  };

  const onWaiting = () => {
    setIsLoading(true);
  };

  const onAudioError = (e: any) => {
    console.error("Audio error occurred");
    setIsPlaying(false);
  };

  const onEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNext();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setProgress(val);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSongs = songsToDisplay.filter(song => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      song.title.toLowerCase().includes(normalizedQuery) ||
      song.artist.toLowerCase().includes(normalizedQuery) ||
      song.category.toLowerCase().includes(normalizedQuery);
    
    if (currentView === 'english') return matchesSearch && song.language === 'English';
    if (currentView === 'pakistani') return matchesSearch && song.language === 'Urdu';
    if (currentView === 'favorites') return matchesSearch && favorites.includes(song.id);
    if (currentView === 'recently-played') return matchesSearch && recentlyPlayed.includes(song.id);
    if (currentView === 'playlists' && activePlaylist) return matchesSearch && activePlaylist.songIds.includes(song.id);
    
    return matchesSearch;
  });
  const featuredArtists = Array.from(new Set(ALL_SONGS.map(song => song.artist))).slice(0, 5);

  const siteKpis = [
    { label: 'Playable Previews', value: `${playableSongs.length}`, icon: <Music2 size={18} className="text-spotify-green" /> },
    { label: 'Curated Playlists', value: `${playlists.length}`, icon: <ListMusic size={18} className="text-spotify-green" /> },
    { label: 'Recent Sessions', value: `${recentlyPlayed.length}`, icon: <Clock size={18} className="text-spotify-green" /> },
    { label: 'Global Reach', value: '2 Languages', icon: <Globe size={18} className="text-spotify-green" /> }
  ];

  const createPlaylist = () => {
    setNewPlaylistName('');
    setIsCreatePlaylistModalOpen(true);
  };

  const closeCreatePlaylistModal = () => {
    setIsCreatePlaylistModalOpen(false);
    setNewPlaylistName('');
  };

  const handleCreatePlaylistSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = newPlaylistName.trim();

    if (!name) {
      openInfoModal('Playlist Name Required', 'Please enter a playlist name to continue.', 'error');
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songIds: []
    };

    setPlaylists(prev => {
      const next = [...prev, newPlaylist];
      writeStoredPlaylists(next);
      return next;
    });
    closeCreatePlaylistModal();
    openInfoModal('Playlist Created', `"${name}" playlist has been created.`, 'success');
  };

  const addToPlaylist = (playlistId: string, songId: number) => {
    setPlaylists(prev => {
      const next = prev.map(p => {
        if (p.id === playlistId) {
          if (p.songIds.includes(songId)) return p;
          return { ...p, songIds: [...p.songIds, songId] };
        }
        return p;
      });
      writeStoredPlaylists(next);
      return next;
    });
  };

  const removeFromPlaylist = (playlistId: string, songId: number) => {
    setPlaylists(prev => {
      const next = prev.map(p => {
        if (p.id === playlistId) {
          return { ...p, songIds: p.songIds.filter(id => id !== songId) };
        }
        return p;
      });
      writeStoredPlaylists(next);
      return next;
    });
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => {
      const next = prev.filter(p => p.id !== playlistId);
      writeStoredPlaylists(next);
      return next;
    });
    if (activePlaylist?.id === playlistId) {
      setActivePlaylist(null);
    }
  };

  const requestDeletePlaylist = (playlist: Playlist) => {
    openConfirmModal(
      'Delete Playlist?',
      `"${playlist.name}" will be permanently removed from your library.`,
      () => {
        deletePlaylist(playlist.id);
        openInfoModal('Playlist Deleted', `"${playlist.name}" has been removed.`, 'success');
      },
      'Delete'
    );
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    if (view !== 'playlists') {
      setActivePlaylist(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTopNav = (direction: -1 | 1) => {
    const currentIndex = NAV_VIEWS.indexOf(currentView);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (safeIndex + direction + NAV_VIEWS.length) % NAV_VIEWS.length;
    navigateTo(NAV_VIEWS[nextIndex]);
  };

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactStatus('Please fill all fields before sending your message.');
      return;
    }
    setContactStatus('Thanks for reaching out. We will respond within 24 hours.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="app-shell min-h-screen bg-spotify-black">
      <a href="#main-content" className="sr-only focus:not-sr-only fixed top-2 left-2 z-70 bg-spotify-green text-black px-3 py-2 rounded font-bold">Skip to content</a>
      <audio 
        ref={audioRef}
        src={currentSong?.audio}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onLoadStart={onLoadStart}
        onCanPlay={onCanPlay}
        onWaiting={onWaiting}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onError={onAudioError}
        preload="auto"
      />
      <header className="surface-panel fixed top-0 left-0 right-0 z-50 rounded">
        <div className="px-4 lg:px-6 py-2 max-w-340 mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigateTo('home')} className="flex items-center gap-2 min-w-fit">
              <span className="brand-mark w-9 h-9 rounded flex items-center justify-center text-xs font-black tracking-wider">MV</span>
              <span className="hidden sm:block text-left leading-tight">
                <span className="block text-base font-black tracking-tight">MusicVerse</span>
                <span className="block text-[11px] uppercase tracking-widest text-spotify-gray">Premium Streaming</span>
              </span>
            </button>

            <nav className="hidden 2xl:flex items-center gap-1 ml-1">
              {HEADER_LINKS.map(link => (
                <button
                  key={link.view}
                  onClick={() => navigateTo(link.view)}
                  className={`nav-link text-xs font-bold ${currentView === link.view ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="relative group hidden md:block flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-spotify-gray group-focus-within:text-current transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search songs, artists, categories"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-pill rounded py-2 pl-10 pr-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green/35 transition-all"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-1">
                <button onClick={() => handleTopNav(-1)} className="action-pill p-1.5 rounded transition-colors" title="Previous page">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => handleTopNav(1)} className="action-pill p-1.5 rounded transition-colors" title="Next page">
                  <ChevronRight size={18} />
                </button>
              </div>

              <button
                onClick={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
                className="theme-toggle p-2 rounded transition-all"
                aria-label="Toggle light mode"
                title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {themeMode === 'dark' ? <Sun size={17} /> : <MoonStar size={17} />}
              </button>

              {isSpotifyConnected ? (
                <div className="surface-card hidden lg:flex items-center gap-2 rounded py-1.5 px-3">
                  <img src={spotifyUser?.images?.[0]?.url || `https://ui-avatars.com/api/?name=${spotifyUser?.display_name}`} className="w-5 h-5 rounded" />
                  <span className="text-[11px] font-bold max-w-28 truncate">{spotifyUser?.display_name}</span>
                  <button onClick={requestSpotifyLogout} className="text-[10px] text-spotify-gray hover:text-current uppercase font-bold">Logout</button>
                </div>
              ) : (
                <button
                  onClick={connectSpotify}
                  className="action-pill hidden sm:inline-flex items-center gap-1.5 py-2 px-3 rounded text-xs font-bold"
                >
                  <PlayCircle size={14} />
                  Connect
                </button>
              )}

              <button onClick={createPlaylist} className="action-pill hidden sm:inline-flex px-3 py-2 rounded text-xs font-bold">Create</button>
            </div>
          </div>

          <div className="mt-2 md:hidden">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-spotify-gray" size={16} />
              <input
                type="text"
                placeholder="Search tracks and artists"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-pill rounded py-2 pl-9 pr-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green/35 transition-all"
              />
            </div>
          </div>

          <nav className="2xl:hidden mt-2 flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1">
            {HEADER_LINKS.map(link => (
              <button
                key={`mobile-${link.view}`}
                onClick={() => navigateTo(link.view)}
                className={`nav-link text-[11px] font-bold whitespace-nowrap ${currentView === link.view ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {appModal.isOpen && (
          <motion.div
            className="fixed inset-0 z-90 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAppModal}
          >
            <motion.div
              className="surface-panel w-full max-w-md rounded p-6 space-y-5"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <p className={`text-xs font-bold uppercase tracking-widest ${appModal.kind === 'error' ? 'text-red-300' : appModal.kind === 'success' ? 'text-emerald-300' : 'text-spotify-green'}`}>
                  {appModal.kind === 'confirm' ? 'Please Confirm' : 'Notification'}
                </p>
                <h3 className="text-2xl font-black leading-tight">{appModal.title}</h3>
                <p className="text-sm text-spotify-gray leading-relaxed">{appModal.message}</p>
              </div>
              <div className="flex justify-end gap-2">
                {appModal.kind === 'confirm' && (
                  <button
                    onClick={closeAppModal}
                    className="action-pill px-4 py-2 rounded text-sm font-bold"
                  >
                    {appModal.cancelLabel}
                  </button>
                )}
                <button
                  onClick={appModal.kind === 'confirm' ? confirmAppModal : closeAppModal}
                  className="bg-spotify-green text-black px-4 py-2 rounded text-sm font-bold"
                >
                  {appModal.confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreatePlaylistModalOpen && (
          <motion.div
            className="fixed inset-0 z-80 bg-black/55 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCreatePlaylistModal}
          >
            <motion.form
              className="surface-panel w-full max-w-md rounded p-6 space-y-5"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCreatePlaylistSubmit}
            >
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-spotify-green">New Playlist</p>
                <h3 className="text-2xl font-black leading-tight">Create Playlist</h3>
                <p className="text-sm text-spotify-gray leading-relaxed">Choose a name for your new playlist.</p>
              </div>

              <input
                ref={playlistNameInputRef}
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
                className="search-pill w-full rounded py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green/35 transition-all"
                maxLength={60}
              />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeCreatePlaylistModal} className="action-pill px-4 py-2 rounded text-sm font-bold">
                  Cancel
                </button>
                <button type="submit" className="bg-spotify-green text-black px-4 py-2 rounded text-sm font-bold">
                  Create Playlist
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" className="relative z-10 pt-24 md:pt-28">
        <div className={`custom-scrollbar px-4 lg:px-8 pt-2 ${currentSong && showPlayer ? 'pb-28' : 'pb-10'} max-w-330 mx-auto`}>
          {currentView !== 'player-full' && (
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {siteKpis.map(kpi => (
                <div key={kpi.label} className="kpi-card p-4 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] uppercase tracking-widest text-spotify-gray">{kpi.label}</p>
                    {kpi.icon}
                  </div>
                  <p className="text-xl font-black">{kpi.value}</p>
                </div>
              ))}
            </section>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 'home' && (
                <div className="space-y-16">
                  {searchQuery && (
                    <div className="surface-card p-4 rounded flex items-center justify-between">
                      <div>
                        <p className="text-sm text-spotify-gray">Searching for</p>
                        <p className="font-bold text-lg">"{searchQuery}"</p>
                      </div>
                      <div>
                        <p className="text-sm text-spotify-gray">Results found</p>
                        <p className="font-bold text-2xl">{filteredSongs.length}</p>
                      </div>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="action-pill px-4 py-2 rounded text-sm font-bold"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
                  <section className="hero-banner relative overflow-hidden rounded p-8 md:p-16 border border-white/10 shadow-2xl shadow-black/20">
                    <div className="relative z-10 max-w-3xl">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="inline-block px-4 py-1 rounded bg-spotify-green/10 text-spotify-green text-xs font-bold uppercase tracking-widest mb-6 border border-spotify-green/20">
                          Premium Music Experience
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
                          Stream English & Pakistani Music Anytime
                        </h1>
                        <p className="text-lg md:text-xl text-slate-900 mb-10 font-medium leading-relaxed">
                          MusicVerse is a professional web-based music streaming platform. Explore, search, and play music from diverse cultures, featuring high-quality audio and a seamless interface.
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <button 
                            onClick={() => navigateTo('browse')}
                            className="bg-spotify-green text-black font-bold py-4 px-10 rounded text-lg hover:scale-105 transition-transform shadow-xl shadow-spotify-green/20"
                          >
                            Explore Music
                          </button>
                          <button 
                            onClick={() => playableSongs[0] ? handlePlaySong(playableSongs[0]) : openInfoModal('No Playable Tracks', 'Connect Spotify to load real track previews.', 'info')}
                            className="action-pill border-2 text-current font-bold py-4 px-10 rounded text-lg transition-colors"
                          >
                            Start Listening
                          </button>
                        </div>
                      </motion.div>
                    </div>
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
                       <Headphones size={500} className="text-white absolute -right-20 -top-20 rotate-12" />
                    </div>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { title: 'Global Library', desc: 'Access over 200+ songs from top English and Pakistani artists.', icon: <Globe size={32} /> },
                      { title: 'Smart Search', desc: 'Find your favorite tracks instantly by artist, title, or genre.', icon: <Search size={32} /> },
                      { title: 'Custom Playlists', desc: 'Organize your music exactly how you like it with our intuitive system.', icon: <ListMusic size={32} /> }
                    ].map((feature, i) => (
                      <motion.div 
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="surface-card p-8 rounded hover:-translate-y-0.75 transition-all"
                      >
                        <div className="text-spotify-green mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-spotify-gray text-sm leading-relaxed">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </section>

                  <section className="space-y-12 py-12">
                    <div className="text-center space-y-4">
                      <h2 className="text-4xl font-black">How MusicVerse Works</h2>
                      <p className="text-spotify-gray max-w-2xl mx-auto">Our platform is designed to give you the best listening experience with minimal effort.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {[
                        { step: '01', title: 'Connect', desc: 'Sign in with your Spotify account to sync your favorite hits.' },
                        { step: '02', title: 'Explore', desc: 'Browse our extensive library of English and Pakistani tracks.' },
                        { step: '03', title: 'Curate', desc: 'Create custom playlists for every mood and occasion.' },
                        { step: '04', title: 'Listen', desc: 'Enjoy high-quality audio streaming on any device.' }
                      ].map((item, i) => (
                        <div key={item.step} className="surface-card relative p-8 rounded group hover:border-spotify-green/30 transition-colors">
                          <span className="text-6xl font-black text-white/5 absolute top-4 right-4 group-hover:text-spotify-green/10 transition-colors">{item.step}</span>
                          <h3 className="text-xl font-bold mb-3 relative z-10">{item.title}</h3>
                          <p className="text-sm text-spotify-gray leading-relaxed relative z-10">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-3xl font-bold mb-6">Good evening</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredSongs.length === 0 && searchQuery ? (
                        <div className="col-span-full surface-card p-12 rounded text-center">
                          <Search size={48} className="mx-auto mb-4 text-spotify-gray" />
                          <p className="text-lg font-bold mb-2">No songs match "{searchQuery}"</p>
                          <p className="text-sm text-spotify-gray mb-4">Try different keywords or browse all music</p>
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="action-pill px-6 py-2 rounded text-sm font-bold"
                          >
                            Clear Search
                          </button>
                        </div>
                      ) : (
                        filteredSongs.slice(0, 6).map(song => (
                          <QuickPlayCard 
                            key={song.id} 
                            song={song} 
                            isActive={currentSong?.id === song.id}
                            isPlaying={currentSong?.id === song.id && isPlaying}
                            isLoading={currentSong?.id === song.id && isLoading}
                            onPlay={() => handlePlaySong(song)}
                          />
                        ))
                      )}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold mb-6">Featured Artists</h2>
                    <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                      {featuredArtists.map(artist => (
                        <button key={artist} type="button" className="shrink-0 group cursor-pointer text-left" onClick={() => { setSearchQuery(artist); navigateTo('browse'); }}>
                          <div className="w-40 h-40 rounded overflow-hidden mb-3 shadow-lg group-hover:shadow-spotify-green/20 transition-all">
                            <img src={`https://picsum.photos/seed/${artist}/300/300`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                          </div>
                          <p className="text-center font-bold group-hover:text-spotify-green transition-colors">{artist}</p>
                        </button>
                      ))}
                    </div>
                  </section>

                  {isSpotifyConnected && spotifySongs.length > 0 && (
                    <SongSection 
                      title="Spotify Hits" 
                      songs={spotifySongs.slice(0, 8)} 
                      onPlay={handlePlaySong}
                      onShowAll={() => { setSearchQuery('Spotify'); navigateTo('browse'); }}
                      currentSongId={currentSong?.id}
                      isPlaying={isPlaying}
                    />
                  )}

                  <SongSection 
                    title="Recently Played" 
                    songs={filteredSongs.filter(s => recentlyPlayed.includes(s.id))} 
                    onPlay={handlePlaySong}
                    onShowAll={() => navigateTo('recently-played')}
                    currentSongId={currentSong?.id}
                    isPlaying={isPlaying}
                  />

                  <SongSection 
                    title="Pakistani Pop Hits" 
                    songs={filteredSongs.filter(s => s.language === 'Urdu' && s.category === 'Pop').slice(0, 8)} 
                    onPlay={handlePlaySong}
                    onShowAll={() => { setSearchQuery('Pop'); navigateTo('pakistani'); }}
                    currentSongId={currentSong?.id}
                    isPlaying={isPlaying}
                  />

                  <SongSection 
                    title="English Pop" 
                    songs={filteredSongs.filter(s => s.language === 'English' && s.category === 'Pop').slice(0, 8)} 
                    onPlay={handlePlaySong}
                    onShowAll={() => { setSearchQuery('Pop'); navigateTo('english'); }}
                    currentSongId={currentSong?.id}
                    isPlaying={isPlaying}
                  />

                  <section className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold">Fresh Editorial Picks</h2>
                      <button onClick={() => navigateTo('browse')} className="action-pill px-4 py-2 rounded text-sm font-bold">Discover More</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { title: 'Sunset Drive', desc: 'A balanced mix for evening focus and smooth road sessions.', cta: 'Open Playlist', view: 'playlists' as View },
                        { title: 'Gym Boost', desc: 'High-energy tracks selected for workout tempo consistency.', cta: 'Browse Tracks', view: 'browse' as View },
                        { title: 'Urdu Soul', desc: 'Classic and modern Urdu vocals for relaxed listening.', cta: 'Play Urdu', view: 'pakistani' as View }
                      ].map(item => (
                        <div key={item.title} className="surface-card p-6 rounded space-y-4">
                          <h3 className="text-xl font-bold">{item.title}</h3>
                          <p className="text-spotify-gray text-sm">{item.desc}</p>
                          <button onClick={() => navigateTo(item.view)} className="bg-spotify-green text-black text-sm font-bold px-4 py-2 rounded">
                            {item.cta}
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  <Footer onNavigate={setCurrentView} onOpenExternal={openExternal} />
                </div>
              )}

              {currentView === 'about' && (
                <div className="max-w-4xl mx-auto space-y-12 py-8">
                  <header className="text-center space-y-4">
                    <h1 className="text-5xl font-black">What is MusicVerse?</h1>
                    <p className="text-xl text-spotify-gray max-w-2xl mx-auto">
                      MusicVerse is a web-based music streaming platform that allows users to explore, search, and play music from different cultures including English and Pakistani music.
                    </p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="surface-card p-8 rounded">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Globe className="text-spotify-green" /> Our Mission
                      </h2>
                      <p className="text-spotify-gray leading-relaxed">
                        We believe music is a universal language. MusicVerse bridges the gap between Western pop and Eastern melodies, providing a seamless experience for fans of both worlds.
                      </p>
                    </div>
                    <div className="surface-card p-8 rounded">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Headphones className="text-spotify-green" /> High Quality
                      </h2>
                      <p className="text-spotify-gray leading-relaxed">
                        Streaming platforms often provide search, playlists, and playback features so users can easily find and organize music. We take it a step further with curated collections.
                      </p>
                    </div>
                  </div>

                  <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-center">Key Highlights</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        { label: '200+ Songs', icon: <Music2 /> },
                        { label: 'Multi-Language', icon: <Globe /> },
                        { label: 'Built-in Player', icon: <PlayCircle /> },
                        { label: 'Custom Playlists', icon: <ListMusic /> },
                        { label: 'Smart Search', icon: <Search /> }
                      ].map(item => (
                        <div key={item.label} className="surface-card p-6 rounded text-center flex flex-col items-center gap-3">
                          <div className="text-spotify-green">{item.icon}</div>
                          <span className="text-sm font-bold">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="surface-card p-8 rounded space-y-6">
                    <h2 className="text-3xl font-bold">Our Story Timeline</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { year: '2023', title: 'Concept', desc: 'MusicVerse started with a goal to bridge international and regional music scenes.' },
                        { year: '2024', title: 'Launch', desc: 'We shipped our first playable web platform with personalized favorites and playlists.' },
                        { year: '2026', title: 'Growth', desc: 'Now serving music discovery, playlist creation, and cross-genre recommendations.' }
                      ].map(item => (
                        <div key={item.year} className="border border-white/10 p-5 rounded space-y-2">
                          <span className="text-spotify-green font-bold text-sm">{item.year}</span>
                          <h3 className="font-bold text-lg">{item.title}</h3>
                          <p className="text-spotify-gray text-sm">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                  <Footer onNavigate={setCurrentView} onOpenExternal={openExternal} />
                </div>
              )}

              {currentView === 'features' && (
                <div className="max-w-5xl mx-auto space-y-16 py-8">
                  <header className="text-center space-y-4">
                    <h1 className="text-5xl font-black">Platform Features</h1>
                    <p className="text-xl text-spotify-gray">Everything you need for the perfect listening experience.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="surface-card flex items-start gap-4 p-5 rounded">
                        <div className="bg-spotify-green/10 p-3 rounded text-spotify-green">
                          <PlayCircle size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">Advanced Music Player</h3>
                          <p className="text-spotify-gray">Full control over your playback with Play/Pause, Next/Previous, Shuffle, and Repeat modes. Precise volume control and interactive progress bar.</p>
                        </div>
                      </div>
                      <div className="surface-card flex items-start gap-4 p-5 rounded">
                        <div className="bg-spotify-green/10 p-3 rounded text-spotify-green">
                          <Compass size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">Music Library</h3>
                          <p className="text-spotify-gray">Browse songs by Language, Genre, Artist, or Playlist. Our library is categorized to help you find exactly what you're in the mood for.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="surface-card flex items-start gap-4 p-5 rounded">
                        <div className="bg-spotify-green/10 p-3 rounded text-spotify-green">
                          <SearchCode size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">Smart Search System</h3>
                          <p className="text-spotify-gray">Search songs instantly by Artist, Song title, or Category. Our real-time search ensures you never miss a beat.</p>
                        </div>
                      </div>
                      <div className="surface-card flex items-start gap-4 p-5 rounded">
                        <div className="bg-spotify-green/10 p-3 rounded text-spotify-green">
                          <ListMusic size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">Custom Playlist System</h3>
                          <p className="text-spotify-gray">Users can create playlists, add or remove songs, and save them for later. Music services commonly allow users to organize tracks easily.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <section className="surface-card p-8 rounded space-y-6">
                    <h2 className="text-3xl font-bold">More Capabilities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        'Cross-language discovery engine',
                        'Daily refreshed content rails',
                        'Responsive player controls',
                        'Persistent personalization settings'
                      ].map(point => (
                        <div key={point} className="border border-white/10 p-4 rounded text-sm text-spotify-gray">
                          {point}
                        </div>
                      ))}
                    </div>
                  </section>
                  <Footer onNavigate={setCurrentView} onOpenExternal={openExternal} />
                </div>
              )}

              {currentView === 'contact' && (
                <div className="max-w-4xl mx-auto py-12 space-y-8">
                  <div className="surface-panel p-10 rounded shadow-2xl">
                    <h1 className="text-4xl font-black mb-2">Get in Touch</h1>
                    <p className="text-spotify-gray mb-8">Have questions or feedback? We'd love to hear from you.</p>
                    
                    <form className="space-y-6" onSubmit={handleContactSubmit}>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-spotify-gray">Full Name</label>
                        <input
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          className="search-pill w-full rounded py-3 px-4 focus:ring-2 focus:ring-spotify-green outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-spotify-gray">Email Address</label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          className="search-pill w-full rounded py-3 px-4 focus:ring-2 focus:ring-spotify-green outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-spotify-gray">Message</label>
                        <textarea
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          className="search-pill w-full rounded py-3 px-4 focus:ring-2 focus:ring-spotify-green outline-none transition-all resize-none"
                          placeholder="Your message here..."
                        ></textarea>
                      </div>
                      {contactStatus && <p aria-live="polite" className="text-sm text-spotify-green font-medium">{contactStatus}</p>}
                      <button type="submit" className="w-full bg-spotify-green text-black font-black py-4 rounded hover:scale-[1.02] transition-transform">
                        Send Message
                      </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/10 flex justify-center gap-8">
                      <button onClick={() => openExternal('https://music.youtube.com')} className="text-spotify-gray hover:text-current transition-colors"><Globe size={24} /></button>
                      <button onClick={() => openExternal('mailto:support@musicverse.app')} className="text-spotify-gray hover:text-current transition-colors"><Mail size={24} /></button>
                      <button onClick={() => openExternal('https://open.spotify.com')} className="text-spotify-gray hover:text-current transition-colors"><ExternalLink size={24} /></button>
                    </div>
                  </div>

                  <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'Support Hours', value: 'Mon-Sat, 9 AM to 8 PM' },
                      { title: 'Average Response', value: 'Under 24 hours' },
                      { title: 'Primary Channel', value: 'Email + in-app contact' }
                    ].map(item => (
                      <div key={item.title} className="surface-card p-5 rounded">
                        <p className="text-xs uppercase tracking-widest text-spotify-gray">{item.title}</p>
                        <p className="text-sm font-bold mt-2">{item.value}</p>
                      </div>
                    ))}
                  </section>
                  <Footer onNavigate={setCurrentView} onOpenExternal={openExternal} />
                </div>
              )}

              {currentView === 'browse' && (
                <div className="space-y-12">
                  {searchQuery && (
                    <div className="surface-card p-4 rounded flex items-center justify-between">
                      <div>
                        <p className="text-sm text-spotify-gray">Searching for</p>
                        <p className="font-bold text-lg">"{searchQuery}"</p>
                      </div>
                      <div>
                        <p className="text-sm text-spotify-gray">Results found</p>
                        <p className="font-bold text-2xl">{filteredSongs.length}</p>
                      </div>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="action-pill px-4 py-2 rounded text-sm font-bold"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
                  <header>
                    <h1 className="text-5xl font-black mb-4">Browse Music</h1>
                    <p className="text-spotify-gray text-lg">Explore our vast collection of English and Pakistani hits.</p>
                  </header>

                  <section className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold">English Music</h2>
                      <button onClick={() => navigateTo('english')} className="text-sm font-bold text-spotify-gray hover:text-current uppercase tracking-widest">Show all</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {['Pop', 'Chill', 'Workout', 'Party'].map(cat => (
                        <button type="button" key={cat} className="surface-card bg-linear-to-br from-blue-600/60 to-cyan-600/35 p-6 rounded h-40 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform text-left" onClick={() => { setActiveCategory(cat); navigateTo('english'); }}>
                          <h3 className="text-2xl font-bold">{cat}</h3>
                          <Music2 className="absolute -right-4 -bottom-4 opacity-20 rotate-12" size={100} />
                        </button>
                      ))}
                    </div>
                    <SongSection 
                      title="Top English Artists" 
                      songs={filteredSongs.filter(s => s.language === 'English').slice(0, 8)} 
                      onPlay={handlePlaySong}
                      onShowAll={() => navigateTo('english')}
                      currentSongId={currentSong?.id}
                      isPlaying={isPlaying}
                    />
                  </section>

                  <section className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold">Pakistani / Urdu Music</h2>
                      <button onClick={() => navigateTo('pakistani')} className="text-sm font-bold text-spotify-gray hover:text-current uppercase tracking-widest">Show all</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {['Coke Studio', 'Romantic', 'Sad', 'Rock'].map(cat => (
                        <button type="button" key={cat} className="surface-card bg-linear-to-br from-emerald-600/60 to-teal-600/35 p-6 rounded h-40 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform text-left" onClick={() => { setActiveCategory(cat); navigateTo('pakistani'); }}>
                          <h3 className="text-2xl font-bold">{cat}</h3>
                          <Mic2 className="absolute -right-4 -bottom-4 opacity-20 rotate-12" size={100} />
                        </button>
                      ))}
                    </div>
                    <SongSection 
                      title="Top Pakistani Artists" 
                      songs={filteredSongs.filter(s => s.language === 'Urdu').slice(0, 8)} 
                      onPlay={handlePlaySong}
                      onShowAll={() => navigateTo('pakistani')}
                      currentSongId={currentSong?.id}
                      isPlaying={isPlaying}
                    />
                  </section>

                  <section className="surface-card p-8 rounded space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold">Mood Explorer</h2>
                      <button onClick={() => setSearchQuery('Chill')} className="action-pill px-4 py-2 rounded text-sm font-bold">Set Chill Mood</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Road Trip', 'Focus', 'Late Night', 'Weekend Party'].map(mood => (
                        <button
                          key={mood}
                          onClick={() => { setSearchQuery(mood.split(' ')[0]); navigateTo('browse'); }}
                          className="surface-panel p-4 rounded text-left font-bold hover:bg-spotify-light/35 transition-colors"
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </section>
                  <Footer onNavigate={setCurrentView} onOpenExternal={openExternal} />
                </div>
              )}

              {(currentView === 'english' || currentView === 'pakistani' || currentView === 'favorites' || currentView === 'recently-played') && (
                <div>
                  <div className="flex items-end gap-6 mb-8">
                    <div className="surface-card w-52 h-52 shadow-2xl shadow-black/30 bg-linear-to-br from-blue-600/70 to-cyan-600/60 flex items-center justify-center rounded">
                      {currentView === 'favorites' ? <Heart size={80} fill="white" /> : <Music2 size={80} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Playlist</p>
                      <h1 className="text-7xl font-black mt-2 mb-4 capitalize">
                        {currentView.replace('-', ' ')}
                      </h1>
                      <p className="text-spotify-gray text-sm font-medium">
                        {filteredSongs.length} songs
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="surface-card p-4 rounded">
                      <p className="text-xs uppercase tracking-widest text-spotify-gray">Visible Songs</p>
                      <p className="text-2xl font-black mt-1">{filteredSongs.length}</p>
                    </div>
                    <div className="surface-card p-4 rounded">
                      <p className="text-xs uppercase tracking-widest text-spotify-gray">Favorites Total</p>
                      <p className="text-2xl font-black mt-1">{favorites.length}</p>
                    </div>
                    <div className="surface-card p-4 rounded">
                      <p className="text-xs uppercase tracking-widest text-spotify-gray">Recently Played</p>
                      <p className="text-2xl font-black mt-1">{recentlyPlayed.length}</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-spotify-gray text-xs uppercase tracking-widest border-b border-white/10">
                          <th className="pb-3 w-12 text-center">#</th>
                          <th className="pb-3">Title</th>
                          <th className="pb-3">Album / Category</th>
                          <th className="pb-3 text-center"><Clock size={16} className="mx-auto" /></th>
                          <th className="pb-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSongs.length === 0 ? (
                          <EmptyTableState
                            message={searchQuery ? `No songs match "${searchQuery}"` : "No songs matched this section yet."}
                            actionLabel={searchQuery ? "Clear Search" : "Browse Music"}
                            onAction={() => searchQuery ? setSearchQuery('') : navigateTo('browse')}
                          />
                        ) : (
                          filteredSongs.map((song, index) => (
                            <SongRow 
                              key={song.id} 
                              song={song} 
                              index={index + 1}
                              isActive={currentSong?.id === song.id}
                              isPlaying={currentSong?.id === song.id && isPlaying}
                              isLoading={currentSong?.id === song.id && isLoading}
                              isFavorite={favorites.includes(song.id)}
                              onPlay={() => handlePlaySong(song)}
                              onFavorite={() => toggleFavorite(song.id)}
                              playlists={playlists}
                              onAddToPlaylist={addToPlaylist}
                            />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Footer onNavigate={setCurrentView} onOpenExternal={openExternal} />
                </div>
              )}

              {currentView === 'playlists' && activePlaylist ? (
                <div>
                  <div className="flex items-end gap-6 mb-8">
                    <div className="surface-card w-52 h-52 shadow-2xl shadow-black/30 bg-linear-to-br from-emerald-600/70 to-lime-700/60 flex items-center justify-center rounded">
                      <ListMusic size={80} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Playlist</p>
                      <h1 className="text-7xl font-black mt-2 mb-4">
                        {activePlaylist.name}
                      </h1>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setActivePlaylist(null)}
                          className="text-spotify-gray hover:text-white text-sm font-bold"
                        >
                          Back to all playlists
                        </button>
                        <span className="text-spotify-gray">•</span>
                        <button
                          onClick={() => requestDeletePlaylist(activePlaylist)}
                          className="text-red-300 hover:text-red-200 text-sm font-bold"
                        >
                          Delete playlist
                        </button>
                        <span className="text-spotify-gray">•</span>
                        <p className="text-spotify-gray text-sm font-medium">
                          {filteredSongs.length} songs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-spotify-gray text-xs uppercase tracking-widest border-b border-white/10">
                          <th className="pb-3 w-12 text-center">#</th>
                          <th className="pb-3">Title</th>
                          <th className="pb-3">Album / Category</th>
                          <th className="pb-3 text-center"><Clock size={16} className="mx-auto" /></th>
                          <th className="pb-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSongs.length === 0 ? (
                          <EmptyTableState
                            message={searchQuery ? `No songs in this playlist match "${searchQuery}"` : "This playlist has no songs yet."}
                            actionLabel={searchQuery ? "Clear Search" : "Go To Library"}
                            onAction={() => searchQuery ? setSearchQuery('') : navigateTo('browse')}
                          />
                        ) : (
                          filteredSongs.map((song, index) => (
                            <SongRow 
                              key={song.id} 
                              song={song} 
                              index={index + 1}
                              isActive={currentSong?.id === song.id}
                              isPlaying={currentSong?.id === song.id && isPlaying}
                              isLoading={currentSong?.id === song.id && isLoading}
                              isFavorite={favorites.includes(song.id)}
                              onPlay={() => handlePlaySong(song)}
                              onFavorite={() => toggleFavorite(song.id)}
                              playlists={playlists}
                              onAddToPlaylist={addToPlaylist}
                            />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="surface-card p-5 rounded mt-8">
                    <h3 className="font-bold text-lg mb-2">Playlist Tips</h3>
                    <p className="text-spotify-gray text-sm">Use the three-dot menu beside any song in library tables to add tracks to this playlist. You can keep building mood-specific playlists for workouts, focus sessions, and evening listening.</p>
                  </div>
                  <Footer onNavigate={setCurrentView} onOpenExternal={openExternal} />
                </div>
              ) : currentView === 'playlists' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Your Playlists</h2>
                    <button 
                      onClick={createPlaylist}
                      className="bg-spotify-green text-black font-bold py-2 px-6 rounded text-sm hover:scale-105 transition-transform"
                    >
                      New Playlist
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {playlists.map(p => (
                      <div key={p.id} className="surface-card p-4 rounded transition-colors group hover:-translate-y-0.5 space-y-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePlaylist(p);
                            navigateTo('playlists');
                            setSearchQuery('');
                          }}
                          className="w-full text-left"
                        >
                          <div className="aspect-square bg-spotify-dark rounded mb-4 flex items-center justify-center shadow-lg">
                            <ListMusic size={60} className="text-spotify-gray" />
                          </div>
                          <h3 className="font-bold truncate">{p.name}</h3>
                          <p className="text-spotify-gray text-sm">{p.songIds.length} songs</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDeletePlaylist(p)}
                          className="w-full action-pill py-2 rounded text-xs font-bold text-red-300 hover:text-red-200"
                        >
                          Remove Playlist
                        </button>
                      </div>
                    ))}
                  </div>
                  {playlists.length === 0 && (
                    <div className="surface-card p-6 rounded">
                      <h3 className="text-xl font-bold mb-2">No playlists yet</h3>
                      <p className="text-spotify-gray text-sm mb-4">Create your first playlist and start collecting your favorite songs from any section.</p>
                      <button onClick={createPlaylist} className="bg-spotify-green text-black font-bold px-4 py-2 rounded">Create Your First Playlist</button>
                    </div>
                  )}
                </div>
              )}
              {currentView === 'player-full' && currentSong && (
                <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto py-12 px-6">
                  <div className="w-full flex justify-between items-center mb-12">
                    <button onClick={() => navigateTo('home')} className="action-pill p-2 rounded transition-colors">
                      <ChevronLeft size={32} />
                    </button>
                    <div className="text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-spotify-gray">Playing from</p>
                      <p className="font-bold">{currentSong.category}</p>
                    </div>
                    <button onClick={() => navigateTo('playlists')} className="action-pill p-2 rounded transition-colors" title="Open playlists">
                      <MoreHorizontal size={32} />
                    </button>
                  </div>

                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="aspect-square rounded overflow-hidden shadow-2xl shadow-black/80">
                      <img src={resolveCover(currentSong.cover)} onError={handleCoverImageError} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="space-y-8">
                      <div>
                        <h1 className="text-5xl font-black mb-2">{currentSong.title}</h1>
                        <p className="text-2xl text-spotify-gray font-medium">{currentSong.artist}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <button onClick={() => toggleFavorite(currentSong.id)} className={favorites.includes(currentSong.id) ? "text-spotify-green" : "text-spotify-gray hover:text-white"}>
                            <Heart size={32} fill={favorites.includes(currentSong.id) ? "currentColor" : "none"} />
                          </button>
                          <div className="flex items-center gap-6">
                            <button onClick={() => setIsShuffle(!isShuffle)} className={isShuffle ? "text-spotify-green" : "text-spotify-gray hover:text-white"}>
                              <Shuffle size={24} />
                            </button>
                            <button onClick={() => setIsRepeat(!isRepeat)} className={isRepeat ? "text-spotify-green" : "text-spotify-gray hover:text-white"}>
                              <Repeat size={24} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="h-1.5 w-full bg-spotify-light/45 rounded overflow-hidden group cursor-pointer" onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const pct = x / rect.width;
                            if (audioRef.current) audioRef.current.currentTime = pct * audioRef.current.duration;
                          }}>
                            <div className="h-full bg-spotify-green group-hover:bg-spotify-green/80 transition-all" style={{ width: `${(progress / duration) * 100}%` }} />
                          </div>
                          <div className="flex justify-between text-xs font-medium text-spotify-gray">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-10">
                          <button onClick={handlePrev} className="text-white hover:scale-110 transition-transform">
                            <SkipBack size={48} fill="currentColor" />
                          </button>
                          <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-20 h-20 bg-white rounded flex items-center justify-center text-black hover:scale-105 transition-transform shadow-xl"
                          >
                            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                          </button>
                          <button onClick={handleNext} className="text-white hover:scale-110 transition-transform">
                            <SkipForward size={48} fill="currentColor" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <section className="w-full surface-card p-5 rounded mt-10">
                    <h3 className="text-xl font-bold mb-4">Up Next</h3>
                    <div className="space-y-3">
                      {playableSongs.filter(song => song.id !== currentSong.id).slice(0, 3).map(song => (
                        <button
                          key={song.id}
                          onClick={() => handlePlaySong(song)}
                          className="w-full flex items-center justify-between p-3 rounded hover:bg-spotify-light/35 transition-colors"
                        >
                          <span className="font-medium text-left">{song.title}</span>
                          <span className="text-xs text-spotify-gray">{song.artist}</span>
                        </button>
                      ))}
                      {playableSongs.filter(song => song.id !== currentSong.id).length === 0 && (
                        <p className="text-sm text-spotify-gray">No additional playable previews available right now.</p>
                      )}
                    </div>
                  </section>
                  <Footer onNavigate={setCurrentView} onOpenExternal={openExternal} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Player */}
        <AnimatePresence>
          {currentSong && showPlayer && (
            <motion.footer 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="footer-shell fixed bottom-0 left-0 right-0 px-4 py-3 z-50"
            >
              <div className="surface-panel max-w-330 mx-auto px-4 py-3 rounded flex items-center justify-between gap-4 relative">
                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setShowPlayer(false);
                    if (audioRef.current) {
                      audioRef.current.pause();
                    }
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-spotify-dark border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-colors z-10"
                  title="Close player"
                >
                  <X size={14} />
                </button>
                
                {/* Current Song Info */}
                <div className="flex items-center gap-4 w-1/2 sm:w-1/3">
                  <img 
                    src={resolveCover(currentSong.cover)} 
                    onError={handleCoverImageError}
                    alt={currentSong.title} 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded shadow-lg cursor-pointer hover:scale-105 transition-transform shrink-0"
                    referrerPolicy="no-referrer"
                    onClick={() => setCurrentView('player-full')}
                  />
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-sm font-bold hover:underline cursor-pointer truncate" role="status">{currentSong.title}</h4>
                    <p className="text-xs text-spotify-gray hover:underline cursor-pointer truncate">{currentSong.artist}</p>
                  </div>
                  <button 
                    onClick={() => toggleFavorite(currentSong.id)}
                    className={`ml-2 transition-colors hidden sm:block ${favorites.includes(currentSong.id) ? 'text-spotify-green' : 'text-spotify-gray hover:text-white'}`}
                  >
                    <Heart size={18} fill={favorites.includes(currentSong.id) ? "currentColor" : "none"} />
                  </button>
                </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 w-1/2 sm:w-1/3">
            <div className="flex items-center gap-4 sm:gap-6">
              <button 
                onClick={() => setIsShuffle(!isShuffle)}
                className={`transition-colors hidden sm:block ${isShuffle ? 'text-spotify-green' : 'text-spotify-gray hover:text-white'}`}
              >
                <Shuffle size={18} />
              </button>
              <button onClick={handlePrev} className="text-spotify-gray hover:text-white transition-colors">
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button 
                onClick={() => currentSong && setIsPlaying(!isPlaying)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded flex items-center justify-center text-black hover:scale-105 transition-transform disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded animate-spin"></div>
                ) : isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" className="ml-0.5" />
                )}
              </button>
              <button onClick={handleNext} className="text-spotify-gray hover:text-white transition-colors">
                <SkipForward size={20} fill="currentColor" />
              </button>
              <button 
                onClick={() => setIsRepeat(!isRepeat)}
                className={`transition-colors hidden sm:block ${isRepeat ? 'text-spotify-green' : 'text-spotify-gray hover:text-white'}`}
              >
                <Repeat size={18} />
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-2 w-full max-w-md">
              <span className="text-[10px] text-spotify-gray w-10 text-right">{formatTime(progress)}</span>
              <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                value={progress}
                onChange={handleSeek}
                className="flex-1 h-1 bg-spotify-light/80 rounded appearance-none cursor-pointer accent-white hover:accent-spotify-green transition-all"
              />
              <span className="text-[10px] text-spotify-gray w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume & Extra */}
          <div className="hidden sm:flex items-center justify-end gap-4 w-1/3">
            <button onClick={() => navigateTo('playlists')} className="text-spotify-gray hover:text-white transition-colors" title="Open playlists">
              <ListMusic size={18} />
            </button>
            <div className="flex items-center gap-2 group">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="text-spotify-gray hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-24 h-1 bg-spotify-light/80 rounded appearance-none cursor-pointer accent-white hover:accent-spotify-green transition-all"
              />
            </div>
          </div>
              </div>
            </motion.footer>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

interface QuickPlayCardProps {
  key?: React.Key;
  song: Song;
  isActive: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: () => void;
}

function QuickPlayCard({ song, isPlaying, isLoading, isActive, onPlay }: QuickPlayCardProps) {
  const playable = isSongPlayable(song);

  return (
    <div className={`surface-card flex items-center gap-4 transition-all rounded overflow-hidden group ${playable ? 'hover:scale-[1.01] cursor-pointer' : 'opacity-80 cursor-not-allowed'}`}>
      <img src={resolveCover(song.cover)} onError={handleCoverImageError} alt={song.title} className="w-20 h-20 object-cover" referrerPolicy="no-referrer" />
      <div className="flex-1 flex items-center justify-between pr-4">
        <div className="min-w-0">
          <span className="font-bold truncate block">{song.title}</span>
          {!playable && <span className="text-[11px] text-spotify-gray">Preview unavailable</span>}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
          className={`w-12 h-12 bg-spotify-green rounded flex items-center justify-center text-black shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all ${isPlaying ? 'opacity-100 translate-y-0' : ''}`}
          disabled={!playable || (isActive && isLoading)}
        >
          {isActive && isLoading ? (
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded animate-spin"></div>
          ) : isPlaying ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" className="ml-1" />
          )}
        </button>
      </div>
    </div>
  );
}

interface SongSectionProps {
  title: string;
  songs: Song[];
  onPlay: (s: Song) => void;
  onShowAll: () => void;
  currentSongId?: number;
  isPlaying: boolean;
}

function SongSection({ title, songs, onPlay, onShowAll, currentSongId, isPlaying }: SongSectionProps) {
  if (songs.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onShowAll} className="text-spotify-gray text-sm font-bold hover:underline uppercase tracking-widest">Browse</button>
        </div>
        <div className="surface-card p-6 rounded text-center">
          <p className="font-bold text-lg mb-2">No songs available yet</p>
          <p className="text-spotify-gray text-sm mb-4">Try another category or open the full library.</p>
          <button onClick={onShowAll} className="action-pill px-4 py-2 rounded text-sm font-bold">Open Library</button>
        </div>
      </section>
    );
  }
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold hover:underline cursor-pointer">{title}</h2>
        <button onClick={onShowAll} className="text-spotify-gray text-sm font-bold hover:underline uppercase tracking-widest">Show all</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4 sm:gap-6">
        {songs.map(song => (
          <div
            key={song.id} 
            onClick={() => isSongPlayable(song) && onPlay(song)}
            className={`surface-card p-4 rounded transition-all group ${isSongPlayable(song) ? 'hover:-translate-y-0.5 cursor-pointer' : 'opacity-80 cursor-not-allowed'}`}
          >
            <div className="relative aspect-square mb-4 shadow-lg shadow-black/40">
              <img src={resolveCover(song.cover)} onError={handleCoverImageError} alt={song.title} className="w-full h-full object-cover rounded" referrerPolicy="no-referrer" />
              <button 
                onClick={(e) => { e.stopPropagation(); onPlay(song); }}
                className={`absolute bottom-2 right-2 w-12 h-12 bg-spotify-green rounded flex items-center justify-center text-black shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all ${currentSongId === song.id && isPlaying ? 'opacity-100 translate-y-0' : ''}`}
                disabled={!isSongPlayable(song)}
              >
                {currentSongId === song.id && isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
            </div>
            <h3 className="font-bold truncate text-sm mb-1">{song.title}</h3>
            <p className="text-spotify-gray text-xs truncate">{song.artist}</p>
            {!isSongPlayable(song) && <p className="text-[11px] text-spotify-gray mt-1">Preview unavailable</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer({ onNavigate, onOpenExternal }: { onNavigate: (v: View) => void; onOpenExternal: (url: string) => void }) {
  return (
    <footer className="mt-12 pt-8 pb-8 border-t border-white/10">
      <div className="cta-band rounded p-6 md:p-8 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-spotify-green font-bold">Built For Modern Listening</p>
          <h3 className="text-2xl md:text-3xl font-black">Turn your music dashboard into a daily destination.</h3>
          <p className="text-sm text-spotify-gray">Discover fresh tracks, keep your favorites organized, and enjoy a smooth streaming experience across all devices.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate('browse')} className="bg-spotify-green text-black px-5 py-3 rounded font-bold text-sm">Explore Library</button>
          <button onClick={() => onNavigate('playlists')} className="action-pill px-5 py-3 rounded font-bold text-sm">Open Playlists</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-spotify-green">
            <PlayCircle size={32} fill="currentColor" />
            <h2 className="text-xl font-bold tracking-tighter text-current">MusicVerse</h2>
          </div>
          <p className="text-sm text-spotify-gray leading-relaxed">
            The ultimate music streaming platform for global hits and local melodies. Stream English and Pakistani music anytime, anywhere.
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-bold uppercase tracking-widest text-xs text-current">Platform</h3>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate('home')} className="text-sm text-spotify-gray hover:text-current transition-colors">Home</button></li>
            <li><button onClick={() => onNavigate('browse')} className="text-sm text-spotify-gray hover:text-current transition-colors">Browse</button></li>
            <li><button onClick={() => onNavigate('features')} className="text-sm text-spotify-gray hover:text-current transition-colors">Features</button></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold uppercase tracking-widest text-xs text-current">Company</h3>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate('about')} className="text-sm text-spotify-gray hover:text-current transition-colors">About Us</button></li>
            <li><button onClick={() => onNavigate('contact')} className="text-sm text-spotify-gray hover:text-current transition-colors">Contact</button></li>
            <li><button onClick={() => onOpenExternal('https://www.spotify.com/legal/privacy-policy/')} className="text-sm text-spotify-gray hover:text-current transition-colors">Privacy Policy</button></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold uppercase tracking-widest text-xs text-current">Social</h3>
          <div className="flex gap-4">
            <button onClick={() => onOpenExternal('https://open.spotify.com')} className="action-pill p-2 rounded transition-colors text-current"><Globe size={18} /></button>
            <button onClick={() => onOpenExternal('mailto:support@musicverse.app')} className="action-pill p-2 rounded transition-colors text-current"><Mail size={18} /></button>
            <button onClick={() => onOpenExternal('https://music.youtube.com')} className="action-pill p-2 rounded transition-colors text-current"><ExternalLink size={18} /></button>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-spotify-gray">© 2026 MusicVerse. All rights reserved.</p>
        <div className="flex gap-6">
          <button onClick={() => onOpenExternal('https://www.spotify.com/legal/end-user-agreement/')} className="text-xs text-spotify-gray hover:text-current cursor-pointer transition-colors">Terms of Service</button>
          <button onClick={() => onOpenExternal('https://www.spotify.com/legal/cookies-policy/')} className="text-xs text-spotify-gray hover:text-current cursor-pointer transition-colors">Cookie Policy</button>
        </div>
      </div>
    </footer>
  );
}

function EmptyTableState({ message, actionLabel, onAction }: { message: string; actionLabel: string; onAction: () => void }) {
  return (
    <tr>
      <td colSpan={5} className="py-10">
        <div className="surface-card p-6 rounded text-center max-w-2xl mx-auto">
          <p className="text-lg font-bold mb-2">{message}</p>
          <p className="text-sm text-spotify-gray mb-4">Try changing the filter or explore the full catalog.</p>
          <button onClick={onAction} className="action-pill px-4 py-2 rounded text-sm font-bold">{actionLabel}</button>
        </div>
      </td>
    </tr>
  );
}

interface SongRowProps {
  key?: React.Key;
  song: Song;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  isFavorite: boolean;
  onPlay: () => void;
  onFavorite: () => void;
  playlists: Playlist[];
  onAddToPlaylist: (pid: string, sid: number) => void;
}

function SongRow({ song, index, isActive, isPlaying, isLoading, isFavorite, onPlay, onFavorite, playlists, onAddToPlaylist }: SongRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const playable = isSongPlayable(song);

  return (
    <tr 
      onClick={playable ? onPlay : undefined}
      className={`group hover:bg-spotify-light/35 transition-colors rounded ${playable ? 'cursor-pointer' : 'cursor-not-allowed opacity-85'} ${isActive ? 'bg-spotify-light/35' : ''}`}
    >
      <td className="py-2 text-center text-spotify-gray hidden sm:table-cell">
        <div className="relative w-full h-full flex items-center justify-center">
          <span className={`group-hover:hidden ${isActive ? 'text-spotify-green' : ''}`}>
            {!playable ? 'N/A' : isActive && isLoading ? (
              <div className="w-4 h-4 border-2 border-spotify-green border-t-transparent rounded animate-spin"></div>
            ) : isActive && isPlaying ? (
              <div className="w-4 h-4 flex items-end gap-0.5 justify-center">
                <div className="w-1 bg-spotify-green animate-bounce h-full"></div>
                <div className="w-1 bg-spotify-green animate-bounce h-2/3 delay-75"></div>
                <div className="w-1 bg-spotify-green animate-bounce h-1/2 delay-150"></div>
              </div>
            ) : index}
          </span>
          <button onClick={(e) => { e.stopPropagation(); onPlay(); }} className="hidden group-hover:block text-current" disabled={!playable || (isActive && isLoading)}>
            {isActive && isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded animate-spin"></div>
            ) : isActive && isPlaying ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
          </button>
        </div>
      </td>
      <td className="py-2">
        <div className="flex items-center gap-3">
          <img src={resolveCover(song.cover)} onError={handleCoverImageError} alt={song.title} className="w-10 h-10 rounded shrink-0" referrerPolicy="no-referrer" />
          <div className="flex flex-col min-w-0">
            <span className={`font-medium text-sm truncate ${isActive ? 'text-spotify-green' : 'text-current'}`}>{song.title}</span>
            <span className="text-xs text-spotify-gray group-hover:text-current truncate">{song.artist}</span>
            {!playable && <span className="text-[11px] text-spotify-gray">Preview unavailable</span>}
          </div>
        </div>
      </td>
      <td className="py-2 text-sm text-spotify-gray group-hover:text-current hidden md:table-cell">{song.category}</td>
      <td className="py-2 text-sm text-spotify-gray text-center hidden sm:table-cell">{song.duration}</td>
      <td className="py-2 pr-4 text-right">
        <div className="flex items-center justify-end gap-4 relative">
          <button 
            onClick={(e) => { e.stopPropagation(); onFavorite(); }}
            className={`opacity-0 group-hover:opacity-100 transition-opacity ${isFavorite ? 'opacity-100 text-spotify-green' : 'text-spotify-gray hover:text-current'}`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="opacity-0 group-hover:opacity-100 text-spotify-gray hover:text-current transition-opacity"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div className="surface-panel absolute right-0 bottom-full mb-2 w-48 rounded shadow-xl z-20 overflow-hidden">
                <div className="p-2 text-xs font-bold text-spotify-gray border-b border-white/10">Add to Playlist</div>
                {playlists.length === 0 && <div className="p-2 text-xs text-spotify-gray italic">No playlists</div>}
                {playlists.map(p => (
                  <button 
                    key={p.id}
                    onClick={(e) => { e.stopPropagation(); onAddToPlaylist(p.id, song.id); setShowMenu(false); }}
                    className="w-full text-left p-2 text-xs hover:bg-spotify-light/35 transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}


