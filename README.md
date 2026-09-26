# Plataforma de Experiencias Digitales Premium

Aplicación web para crear experiencias audiovisuales personalizadas de alta gama — combinando tarjeta digital, fotografía, video, canción personalizada, carta, galería y animaciones cinematográficas.

## Tecnología

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** para estilos
- **Supabase** — Database, Auth, Storage, Row Level Security
- **React Router** para routing
- **Framer Motion** para animaciones
- **Lucide React** para iconos
- **qrcode** para generación de códigos QR

## Configuración

### Variables de entorno

Las variables ya están preconfiguradas en `.env`:

```
VITE_SUPABASE_URL=<url-del-proyecto>
VITE_SUPABASE_ANON_KEY=<clave-anonima>
```

No necesitas configurarlas manualmente.

### Base de datos (Supabase)

Las tablas se crean automáticamente mediante migraciones:

- `experiences` — Experiencias principales
- `experience_photos` — Fotografías
- `experience_sections` — Secciones configurables
- `story_items` — Momentos de historia
- `admin_profiles` — Perfiles de administrador

#### RLS (Row Level Security)

- **Público (anon):** solo puede leer experiencias `published = true` y sus datos relacionados
- **Administrador (authenticated con admin_profile):** acceso completo a CRUD

#### Storage Buckets

- `photos` — Fotografías de galería
- `videos` — Archivos de video
- `music` — Archivos de audio
- `covers` — Imágenes de portada y portadas de canción

Todos los buckets son públicos para lectura, pero solo administradores autenticados pueden escribir.

### Autenticación

El usuario administrador ya está creado en Supabase Auth y vinculado a `admin_profiles`.

**Credenciales (configuradas en Supabase Auth, no en el código):**

- Correo: `jorge_300499@msn.com`
- La contraseña se configuró al crear el usuario en `auth.users`

#### Si necesitas crear el administrador manualmente

1. Ve a **Supabase Dashboard** > **Authentication** > **Users** > **Add user**
2. Correo: `jorge_300499@msn.com`
3. Establece una contraseña segura
4. Desactiva "Email Confirm" (sin confirmación)
5. Ejecuta en **SQL Editor**:

```sql
INSERT INTO admin_profiles (user_id, email, role)
SELECT id, 'jorge_300499@msn.com', 'admin'
FROM auth.users WHERE email = 'jorge_300499@msn.com'
ON CONFLICT DO NOTHING;
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/gaby-rosales` | Experiencia pública de Gaby |
| `/:slug` | Cualquier experiencia por su slug |
| `/admin/login` | Inicio de sesión |
| `/admin` | Dashboard administrativo |
| `/admin/edit/:slug` | Editor de experiencia |
| `/admin/preview/:slug` | Vista previa |

## Uso

### Administrar experiencias

1. Inicia sesión en `/admin/login`
2. Desde el dashboard, selecciona una experiencia
3. Usa las pestañas del editor para modificar:
   - **Contenido:** nombre, título, subtítulo, mensaje, remitente, portada
   - **Fotografías:** subir, eliminar, reordenar, establecer portada
   - **Canción:** subir audio, portada, título, artista
   - **Video:** subir video MP4
   - **Historia:** crear momentos con texto, fecha e imagen
   - **Secciones:** activar/desactivar, reordenar, cambiar animaciones, editar contenido
   - **Colores:** cambiar paleta completa con presets
4. Guarda los cambios
5. Usa **Vista previa** para ver el resultado antes de publicar

### Generar QR

Desde el dashboard, haz clic en el botón QR de cualquier experiencia para generar y descargar un código QR PNG.

### Compartir

La experiencia pública incluye un botón de compartir con opciones para WhatsApp, Web Share nativo y copiar enlace.

## Crear nuevas experiencias

```sql
INSERT INTO experiences (name, slug, title, subtitle, message, sender_name, occasion, published)
VALUES ('María López', 'maria-lopez', 'Para ti', 'Un regalo especial', 'Mensaje', 'Con cariño', 'Aniversario', true);

-- Crear secciones por defecto
INSERT INTO experience_sections (experience_id, type, title, subtitle, content, display_order, enabled, animation)
SELECT id, s.type, s.title, '', '{}'::jsonb, s.ord, true, 'fade'
FROM experiences, (VALUES
  ('hero', 'Nombre', 1), ('intro', '', 2), ('story', 'Historia', 3),
  ('gallery', 'Galería', 4), ('song', 'Canción', 5), ('video', 'Video', 6),
  ('message', 'Mensaje', 7), ('surprise', 'Sorpresa', 8), ('final', 'Final', 9), ('share', 'Compartir', 10)
) AS s(type, title, ord)
WHERE slug = 'maria-lopez'
AND NOT EXISTS (SELECT 1 FROM experience_sections es WHERE es.experience_id = experiences.id AND es.type = s.type);
```

## Seguridad

- Las contraseñas nunca se almacenan en código, tablas propias ni variables públicas
- La `service_role_key` no se usa en el frontend
- RLS activo en todas las tablas
- Storage protegido con políticas por bucket
- Las rutas `/admin/*` están protegidas y verifican el rol de administrador
