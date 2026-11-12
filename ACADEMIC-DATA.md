# Datos del mapa académico

El mapa es una representación del plan, no un sistema oficial de inscripción.

## Fuentes revisadas

- Resolución Rectoral 51/2018: tablas de correlatividades de las páginas 17 a 20. Se mantienen separadas las regulares para cursar, aprobadas para cursar y aprobadas para rendir.
- Plan de estudios SIU, 672/2017 v3, emitido el 11/11/2026: año, cuatrimestre, opciones y estados de cursada.
- Historia académica del 11/11/2026: 42 materias aprobadas por examen o promoción. No se publican calificaciones, promedios, legajo ni los PDF personales.

## Criterios

- Bioinformática: regularizada. El origen del registro es Regularidad; no corresponde mostrarla como final aprobado.
- PPS y Proyecto Final: en curso según el plan. La finalización laboral de la PPS no equivale a su aprobación académica.
- Análisis Estático de Programas y Sistemas de Costos y Presupuestos: aprobadas y confirmadas por el usuario como sus dos optativas el 12/11/2026. Se muestran las materias reales con sus correlativas, sin duplicarlas con espacios genéricos Optativa I/II ni atribuir un orden administrativo no confirmado.
- Las optativas no cursadas se excluyen del portfolio por pedido del usuario. El conjunto publicado contiene 45 materias, incluidas las dos optativas aprobadas, sin duplicar los espacios genéricos.
- Analista Universitario en Sistemas: primeros tres años completos, 28 materias incluidas las de Sistemas de Representación. Se muestra como hito obtenido.
- PPS y Proyecto Final: 80 % de asignaturas aprobadas para comenzar. Proyecto Final exige todas aprobadas para rendir. Se describen estas condiciones sin inventar correlativas nominales.

## Correspondencia de códigos

Sistemas de Representación es 35-60 en la resolución y 35-45 en SIU. Las optativas 35-45 a 35-59 de la resolución aparecen como 35-145 a 35-159 en SIU. La correspondencia se hizo por nombre, conservando ambos códigos en `src/data/academic.js`.

## Mantenimiento

Los estados y correlativas se editan en `src/data/academic.js`. Al recibir un nuevo historial, revisar el origen de cada aprobación y actualizar la fecha de corte; no inferir finales aprobados a partir de una regularidad.

Las conexiones de `src/components/SkillsTree.jsx` son sinergias conceptuales y no requisitos universitarios. El mapa académico sí usa las tres columnas de la resolución.
