import { supabase } from '@/lib/supabase';
import type { Experience, ExperiencePhoto, ExperienceSection, StoryItem } from '@/lib/types';

export interface ExperienceData {
  experience: Experience;
  photos: ExperiencePhoto[];
  sections: ExperienceSection[];
  storyItems: StoryItem[];
}

export async function loadExperience(slug: string): Promise<ExperienceData | null> {
  const { data: experience, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !experience) return null;

  const exp = experience as Experience;

  const [photosResult, sectionsResult, storyResult] = await Promise.all([
    supabase
      .from('experience_photos')
      .select('*')
      .eq('experience_id', exp.id)
      .order('display_order', { ascending: true }),
    supabase
      .from('experience_sections')
      .select('*')
      .eq('experience_id', exp.id)
      .order('display_order', { ascending: true }),
    supabase
      .from('story_items')
      .select('*')
      .eq('experience_id', exp.id)
      .eq('enabled', true)
      .order('display_order', { ascending: true }),
  ]);

  return {
    experience: exp,
    photos: (photosResult.data as ExperiencePhoto[]) || [],
    sections: (sectionsResult.data as ExperienceSection[]) || [],
    storyItems: (storyResult.data as StoryItem[]) || [],
  };
}

export async function loadExperienceAdmin(slug: string): Promise<ExperienceData | null> {
  const { data: experience, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !experience) return null;

  const exp = experience as Experience;

  const [photosResult, sectionsResult, storyResult] = await Promise.all([
    supabase
      .from('experience_photos')
      .select('*')
      .eq('experience_id', exp.id)
      .order('display_order', { ascending: true }),
    supabase
      .from('experience_sections')
      .select('*')
      .eq('experience_id', exp.id)
      .order('display_order', { ascending: true }),
    supabase
      .from('story_items')
      .select('*')
      .eq('experience_id', exp.id)
      .order('display_order', { ascending: true }),
  ]);

  return {
    experience: exp,
    photos: (photosResult.data as ExperiencePhoto[]) || [],
    sections: (sectionsResult.data as ExperienceSection[]) || [],
    storyItems: (storyResult.data as StoryItem[]) || [],
  };
}

export async function loadAllExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error || !data) return [];
  return data as Experience[];
}
