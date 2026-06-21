# Portfolio 3D Retro

Este es mi portfolio personal, armado como una habitación retro 3D donde cada objeto abre una parte distinta de mi perfil. La idea fue salir un poco del formato clásico de portfolio y llevarlo a algo más cercano a una experiencia interactiva, con estética low poly, tonos oscuros, scanlines y una vibra de juegos de principios de los 2000.

El proyecto está hecho con React, Vite, Three.js y React Three Fiber.

## Idea del proyecto

Al entrar aparece una pantalla inicial con el título del portfolio. Después de presionar **INICIAR**, se habilita el modo exploración y los objetos de la habitación pasan a ser interactivos.

Cada objeto representa una sección:

| Objeto | Sección |
| --- | --- |
| PC vieja | Proyectos |
| Pizarra | Habilidades |
| Cuadro académico | Educación |
| Teléfono fijo | Contacto |
| Carpeta con etiqueta CV | Descargar CV |
| Credencial PLAYER ID | Sobre mí |
| Puerta | Decoración / salida visual |
| Osito de peluche | Detalle interactivo con sonido |

También agregué un **Modo Clásico** para ver el contenido de forma más directa, sin tener que explorar la escena 3D.

## Qué tiene

- Escena 3D low poly con estética retro.
- Objetos interactivos con tooltip, hover y brillo suave.
- Paneles con estilo de videojuego.
- Modo clásico con tabs.
- Música ambiente opcional.
- Efectos de sonido.
- Descarga directa del CV.
- Links de contacto a correo, GitHub y LinkedIn.
- Proyectos con imágenes, videos, demos y repositorios cuando corresponde.
- Diseño responsive para que la escena y la interfaz se acomoden mejor a distintas pantallas.

## Tecnologías

- **React 19**
- **Vite**
- **Three.js**
- **React Three Fiber**
- **CSS custom**

Three.js se usa para la escena, luces, materiales, geometrías y texturas. React Three Fiber permite manejar esa escena desde componentes de React. El CSS se encarga de toda la parte 2D: menú, botones, paneles, efectos CRT, responsive y modo clásico.

## Estructura

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
  cv/
  projects/

dist/
```

### Archivos principales

`src/main.jsx` es el punto de entrada de React.

`src/App.jsx` maneja la aplicación principal: estados, menú inicial, modo exploración, modo clásico, paneles, música y sonidos.

`src/components/RetroRoom.jsx` contiene la habitación 3D y todos los objetos: escritorio, PC, silla, persona, pizarra, teléfono, carpeta, sillón, osito, cuadros y demás props.

`src/data/portfolio.js` guarda el contenido editable del portfolio: textos, proyectos, habilidades, educación, contacto y CV.

`src/styles.css` define la estética visual de la interfaz: botones, paneles, layout responsive, CRT, scanlines y animaciones.

`public/` contiene archivos estáticos, como audios, PDF del CV, imágenes y videos de proyectos.

`dist/` se genera automáticamente al correr el build. No se edita a mano.

## Cómo correrlo

Instalar dependencias:

```bash
npm install
```

Levantar el proyecto en desarrollo:

```bash
npm run dev
```

Generar la versión de producción:

```bash
npm run build
```

Previsualizar el build:

```bash
npm run preview
```

## Cómo editar contenido

La mayoría del contenido se cambia desde:

```txt
src/data/portfolio.js
```

Ahí se pueden modificar textos, proyectos, tecnologías, links, datos de contacto, educación, habilidades y la ruta del CV.

Si querés cambiar objetos de la habitación o su posición, el archivo principal es:

```txt
src/components/RetroRoom.jsx
```

Si querés tocar colores, tamaños, paneles, responsive o efectos visuales de la interfaz, está en:

```txt
src/styles.css
```

## Assets

Los archivos públicos se guardan en `public/`.

Ejemplos:

```txt
public/audio/ambient-loop.mp3
public/audio/teddy-sound.mp3
public/cv/benjamin-velasco-cv.pdf
public/projects/cenprofar-cover.png
public/projects/cenprofar-demo.mp4
public/projects/juego-banderas.mp4
public/projects/lista-tareas.png
```

Desde React se referencian así:

```txt
/audio/ambient-loop.mp3
/cv/benjamin-velasco-cv.pdf
/projects/cenprofar-cover.png
```

## Deploy

El proyecto está preparado para publicarse como sitio estático. Para producción se usa:

```bash
npm run build
```

Ese comando genera la carpeta `dist/`, que es la salida que usan servicios como Vercel, Netlify o Firebase Hosting.

Configuración típica en Vercel:

```txt
Build command: npm run build
Output directory: dist
```

## Notas

El audio se reproduce después de una interacción del usuario porque los navegadores bloquean autoplay con sonido.

Los objetos 3D recién se pueden tocar después de presionar **INICIAR**.

Si más adelante agrego más proyectos, una mejora pendiente sería sumar paginación o carrusel dentro del panel de proyectos.

También se podría optimizar el tamaño del bundle separando la escena 3D con carga diferida, aunque actualmente el build funciona correctamente.
