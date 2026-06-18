# Retro 3D Portfolio

Portfolio interactivo con estetica retro 3D, inspirado en el look low poly de juegos de PlayStation 2 y experiencias web de principios de los 2000. La idea principal es presentar la informacion profesional como si fuera una habitacion explorable, donde cada objeto funciona como acceso a una seccion del portfolio.

## Tecnologias

- React 19 para la interfaz principal.
- Vite como entorno de desarrollo y build.
- Three.js para la escena 3D.
- React Three Fiber para integrar Three.js con React.
- React Three Drei para utilidades de camara, texto y controles 3D.
- CSS custom para la identidad visual, CRT, scanlines, menus retro y paneles estilo videojuego.

## Concepto

El portfolio funciona como un pequeno mundo interactivo. Al presionar START, el menu inicial desaparece y la camara entra en modo exploracion. El usuario puede hacer click en objetos de la habitacion para abrir distintas secciones:

- PC: Projects.
- Pizarra: Skills.
- Puerta: About Me.
- Campus low poly: Education.
- Telefono: Contact.
- Carpeta: CV.

Tambien incluye un modo Classic Mode para ver el contenido en formato rapido y tradicional, organizado por tabs.

## Features principales

- Escena 3D low poly con ambientacion oscura y nostalgica.
- Objetos interactivos con hover, cursor pointer, brillo y tooltips.
- Paneles con estilo de videojuego retro:
  - MISSION SELECT para proyectos.
  - PLAYER STATS para habilidades.
  - CHARACTER PROFILE para perfil personal.
- Efecto CRT con scanlines.
- Musica ambiente synthwave opcional.
- Efectos de sonido sutiles para hover, click, start y apertura de paneles.
- Quick View / Classic Mode para navegacion mas directa.
- Props decorativos para reforzar la narrativa de habitacion de programador.

## Instalacion

Clonar el repositorio e instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Generar build de produccion:

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

## Personalizacion

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

El usuario puede activar o desactivar la musica desde el boton de sonido de la interfaz. Por compatibilidad con navegadores, el audio se reproduce despues de una interaccion del usuario.

## Estado

Proyecto en desarrollo. La base visual e interactiva ya esta implementada, pero quedan posibles mejoras futuras:

- Agregar links reales a proyectos.
- Incorporar descarga directa del CV en PDF.
- Mejorar animaciones de camara por seccion.
- Agregar mas detalles narrativos sin perder claridad visual.
- Optimizar assets si el bundle crece demasiado.
