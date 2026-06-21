# Portfolio 3D Retro

Portfolio web interactivo, construido como una habitación retro 3D explorable. La propuesta combina una estética low poly inspirada en PS2 / early 2000s con una interfaz tipo videojuego para presentar información profesional, proyectos, habilidades, educación, contacto y CV.

## Concepto

La pantalla inicial funciona como menú de entrada. Antes de presionar **INICIAR**, los objetos de la escena no son interactivos. Al entrar en modo exploración, el usuario puede tocar distintos elementos 3D de la habitación para abrir secciones del portfolio.

También incluye **Modo Clásico**, una vista rápida en formato de tabs para consultar el contenido sin recorrer la escena.

## Mapa de objetos

| Objeto en la habitación | Sección que abre |
| --- | --- |
| PC vieja | Proyectos |
| Pizarra | Habilidades |
| Cuadro académico / universidad | Educación |
| Teléfono fijo retro | Contacto |
| Carpeta con etiqueta CV | Descargar CV |
| Credencial / PLAYER ID | Sobre mí |
| Puerta | Elemento ambiental / salida visual |
| Osito de peluche | Easter egg de sonido |

## Funcionalidades

- Escena 3D low poly con estética retro, oscura y nostálgica.
- Cámara responsive para adaptar la composición a distintas resoluciones.
- Interacción por objetos 3D con hotspots, tooltips, cursor pointer y brillo suave.
- Menú inicial con transición real al modo exploración.
- Paneles estilo videojuego para secciones como Proyectos, Habilidades, Perfil y Educación.
- Modo Clásico con tabs para una vista más directa del contenido.
- Proyectos con imágenes, videos, links de demo y acceso a GitHub cuando corresponde.
- Botones de contacto para correo, GitHub y LinkedIn.
- Descarga directa del CV en PDF.
- Música ambiente synthwave opcional.
- Efectos de sonido para interacción y un sonido especial al tocar la nariz del osito.
- Efecto CRT / scanlines aplicado sobre toda la experiencia.

## Tecnologías

- **React 19** para la interfaz principal.
- **Vite** como entorno de desarrollo y generación de build.
- **Three.js** para renderizar la escena 3D.
- **React Three Fiber** para integrar Three.js con React.
- **React Three Drei** para utilidades de cámara, texto y componentes 3D.
- **CSS custom** para la interfaz 2D, responsive, paneles, botones, CRT y estética retro.

## Estructura del proyecto

```txt
src/
  main.jsx
  App.jsx
  styles.css
  components/
    RetroRoom.jsx
  data/
    portfolio.js

public/
  audio/
    ambient-loop.mp3
    teddy-sound.mp3
  cv/
    benjamin-velasco-cv.pdf
  projects/
    cenprofar-cover.png
    cenprofar-demo.mp4
    juego-banderas.mp4
    lista-tareas.png

dist/
  assets generados por el build

package.json
vite.config.cjs
```

## Qué hace cada parte

- `src/main.jsx`: punto de entrada de React. Monta la aplicación en el HTML.
- `src/App.jsx`: controla la experiencia principal, modos de navegación, paneles, sonidos, música, datos visibles y render del canvas 3D.
- `src/components/RetroRoom.jsx`: construye la habitación y los objetos 3D usando React Three Fiber y Three.js.
- `src/data/portfolio.js`: contiene los textos, proyectos, habilidades, educación, contacto y links del portfolio.
- `src/styles.css`: define toda la estética 2D: menú, botones, paneles, responsive, modo clásico, CRT y animaciones.
- `public/`: guarda archivos estáticos que se sirven tal cual, como audios, PDF del CV, imágenes y videos de proyectos.
- `dist/`: carpeta generada automáticamente por `npm run build`. No se edita a mano.
- `vite.config.cjs`: configuración de Vite. Usa una carpeta de caché propia para evitar problemas de archivos bloqueados en Windows.

## Instalación

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Generar build de producción:

```bash
npm run build
```

Previsualizar el build:

```bash
npm run preview
```

## Personalización

El contenido principal se modifica en:

```txt
src/data/portfolio.js
```

Ahí se pueden cambiar:

- textos de Sobre mí y Educación;
- proyectos, descripciones, tecnologías, imágenes, videos y links;
- habilidades y categorías;
- datos de contacto;
- link del CV.

Los objetos y la composición 3D se ajustan en:

```txt
src/components/RetroRoom.jsx
```

La estética visual de la interfaz se ajusta en:

```txt
src/styles.css
```

Los archivos públicos nuevos deben colocarse en `public/` y referenciarse con rutas absolutas desde la app, por ejemplo:

```txt
/projects/mi-proyecto.png
/audio/mi-sonido.mp3
/cv/mi-cv.pdf
```

## Publicación

Para publicar el portfolio, primero se genera la versión final:

```bash
npm run build
```

Ese comando crea la carpeta `dist/`, que contiene HTML, CSS, JavaScript y assets optimizados para producción. Esa carpeta es la salida que usan muchos servicios de hosting estático.

En plataformas como Vercel, Netlify o Firebase Hosting, normalmente se configura:

- comando de build: `npm run build`;
- carpeta de salida: `dist`.

## Notas técnicas

- El audio se reproduce después de una interacción del usuario por restricciones normales de los navegadores.
- La interacción con objetos 3D se habilita recién después de presionar **INICIAR**.
- Los videos e imágenes de proyectos están en `public/projects/`.
- El CV descargable está en `public/cv/`.
- Si se agregan muchos proyectos, una mejora futura recomendada es sumar paginación o carrusel dentro del panel de Proyectos.
- Si el bundle crece demasiado, se puede optimizar con carga diferida, compresión de assets o división de código.

## Estado

Versión funcional y pulida del portfolio retro 3D. La base visual, la navegación, el modo exploración, el modo clásico, los proyectos, el contacto, el CV y los principales assets ya están integrados.
