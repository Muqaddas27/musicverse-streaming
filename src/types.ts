export interface Song {
  id: number;
  title: string;
  artist: string;
  language: 'English' | 'Urdu';
  category: string;
  cover: string;
  audio: string;
  duration: string;
}

export interface Playlist {
  id: string;
  name: string;
  songIds: number[];
}

export type View = 'home' | 'browse' | 'english' | 'pakistani' | 'favorites' | 'playlists' | 'search' | 'recently-played' | 'about' | 'features' | 'contact' | 'player-full';
