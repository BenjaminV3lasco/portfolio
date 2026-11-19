# Portfolio 3D Retro

Este es mi portfolio personal, armado como una habitación retro 3D donde cada objeto abre una parte distinta de mi perfil. La idea fue salir un poco del formato clásico de portfolio y llevarlo a algo más cercano a una experiencia interactiva, con estética low poly, tonos oscuros, scanlines y una vibra de juegos de principios de los 2000.

El proyecto está hecho con React, Vite, Three.js y React Three Fiber.

## Idea del proyecto

Al entrar aparece una pantalla inicial con el título del portfolio. Después de presionar **INICIAR**, se habilita el modo exploración y los objetos de la habitación pasan a ser interactivos.

Cada objeto representa una sección:

| Objeto | Sección |
| --- | --- |
| PC vieja | Acercamiento al monitor y escritorio de proyectos |
| Pizarra | Habilidades |
| Cuadro académico | Educación |
| Teléfono fijo | Contacto |
| Carpeta con etiqueta CV | Descargar CV |
| Credencial de perfil | Sobre mí |
| Puerta EXIT | Volver al menú inicial |
| Osito de peluche | Detalle interactivo con sonido |

También agregué un **Modo Clásico** para ver el contenido de forma más directa, sin tener que explorar la escena 3D.

## Qué tiene

- Escena 3D low poly con texturas pixeladas de pared, madera, piso y tela, e iluminación suave.
- Objetos interactivos con tooltip, hover y brillo suave.
- Teléfono con doce teclas: se iluminan al pasar el mouse o enfocarlas con el teclado y reproducen un tono corto al pulsarlas. Respetan el control de efectos de sonido.
- Placa de desarrollo, servidor pequeño y taza con un detalle de código.
- Paneles con estilo de videojuego.
- Acercamiento progresivo a los objetos de las secciones y regreso animado a la habitación. Los paneles se abren al llegar, dejando el objeto centrado a un lado o arriba en el celular. El osito conserva solamente su sonido.
- Modo clásico con tabs.
- Música ambiente opcional.
- Efectos de sonido diferenciados, con control independiente de la música y preferencia guardada.
- Descarga directa del CV.
- Links de contacto a correo, GitHub y LinkedIn.
- Proyectos con imágenes, videos, demos y repositorios cuando corresponde.
- Al tocar la PC, la cámara se acerca al monitor. Cada proyecto aparece como una carpeta: se puede buscar por nombre, abrir su ficha y ver sus enlaces o video. Escape vuelve a las carpetas y luego a la habitación; también hay un botón para salir directamente.
- Paginación de proyectos: tres por página en escritorio y uno en pantallas de hasta 1100 px.
- Perfil, datos y experiencia laboral separados en pestañas.
- Árboles desplegables de habilidades y materias: zoom con la rueda, arrastre, navegación por teclado y controles de expansión.
- Árbol académico desde la tarjeta de la carrera: años completos separados por cuatrimestres, correlativas para cursar, búsqueda y estados diferenciados por texto y color.
- Luz suave que acompaña al mouse y aros discretos en los objetos interactivos; respeta movimiento reducido y dispositivos táctiles.
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
    ProjectComputer.jsx
    FocusedPanel.jsx
    SkillsTree.jsx
    AcademicMap.jsx
    ConnectionMap.jsx
    CursorCompanion.jsx
    RetroSelect.jsx
  data/
    portfolio.js
    roomNavigation.js
    skillTree.js
    academic.js

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

`src/data/portfolio.js` guarda el contenido editable del portfolio: textos, experiencia laboral, proyectos, habilidades, educación, contacto y CV.

`src/data/roomNavigation.js` define los encuadres de los objetos en coordenadas globales. `FocusedPanel.jsx` muestra el contenido después del acercamiento y permite volver con el botón de cierre o Escape. La PC conserva su escritorio dentro del monitor. Durante los recorridos no se pueden activar otros objetos.

Los objetos se centran en el espacio libre junto al panel, sin cambiar el ángulo frontal para compensar su ancho. La nariz del osito solo reproduce el sonido, sin mover la cámara.

Para comprobar los encuadres en diez resoluciones y la curva de movimiento: `node check-navigation.mjs`.

`src/data/deskLayout.js` centraliza las ubicaciones y medidas del escritorio. `node check-desk.mjs` verifica separaciones, límites de la mesa y la distribución de las teclas del teléfono. `PhoneKeypad.jsx` coloca los botones accesibles sobre las teclas 3D; Contacto permite usarlos sin cerrar el panel.

`src/data/skillTree.js` organiza las habilidades por rutas. `SkillsTree.jsx` agrega las conexiones entre rutas; son relaciones de aprendizaje y uso, no requisitos obligatorios.

`src/data/academic.js` conserva los estados y las correlativas de las 45 materias del recorrido, incluidas mis dos optativas aprobadas. `AcademicMap.jsx` muestra cada año completo separado por cuatrimestres. Al elegir una materia se abre su rama de correlativas para cursar en `ConnectionMap.jsx`, con zoom y arrastre. Las materias compartidas tienen accesos a su rama principal para evitar cruces. Aprobadas, regularizadas y en curso tienen colores y etiquetas diferentes, sin repetir los requisitos en otra lista. Los requisitos para rendir siguen conservados en los datos. Los criterios y fuentes están en `ACADEMIC-DATA.md`; los PDF personales y las notas no se publican.

La integridad del mapa académico se comprueba con `node check-academic.mjs`.

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

El CV se guarda como `public/cv/benjamin-velasco-cv.pdf`. Para renovarlo, reemplazo ese archivo manteniendo el nombre; así no cambia el enlace de descarga.

La experiencia incluye Kaizen Software (mayo a agosto de 2026) y Simple Business (agosto a noviembre de 2026). En Educación separo la práctica laboral finalizada de la entrega académica final de la PPS, que sigue pendiente junto con la tesis.

Los proyectos incluyen Cenprofar, MundoQuiz (antes Juego de banderas), Lista de tareas y este portfolio. El trabajo en Simple Business se describe en Experiencia laboral, no como proyectos separados. No publico datos de clientes ni accesos internos, ni agrego demos o capturas que todavía no tengo para mostrar.

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
Antes de entrar tampoco aparecen los marcadores interactivos ni la luz que sigue al cursor. Dentro del monitor, los objetos de la habitación quedan bloqueados hasta volver. En móvil el escritorio ocupa una vista ampliada para mantener legibles los proyectos.

Los proyectos nuevos se agregan al arreglo `projects` y la paginación se adapta automáticamente. Las propiedades `image` y `video` son opcionales; `actions` puede quedar vacío si no hay enlaces públicos.

También se podría optimizar el tamaño del bundle separando la escena 3D con carga diferida, aunque actualmente el build funciona correctamente.
