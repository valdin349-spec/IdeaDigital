export interface Experience {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string;
  message: string;
  sender_name: string;
  occasion: string;
  cover_image_url: string | null;
  music_url: string | null;
  music_title: string | null;
  music_artist: string | null;
  music_cover_url: string | null;
  video_url: string | null;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  gallery_style: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExperiencePhoto {
  id: string;
  experience_id: string;
  image_url: string;
  title: string;
  description: string;
  display_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface ExperienceSection {
  id: string;
  experience_id: string;
  type: SectionType;
  title: string;
  subtitle: string;
  content: SectionContent;
  display_order: number;
  enabled: boolean;
  animation: AnimationType;
  created_at: string;
  updated_at: string;
}

export interface StoryItem {
  id: string;
  experience_id: string;
  title: string;
  text: string;
  date: string;
  image_url: string | null;
  display_order: number;
  enabled: boolean;
  created_at: string;
}

export interface AdminProfile {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}

export type SectionType =
  | 'hero'
  | 'intro'
  | 'story'
  | 'gallery'
  | 'song'
  | 'video'
  | 'message'
  | 'surprise'
  | 'final'
  | 'share';

export type AnimationType =
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'parallax'
  | 'reveal'
  | 'cinematic'
  | 'none';

export interface SectionContent {
  buttonText?: string;
  overlayIntensity?: string;
  blurAmount?: string;
  text?: string;
  fontFamily?: string;
  align?: string;
  size?: string;
  preText?: string;
  midText?: string;
  postText?: string;
  finalTitle?: string;
  senderText?: string;
  [key: string]: unknown;
}

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Portada',
  intro: 'Introducción',
  story: 'Historia',
  gallery: 'Galería',
  song: 'Canción',
  video: 'Video',
  message: 'Mensaje',
  surprise: 'Sorpresa',
  final: 'Final',
  share: 'Compartir',
};

export const ANIMATION_LABELS: Record<AnimationType, string> = {
  fade: 'Fade',
  slide: 'Slide',
  zoom: 'Zoom',
  parallax: 'Parallax',
  reveal: 'Reveal',
  cinematic: 'Cinematic',
  none: 'Sin animación',
};
