import { supabase } from '@/lib/supabase';
import type { Experience, ExperiencePhoto, ExperienceSection, StoryItem } from '@/lib/types';

export interface ExperienceData {
  experience: Experience;
  photos: ExperiencePhoto[];
  sections: ExperienceSection[];
  storyItems: StoryItem[];
}

function normalizeExperience(raw: any): Experience {
  // Tu tabla vieja guarda todo en data JSON, la nueva en columnas
  const d = raw.data || {};
  return {
    id: raw.id,
    name: raw.name || d.nombre || raw.title || raw.slug,
    slug: raw.slug,
    title: raw.title || d.hero?.title || 'Experiencia',
    subtitle: raw.subtitle || d.hero?.subtitle || '',
    message: raw.message || d.mensaje || '',
    sender_name: raw.sender_name || d.remitente || '',
    occasion: raw.occasion || d.ocasión || '',
    cover_image_url: raw.cover_image_url || d.hero?.cover || null,
    music_url: raw.music_url || null,
    music_title: raw.music_title || null,
    music_artist: raw.music_artist || null,
    music_cover_url: raw.music_cover_url || null,
    video_url: raw.video_url || null,
    primary_color: raw.primary_color || d.primary_color || '#e11d48',
    secondary_color: raw.secondary_color || d.secondary_color || '#f43f5e',
    background_color: raw.background_color || d.background || '#ffffff',
    text_color: raw.text_color || d.text_color || '#111827',
    gallery_style: raw.gallery_style || 'grid',
    published: raw.published?? true,
    created_at: raw.created_at || new Date().toISOString(),
    updated_at: raw.updated_at || new Date().toISOString(),
  };
}

export async function loadExperience(slug: string): Promise<ExperienceData | null> {
  const { data: experience, error } = await supabase
   .from('experiences')
   .select('*')
   .eq('slug', slug)
   .maybeSingle();

  if (error ||!experience) {
    console.error('loadExperience error', error);
    return null;
  }

  const exp = normalizeExperience(experience);

  const [photosResult, sectionsResult, storyResult] = await Promise.all([
    supabase.from('experience_photos').select('*').eq('experience_id', exp.id).order('display_order', { ascending: true }),
    supabase.from('experience_sections').select('*').eq('experience_id', exp.id).order('display_order', { ascending: true }),
    supabase.from('story_items').select('*').eq('experience_id', exp.id).eq('enabled', true).order('display_order', { ascending: true }),
  ]);

  // Si las tablas nuevas están vacías pero tenías data vieja, no devolvemos vacío
  return {
    experience: exp,
    photos: (photosResult.data as any) || [],
    sections: (sectionsResult.data as any) || [],
    storyItems: (storyResult.data as any) || [],
  };
}

export async function loadExperienceAdmin(slug: string): Promise<ExperienceData | null> {
  return loadExperience(slug);
}

export async function loadAllExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase.from('experiences').select('*').order('updated_at', { ascending: false });
  if (error ||!data) return [];
  return data.map(normalizeExperience);
}
