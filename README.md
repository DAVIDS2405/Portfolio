# Portfolio — David Basantes

Portfolio personal en [Astro](https://astro.build) con una sola fuente de verdad para
la experiencia laboral: **`src/data/cv.json`**.

```
src/data/cv.json          ← única fuente de verdad (experiencia, skills, foto, contacto)
        ├── src/components/Experience.astro   → línea de tiempo del sitio
        ├── src/components/Hero.astro         → foto, contacto y resumen
        ├── src/pages/cv.astro                → CV imprimible en /cv
        └── LinkedIn                          → subís el PDF generado desde /cv
```

## Editar tu información

Todo vive en `src/data/cv.json`, con el formato estándar de
[JSON Resume](https://jsonresume.org/schema). Los campos que usa el sitio:

| Campo | Dónde se ve |
| --- | --- |
| `basics.name`, `basics.label`, `basics.summary` | Hero y encabezado del CV |
| `basics.email`, `basics.phone`, `basics.location` | Botones del hero y CV |
| `basics.image` / `basics.photo` | Foto de perfil (hero y "Sobre mí") |
| `basics.profiles[]` | Links a GitHub y LinkedIn |
| `work[]` | Sección Experiencia y CV |
| `work[].url` | Hace clickeable el nombre de la empresa |
| `work[].links[]` | Links extra por puesto (`{ "label": "...", "url": "..." }`) |
| `education[]` | CV |
| `skills[]` | CV |
| `projects[]` | Sección Proyectos y CV |

### Proyectos y tags

Cada proyecto en `projects[]` usa:

```json
{
  "name": "Ruffo",
  "description": "Plataforma de gestión para peluquerías caninas.",
  "url": "https://ruffoapp.com/",     // botón Preview
  "repository": "https://github.com/...", // botón Code (opcional)
  "image": "/ruffo.png",              // portada en /public (opcional)
  "keywords": ["Next.js", "React"]    // se renderizan como badges
}
```

`keywords` se resuelve contra el registro `TAGS` de
`src/components/Projects.astro` (nombre normalizado → icono + color). Si un
keyword no existe en el registro, se muestra como badge gris sin icono, así que
nunca rompe. Para sumar una tecnología nueva: importá su icono en ese archivo y
agregá una entrada a `TAGS`.

Si `image` está vacío, la tarjeta muestra un degradado con el nombre del
proyecto en vez de una imagen rota.

### Fechas

Se aceptan tres formatos, sin romper el render:

- `"2023-05"` → `may 2023`
- `"2023"` → `2023`
- `""` (sin `endDate`) → `2023 — Actualidad`

El **orden del array `work[]` es el orden en que se muestran**. Poné primero lo más
relevante, no hace falta que sea cronológico.

### Foto de perfil

Hoy la foto sale de tu avatar de GitHub (`basics.image`). Para usar una foto propia:

1. Guardá la imagen en `public/` (ej. `public/foto.jpg`).
2. En `cv.json` poné `"photo": "/foto.jpg"`.

`photo` tiene prioridad sobre `image`. Con eso la foto queda versionada en el repo y
no depende de que GitHub siga sirviendo la misma URL.

> La foto de LinkedIn **no se puede usar directo**: sus URLs (`media.licdn.com`) son
> firmadas y expiran.

## Actualizar LinkedIn

LinkedIn **no permite leer ni escribir la experiencia laboral por API**. Lo que sí
existe (gratis) es:

- **Sign In with LinkedIn (OpenID Connect)**: nombre, email y foto.
- **Share on LinkedIn** (`w_member_social`): publicar posts.

Leer `positions` requiere el Partner Program (pago y con revisión comercial), y los
scrapers tipo Proxycurl están fuera de servicio desde julio 2025.

El flujo práctico es:

1. `bun run dev` y abrí <http://localhost:4321/cv> (o `/cv` en producción, desde el celu).
2. Botón **Guardar como PDF** → *Guardar como PDF*. En el diálogo, desactivá
   **«Encabezados y pies de página»** para que no salgan la URL, la fecha ni el
   número de página.
3. En LinkedIn: **Agregar sección → Recomendado → Agregar aptitudes...** o directamente
   subir el PDF al editar el perfil; LinkedIn lo parsea y autocompleta puestos y fechas.

Así editás `cv.json` una vez y de ahí salen el portfolio y el CV.

## Comandos

| Comando | Acción |
| --- | --- |
| `bun install` | Instala dependencias |
| `bun run dev` | Servidor local en `localhost:4321` |
| `bun run build` | Type-check + build de producción |
| `bun run preview` | Previsualiza el build |
