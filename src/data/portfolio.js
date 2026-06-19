export const menuItems = [
  { id: "start", label: "INICIAR" },
  { id: "classic", label: "MODO CLÁSICO" },
];

export const sections = {
  about: {
    label: "SOBRE MI",
    title: "PERFIL DEL PERSONAJE",
    subtitle: "Nombre: Leonelo Benjamín Velasco Monticone",
    body: "Analista Universitario en Sistemas y estudiante avanzado de Ingeniería en Sistemas de Información. Actualmente curso el último año de la carrera y realizo mi Práctica Profesional Supervisada en Kaizen Software, donde participo en el desarrollo de Cenprofar, una aplicación real de entorno profesional. Me interesa crear sistemas web útiles, claros y bien pensados. Me gusta aprender construyendo, trabajar en equipo y mejorar mis habilidades técnicas mientras participo en proyectos reales.",
    lines: [],
    facts: [
      { label: "Carrera", value: "Ingeniería en Sistemas de Información" },
      { label: "Título intermedio", value: "Analista Universitario en Sistemas" },
      { label: "Experiencia actual", value: "PPS en Kaizen Software" },
      { label: "Proyecto", value: "Cenprofar" },
      { label: "Enfoque", value: "Desarrollo web full stack" },
      { label: "Stack actual", value: "React, Next.js, TypeScript, Tailwind, T3" },
      { label: "Ubicación", value: "San Luis, Villa Mercedes, Argentina" },
    ],
  },
  projects: {
    label: "PROYECTOS",
    title: "SELECCIÓN DE MISIÓN",
    subtitle: "Trabajos seleccionados",
    body: "Los proyectos se presentan como misiones. La idea es conectar cada una con una demo, un repositorio de GitHub y una explicación más detallada.",
    lines: [
      "MISIÓN 01 - Sistema de gestión de tarjetas",
      "MISIÓN 02 - Panel académico",
      "MISIÓN 03 - Gestión de API REST",
      "MISIÓN 04 - Portfolio retro 3D",
    ],
  },
  skills: {
    label: "HABILIDADES",
    title: "ESTADÍSTICAS",
    subtitle: "Versión actual",
    body: "",
    lines: [],
    skillGroups: [
      {
        title: "Lenguajes",
        items: [
          { name: "JavaScript", level: 60 },
          { name: "TypeScript", level: 40 },
          { name: "Java", level: 45 },
          { name: "C", level: 30 },
        ],
      },
      {
        title: "Frontend y estilos",
        items: [
          { name: "HTML", level: 65 },
          { name: "CSS", level: 55 },
          { name: "Tailwind CSS", level: 45 },
        ],
      },
      {
        title: "Frameworks y librerías",
        items: [
          { name: "React", level: 55 },
          { name: "Next.js", level: 40 },
        ],
      },
      {
        title: "Stack de trabajo",
        items: [
          { name: "T3 Stack", level: 35 },
        ],
      },
      {
        title: "Base de datos",
        items: [
          { name: "MySQL", level: 45 },
          { name: "PostgreSQL", level: 40 },
        ],
      },
      {
        title: "Idiomas",
        items: [
          { name: "Inglés", level: 60 },
        ],
      },
    ],
  },
  education: {
    label: "EDUCACIÓN",
    title: "ARCHIVO ACADÉMICO",
    subtitle: "Ingeniería en Sistemas de Información",
    body: "Esta sección representa mi camino académico, como una zona del mapa dedicada a la formación y al aprendizaje.",
    lines: ["Estado: En curso", "Enfoque: Sistemas web", "Intereses: Bases de datos, ingeniería de software, IA"],
  },
  contact: {
    label: "CONTACTO",
    title: "TERMINAL DE CONTACTO",
    subtitle: "Canal abierto",
    body: "Elegir un canal para abrir una línea directa.",
    lines: [],
    links: [
      {
        label: "Correo",
        icon: "email",
        href: "mailto:velascobenjamin14@gmail.com",
      },
      {
        label: "GitHub",
        icon: "github",
        href: "https://github.com/BenjaminV3lasco",
      },
      {
        label: "LinkedIn",
        icon: "linkedin",
        href: "https://www.linkedin.com/in/benjamin-velasco-7157b1253/",
      },
    ],
  },
  cv: {
    label: "CV",
    title: "ARCHIVO CV",
    subtitle: "Currículum vitae",
    body: "Descarga mi CV en formato PDF para ver mi información profesional completa.",
    lines: [],
    links: [
      {
        label: "Descargar CV",
        icon: "cv",
        href: "/cv/benjamin-velasco-cv.pdf",
        download: "benjamin-velasco-cv.pdf",
      },
    ],
  },
};
