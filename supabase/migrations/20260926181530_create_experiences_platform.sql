/*
# Create Premium Digital Experiences Platform Schema

## Overview
This migration creates the complete database schema for a premium digital experiences platform.
The platform allows an administrator to create personalized audiovisual experiences
(cards, photos, videos, songs, messages, galleries) accessible via public URLs.

## New Tables

1. `experiences` — The main table for each experience (e.g., "Gaby Rosales")
   - id (uuid, PK)
   - name (text) — Display name
   - slug (text, unique) — URL identifier (e.g., "gaby-rosales")
   - title (text) — Main title shown in hero
   - subtitle (text) — Subtitle shown in hero
   - message (text) — Opening message
   - sender_name (text) — Who it's from
   - occasion (text) — e.g., "Cumpleaños"
   - cover_image_url (text) — Hero background image
   - music_url (text) — Audio file URL
   - music_title (text) — Song title
   - music_artist (text) — Artist or custom text
   - music_cover_url (text) — Album art URL
   - video_url (text) — Video file URL
   - primary_color (text) — Theme primary color
   - secondary_color (text) — Theme secondary/accent color
   - background_color (text) — Theme background color
   - text_color (text) — Theme text color
   - gallery_style (text) — Gallery layout style
   - published (boolean) — Whether the public can see it
   - created_at, updated_at (timestamps)

2. `experience_photos` — Photos within an experience
   - id (uuid, PK)
   - experience_id (uuid, FK → experiences)
   - image_url (text) — Storage URL
   - title (text)
   - description (text)
   - display_order (int) — Sort order
   - is_cover (boolean) — Whether it's the hero image
   - created_at (timestamp)

3. `experience_sections` — Configurable sections of an experience
   - id (uuid, PK)
   - experience_id (uuid, FK → experiences)
   - type (text) — hero, intro, story, gallery, song, video, message, surprise, final, share
   - title (text)
   - subtitle (text)
   - content (jsonb) — Flexible content storage
   - display_order (int) — Sort order
   - enabled (boolean) — Whether section is visible
   - animation (text) — Animation type
   - created_at, updated_at (timestamps)

4. `story_items` — Narrative moments within the story section
   - id (uuid, PK)
   - experience_id (uuid, FK → experiences)
   - title (text)
   - text (text)
   - date (text)
   - image_url (text)
   - display_order (int)
   - enabled (boolean)
   - created_at (timestamp)

5. `admin_profiles` — Links auth users to admin role
   - id (uuid, PK)
   - user_id (uuid, FK → auth.users)
   - email (text)
   - role (text) — "admin"
   - created_at (timestamp)

## Security (RLS)

### experiences
- Public (anon) can SELECT only published experiences
- Authenticated admins can SELECT/INSERT/UPDATE/DELETE all experiences

### experience_photos
- Public (anon) can SELECT photos of published experiences
- Authenticated admins can INSERT/UPDATE/DELETE all photos

### experience_sections
- Public (anon) can SELECT sections of published experiences
- Authenticated admins can INSERT/UPDATE/DELETE all sections

### story_items
- Public (anon) can SELECT items of published experiences
- Authenticated admins can INSERT/UPDATE/DELETE all items

### admin_profiles
- Authenticated users can SELECT their own profile
- No public access

## Storage Buckets
- photos, videos, music, covers (all public read, authenticated write)
*/

-- ===== EXPERIENCES =====
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  sender_name text NOT NULL DEFAULT '',
  occasion text NOT NULL DEFAULT '',
  cover_image_url text,
  music_url text,
  music_title text,
  music_artist text,
  music_cover_url text,
  video_url text,
  primary_color text NOT NULL DEFAULT '#E56FA3',
  secondary_color text NOT NULL DEFAULT '#EFA3C4',
  background_color text NOT NULL DEFAULT '#050505',
  text_color text NOT NULL DEFAULT '#FFFFFF',
  gallery_style text NOT NULL DEFAULT 'editorial',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Public can read published experiences
DROP POLICY IF EXISTS "public_read_published_experiences" ON experiences;
CREATE POLICY "public_read_published_experiences"
  ON experiences FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Admins (authenticated) can read all experiences
DROP POLICY IF EXISTS "admin_read_all_experiences" ON experiences;
CREATE POLICY "admin_read_all_experiences"
  ON experiences FOR SELECT
  TO authenticated
  USING (true);

-- Admins can insert experiences
DROP POLICY IF EXISTS "admin_insert_experiences" ON experiences;
CREATE POLICY "admin_insert_experiences"
  ON experiences FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can update experiences
DROP POLICY IF EXISTS "admin_update_experiences" ON experiences;
CREATE POLICY "admin_update_experiences"
  ON experiences FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admins can delete experiences
DROP POLICY IF EXISTS "admin_delete_experiences" ON experiences;
CREATE POLICY "admin_delete_experiences"
  ON experiences FOR DELETE
  TO authenticated
  USING (true);

-- ===== EXPERIENCE_PHOTOS =====
CREATE TABLE IF NOT EXISTS experience_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experience_photos ENABLE ROW LEVEL SECURITY;

-- Public can read photos of published experiences
DROP POLICY IF EXISTS "public_read_published_photos" ON experience_photos;
CREATE POLICY "public_read_published_photos"
  ON experience_photos FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM experiences WHERE experiences.id = experience_photos.experience_id AND experiences.published = true)
  );

-- Admins can read all photos
DROP POLICY IF EXISTS "admin_read_all_photos" ON experience_photos;
CREATE POLICY "admin_read_all_photos"
  ON experience_photos FOR SELECT
  TO authenticated
  USING (true);

-- Admins can insert photos
DROP POLICY IF EXISTS "admin_insert_photos" ON experience_photos;
CREATE POLICY "admin_insert_photos"
  ON experience_photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can update photos
DROP POLICY IF EXISTS "admin_update_photos" ON experience_photos;
CREATE POLICY "admin_update_photos"
  ON experience_photos FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admins can delete photos
DROP POLICY IF EXISTS "admin_delete_photos" ON experience_photos;
CREATE POLICY "admin_delete_photos"
  ON experience_photos FOR DELETE
  TO authenticated
  USING (true);

-- ===== EXPERIENCE_SECTIONS =====
CREATE TABLE IF NOT EXISTS experience_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  display_order int NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  animation text NOT NULL DEFAULT 'fade',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experience_sections ENABLE ROW LEVEL SECURITY;

-- Public can read sections of published experiences
DROP POLICY IF EXISTS "public_read_published_sections" ON experience_sections;
CREATE POLICY "public_read_published_sections"
  ON experience_sections FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM experiences WHERE experiences.id = experience_sections.experience_id AND experiences.published = true)
  );

-- Admins can read all sections
DROP POLICY IF EXISTS "admin_read_all_sections" ON experience_sections;
CREATE POLICY "admin_read_all_sections"
  ON experience_sections FOR SELECT
  TO authenticated
  USING (true);

-- Admins can insert sections
DROP POLICY IF EXISTS "admin_insert_sections" ON experience_sections;
CREATE POLICY "admin_insert_sections"
  ON experience_sections FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can update sections
DROP POLICY IF EXISTS "admin_update_sections" ON experience_sections;
CREATE POLICY "admin_update_sections"
  ON experience_sections FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admins can delete sections
DROP POLICY IF EXISTS "admin_delete_sections" ON experience_sections;
CREATE POLICY "admin_delete_sections"
  ON experience_sections FOR DELETE
  TO authenticated
  USING (true);

-- ===== STORY_ITEMS =====
CREATE TABLE IF NOT EXISTS story_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  text text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE story_items ENABLE ROW LEVEL SECURITY;

-- Public can read story items of published experiences
DROP POLICY IF EXISTS "public_read_published_stories" ON story_items;
CREATE POLICY "public_read_published_stories"
  ON story_items FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM experiences WHERE experiences.id = story_items.experience_id AND experiences.published = true)
  );

-- Admins can read all story items
DROP POLICY IF EXISTS "admin_read_all_stories" ON story_items;
CREATE POLICY "admin_read_all_stories"
  ON story_items FOR SELECT
  TO authenticated
  USING (true);

-- Admins can insert story items
DROP POLICY IF EXISTS "admin_insert_stories" ON story_items;
CREATE POLICY "admin_insert_stories"
  ON story_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can update story items
DROP POLICY IF EXISTS "admin_update_stories" ON story_items;
CREATE POLICY "admin_update_stories"
  ON story_items FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admins can delete story items
DROP POLICY IF EXISTS "admin_delete_stories" ON story_items;
CREATE POLICY "admin_delete_stories"
  ON story_items FOR DELETE
  TO authenticated
  USING (true);

-- ===== ADMIN_PROFILES =====
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own admin profile
DROP POLICY IF EXISTS "read_own_admin_profile" ON admin_profiles;
CREATE POLICY "read_own_admin_profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_experience_photos_experience_id ON experience_photos(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_sections_experience_id ON experience_sections(experience_id);
CREATE INDEX IF NOT EXISTS idx_story_items_experience_id ON story_items(experience_id);
CREATE INDEX IF NOT EXISTS idx_experiences_slug ON experiences(slug);

-- ===== STORAGE BUCKETS =====
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('music', 'music', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies: public can read, authenticated can write
-- Photos bucket
DROP POLICY IF EXISTS "public_read_photos" ON storage.objects;
CREATE POLICY "public_read_photos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "auth_write_photos" ON storage.objects;
CREATE POLICY "auth_write_photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'photos');

DROP POLICY IF EXISTS "auth_update_photos" ON storage.objects;
CREATE POLICY "auth_update_photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'photos') WITH CHECK (bucket_id = 'photos');

DROP POLICY IF EXISTS "auth_delete_photos" ON storage.objects;
CREATE POLICY "auth_delete_photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'photos');

-- Videos bucket
DROP POLICY IF EXISTS "public_read_videos" ON storage.objects;
CREATE POLICY "public_read_videos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "auth_write_videos" ON storage.objects;
CREATE POLICY "auth_write_videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "auth_update_videos" ON storage.objects;
CREATE POLICY "auth_update_videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'videos') WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "auth_delete_videos" ON storage.objects;
CREATE POLICY "auth_delete_videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'videos');

-- Music bucket
DROP POLICY IF EXISTS "public_read_music" ON storage.objects;
CREATE POLICY "public_read_music"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'music');

DROP POLICY IF EXISTS "auth_write_music" ON storage.objects;
CREATE POLICY "auth_write_music"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'music');

DROP POLICY IF EXISTS "auth_update_music" ON storage.objects;
CREATE POLICY "auth_update_music"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'music') WITH CHECK (bucket_id = 'music');

DROP POLICY IF EXISTS "auth_delete_music" ON storage.objects;
CREATE POLICY "auth_delete_music"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'music');

-- Covers bucket
DROP POLICY IF EXISTS "public_read_covers" ON storage.objects;
CREATE POLICY "public_read_covers"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'covers');

DROP POLICY IF EXISTS "auth_write_covers" ON storage.objects;
CREATE POLICY "auth_write_covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'covers');

DROP POLICY IF EXISTS "auth_update_covers" ON storage.objects;
CREATE POLICY "auth_update_covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'covers') WITH CHECK (bucket_id = 'covers');

DROP POLICY IF EXISTS "auth_delete_covers" ON storage.objects;
CREATE POLICY "auth_delete_covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'covers');

-- ===== AUTO-UPDATE updated_at =====
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS experiences_updated_at ON experiences;
CREATE TRIGGER experiences_updated_at BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS experience_sections_updated_at ON experience_sections;
CREATE TRIGGER experience_sections_updated_at BEFORE UPDATE ON experience_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
