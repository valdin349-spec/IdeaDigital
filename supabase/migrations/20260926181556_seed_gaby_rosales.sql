/*
# Seed Gaby Rosales Experience with Default Sections

## Overview
Creates the initial "Gaby Rosales" experience with all 10 default sections enabled.
The experience is published and accessible at /gaby-rosales even without media content.

## Data Inserted
1. One experience row: name="Gaby Rosales", slug="gaby-rosales", published=true
2. Ten experience_sections rows (hero, intro, story, gallery, song, video, message, surprise, final, share)
   each with default editable content in the jsonb `content` field.

## Safety
Uses ON CONFLICT to be idempotent — re-running won't create duplicates.
*/

INSERT INTO experiences (name, slug, title, subtitle, message, sender_name, occasion, published)
VALUES (
  'Gaby Rosales',
  'gaby-rosales',
  'Una historia hecha especialmente para ti',
  'Hay personas que llegan a nuestra vida y dejan algo diferente.',
  'Hay personas que llegan a nuestra vida y dejan algo diferente.',
  'Con cariño',
  'Cumpleaños',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  updated_at = now();

-- Insert default sections only if they don't already exist
INSERT INTO experience_sections (experience_id, type, title, subtitle, content, display_order, enabled, animation)
SELECT
  e.id,
  s.type,
  s.title,
  s.subtitle,
  s.content,
  s.display_order,
  s.enabled,
  s.animation
FROM experiences e
CROSS JOIN (VALUES
  ('hero',      'GABY ROSALES',                                    'Una historia hecha especialmente para ti',                          '{"buttonText":"Abrir mi regalo","overlayIntensity":"medium","blurAmount":"8"}'::jsonb, 1,  true, 'cinematic'),
  ('intro',     'Esta pequeña historia fue creada especialmente para ti', 'Porque algunas personas merecen algo diferente',              '{}'::jsonb,                                                                 2,  true, 'reveal'),
  ('story',     'Nuestra Historia',                                 'Cada momento cuenta',                                               '{}'::jsonb,                                                                 3,  true, 'fade'),
  ('gallery',   'Galería',                                          'Momentos capturados para siempre',                                  '{}'::jsonb,                                                                 4,  true, 'parallax'),
  ('song',      'Esta canción es para ti',                          'Déjala sonar mientras recorres esto',                               '{}'::jsonb,                                                                 5,  true, 'fade'),
  ('video',     'Un momento para recordar',                         'Algo que quiero que veas',                                          '{}'::jsonb,                                                                 6,  true, 'zoom'),
  ('message',   'Para ti, Gaby',                                    '',                                                                  '{"text":"Eres una persona increíble. Cada día a tu lado es un regalo. Gracias por existir y por ser exactamente como eres.","fontFamily":"serif","align":"center","size":"lg"}'::jsonb, 7,  true, 'reveal'),
  ('surprise',  'Todavía falta una cosa…',                          '',                                                                  '{"preText":"Todavía falta una cosa...","midText":"Quiero que recuerdes algo.","postText":"Eres una persona única y mereces momentos que también lo sean."}'::jsonb, 8,  true, 'fade'),
  ('final',     'GABY ROSALES',                                     'Esta experiencia fue creada especialmente para ti',                 '{"finalTitle":"FELIZ CUMPLEAÑOS, GABY","senderText":"Con cariño"}'::jsonb, 9,  true, 'fade'),
  ('share',     'Comparte esta experiencia',                        'Si te gustó, compártela con alguien especial',                      '{}'::jsonb,                                                                 10, true, 'fade')
) AS s(type, title, subtitle, content, display_order, enabled, animation)
WHERE e.slug = 'gaby-rosales'
AND NOT EXISTS (
  SELECT 1 FROM experience_sections es
  WHERE es.experience_id = e.id AND es.type = s.type
);
