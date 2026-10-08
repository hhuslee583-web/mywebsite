export type MoodType =
  | 'Happy'
  | 'Calm'
  | 'Okay'
  | 'Sad'
  | 'Anxious'
  | 'Angry'
  | 'Lonely'
  | 'Stressed';

export interface MoodMeta {
  type: MoodType;
  emoji: string;
  label: string;
  description: string;
  color: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
}

export interface MoodEntry {
  id: string;
  mood: MoodType;
  intensity: number; // 1 to 5
  note?: string;
  tags: string[];
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: MoodType;
  gratitude?: string;
  isPinned: boolean;
  tags: string[];
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isFavorited?: boolean;
  suggestedAction?: 'breathing' | 'grounding' | 'journal' | 'meditation';
}

export type NavTab = 'home' | 'chat' | 'mood' | 'journal' | 'selfcare';

export type AmbientSoundType = 'rain' | 'ocean' | 'fire' | 'bowl' | 'off';
