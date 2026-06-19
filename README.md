# Retro 3D Portfolio

Portfolio interactivo con estética retro 3D, inspirado en el look low poly de juegos de PlayStation 2 y experiencias web de principios de los 2000. La idea principal es presentar la información profesional como si fuera una habitación explorable, donde cada objeto funciona como acceso a una sección del portfolio.

## Tecnologías

- React 19 para la interfaz principal.
- Vite como entorno de desarrollo y build.
- Three.js para la escena 3D.
- React Three Fiber para integrar Three.js con React.
- React Three Drei para utilidades de cámara, texto y controles 3D.
- CSS custom para la identidad visual, CRT, scanlines, menús retro y paneles estilo videojuego.

## Concepto

El portfolio funciona como un pequeño mundo interactivo. Al presionar INICIAR, el menú inicial desaparece y la cámara entra en modo exploración. El usuario puede hacer clic en objetos de la habitación para abrir distintas secciones:

- PC: Proyectos.
- Pizarra: Habilidades.
- Puerta: Sobre mí.
- Campus low poly: Educación.
- Teléfono: Contacto.
- Carpeta: CV.

También incluye un modo clásico para ver el contenido en formato rápido y tradicional, organizado por tabs.

## Features principales

- Escena 3D low poly con ambientación oscura y nostálgica.
- Objetos interactivos con hover, cursor pointer, brillo y tooltips.
- Paneles con estilo de videojuego retro:
  - SELECCIÓN DE MISIÓN para proyectos.
  - ESTADÍSTICAS para habilidades.
  - PERFIL DEL PERSONAJE para perfil personal.
- Efecto CRT con scanlines.
- Música ambiente synthwave opcional.
- Efectos de sonido sutiles para hover, clic, inicio y apertura de paneles.
- Vista rápida / modo clásico para navegación más directa.
- Props decorativos para reforzar la narrativa de habitación de programador.

## Instalación

Clonar el repositorio e instalar dependencias:

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

## Estructura del proyecto

```txt
src/
  App.jsx
  components/
    RetroRoom.jsx
  data/
    portfolio.js
  styles.css
public/
  audio/
    ambient-loop.mp3
```

## Personalización

El contenido textual del portfolio se modifica principalmente en:

```txt
src/data/portfolio.js
```

La escena 3D y los objetos interactivos se encuentran en:

```txt
src/components/RetroRoom.jsx
```

La identidad visual, responsive layout, efectos CRT y paneles se ajustan en:

```txt
src/styles.css
```

## Audio

El proyecto usa un loop ambiente ubicado en:

```txt
public/audio/ambient-loop.mp3
```

El usuario puede activar o desactivar la música desde el botón de sonido de la interfaz. Por compatibilidad con navegadores, el audio se reproduce después de una interacción del usuario.

## Estado

Proyecto en desarrollo. La base visual e interactiva ya está implementada, pero quedan posibles mejoras futuras:

- Agregar links reales a proyectos.
- Incorporar descarga directa del CV en PDF.
- Mejorar animaciones de cámara por sección.
- Agregar mas detalles narrativos sin perder claridad visual.
- Optimizar assets si el bundle crece demasiado.
