# Procesamiento seguro de imágenes en Vercel

## Qué hace el cambio

- Las imágenes originales se cargan a un bucket privado temporal llamado `image-staging`.
- La API `/api/process-image` valida la sesión de Supabase y el rol de la cuenta.
- El servidor decodifica la imagen con Sharp, limita el tamaño de entrada y la cantidad de píxeles, corrige la orientación y vuelve a codificar tres variantes WebP.
- La recodificación no conserva EXIF/XMP/IPTC de la imagen original; los archivos finales son nuevas imágenes generadas por Sharp.
- El original temporal se elimina después del procesamiento.
- Las URLs firmadas duran 1 hora y su caché queda en `sessionStorage`; se limpia al cerrar sesión.

Los videos siguen la ruta anterior y **no** reciben este procesamiento de imágenes.

## Despliegue requerido

### 1. Configurar variables de entorno en Vercel

En **Settings → Environment Variables**, define al menos para Preview y Production:

- `SUPABASE_URL`: URL del proyecto Supabase.
- `SUPABASE_ANON_KEY`: clave publicable/anon del proyecto.
- `SUPABASE_SERVICE_ROLE_KEY`: clave de servicio del proyecto, solo para la función del servidor.

La clave `SUPABASE_SERVICE_ROLE_KEY` es secreta: nunca debe llevar el prefijo `VITE_`, estar en el frontend, ni añadirse al repositorio. No la compartas por chat. La API usa la clave para leer el original temporal y guardar las variantes procesadas, después de validar el JWT y el rol.

### 2. Preparar el bucket temporal

Ejecuta en Supabase SQL Editor el contenido de:

`supabase/migrations/202610130002_server_side_image_processing.sql`

Esta migración crea el bucket privado temporal y sus políticas. No elimina todavía el permiso antiguo de subida al bucket final, para evitar interrumpir la aplicación antes de desplegar el nuevo flujo.

### 3. Probar el despliegue Preview

Despliega esta rama en Vercel Preview. Inicia sesión con una cuenta autorizada y sube una foto JPG/PNG/WebP/AVIF. Comprueba que:

- la solicitud `/api/process-image` devuelve HTTP 200;
- se crean tres archivos `-thumb.webp`, `-medium.webp` y `-full.webp` en el bucket privado `media`;
- el archivo original temporal desaparece del bucket `image-staging`;
- la foto aparece en la galería y sus variantes se pueden abrir;
- una cuenta sin rol autorizado recibe 403.

No se considera desplegado solo porque el código esté en GitHub: también debe configurarse Vercel y ejecutarse la migración de Supabase.

### 4. Cerrar la vía de subida directa

Después de desplegar y verificar el nuevo flujo en Production, ejecuta:

`supabase/migrations/202610130003_storage_security_hardening.sql`

Esta migración elimina el permiso de subida directa de imágenes al bucket final para `photo_uploader`. Desde ese momento las variantes finales deben proceder de la API de Vercel. Los administradores conservan su política existente.

## Límite de seguridad pendiente de revisar

La política de lectura de Storage existente permite a los miembros leer objetos del bucket `media`. El bucket es privado, pero una política de lectura amplia sigue dando acceso a cualquier miembro autorizado por `is_member()`. Antes de estrecharla, hay que identificar cómo se guardan y autorizan las pistas de audio, ya que el mismo bucket permite audio y video y una regla que solo contemple `public.media` podría romper esa función. No se debe considerar esta parte resuelta hasta revisar esas rutas y probarlas.

## Límites

- El servidor rechaza imágenes mayores de 40 MiB, formatos no compatibles o imágenes con más de 40 millones de píxeles.
- La API solo procesa imágenes; los videos continúan subiendo por la ruta actual.
- Las URLs firmadas que ya se habían emitido pueden seguir funcionando hasta que expire su plazo anterior de 12 horas. Las nuevas URLs duran 1 hora.
