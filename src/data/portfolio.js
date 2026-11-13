export const menuItems = [
  { id: "start", label: "INICIAR" },
  { id: "classic", label: "MODO CLÁSICO" },
];

export const sections = {
  about: {
    label: "SOBRE MÍ",
    title: "PERFIL DEL PERSONAJE",
    subtitle: "Nombre: Leonelo Benjamín Velasco Monticone",
    body: "Soy desarrollador Full Stack y me interesa crear aplicaciones web útiles, claras y bien pensadas. Trabajé en desarrollo web en Kaizen Software y en sistemas de gestión, CRM y automatización de procesos en Simple Business. Me gusta conectar herramientas, resolver necesidades reales y validar las soluciones con quienes las usan. Sigo aprendiendo, tanto en lo técnico como en mi forma de trabajar en equipo.",
    lines: [],
    facts: [
      { label: "Rol", value: "Desarrollador Full Stack" },
      { label: "Área de interés", value: "Desarrollo web, sistemas de gestión e integración de sistemas" },
      { label: "Ubicación", value: "Villa Mercedes, San Luis, Argentina" },
      { label: "Fortalezas", value: "Resolución de problemas, trabajo colaborativo, aprendizaje continuo y validación con usuarios" },
      { label: "Stack de desarrollo", value: "TypeScript, React, Next.js, tRPC, Prisma y PostgreSQL" },
      { label: "Automatización y CRM", value: "Airtable, n8n, Zapier, GoHighLevel, APIs REST y webhooks" },
    ],
    experience: [
      {
        company: "Simple Business",
        role: "Desarrollo de software y automatización",
        period: "08/2026 - 11/2026",
        contributions: [
          "Desarrollo de dashboards y aplicaciones web con React, TypeScript, Next.js y Supabase/PostgreSQL para gestión comercial y operativa.",
          "Implementación de bases, interfaces y reportes en Airtable y CRM en GoHighLevel; tableros Kanban, calendarios de seguimiento y gestión de ventas, pagos y comisiones.",
          "Desarrollo y depuración de automatizaciones con n8n, Zapier, APIs REST y webhooks para conectar calendarios, formularios y mensajería.",
          "Seguimiento de campañas mediante UTMs, consolidación de métricas y automatización de resúmenes con IA para apoyar el trabajo comercial.",
          "Relevamiento de procesos, documentación funcional, pruebas y validación con usuarios, distinguiendo implementaciones de propuestas pendientes.",
        ],
      },
      {
        company: "Kaizen Software",
        role: "Full Stack Developer · Práctica Profesional Supervisada",
        period: "05/2026 - 08/2026",
        contributions: [
          "Desarrollo y mantenimiento de Cenprofar con TypeScript, Next.js, tRPC y Prisma, trabajando tanto en frontend como en backend.",
          "Implementación de Farmacias de Turno, su lógica asociada, el panel de gestión de farmacias y el calendario de turnos.",
          "Trabajo colaborativo sobre una base de código existente e integración al flujo de desarrollo del equipo.",
        ],
      },
    ],
  },
  projects: {
    label: "PROYECTOS",
    title: "SELECCIÓN DE MISIÓN",
    subtitle: "Trabajos seleccionados",
    body: "Cada proyecto funciona como una misión: un problema concreto, un stack técnico y una solución construida o en progreso.",
    lines: [],
    projects: [
      {
        code: "MISIÓN 01",
        title: "Cenprofar",
        image: "/projects/cenprofar-cover.png",
        video: "/projects/cenprofar-demo.mp4",
        description: "Aplicación web profesional de Cenprofar. Participé como desarrollador en Farmacias de Turno, la lógica asociada, el panel de gestión de farmacias y el calendario para administrar turnos.",
        status: "Proyecto profesional",
        tech: ["T3 Stack", "React", "Next.js", "TypeScript", "tRPC", "Prisma", "Tailwind CSS"],
        actions: [
          { label: "Sitio", href: "https://cenprofar.ar" },
          { label: "Privado", disabled: true },
        ],
      },
      {
        code: "MISIÓN 02",
        title: "MundoQuiz",
        video: "/projects/juego-banderas.mp4",
        description: "Juego web para practicar reconocimiento de banderas, desarrollado con JavaScript, HTML y CSS puro, sin frameworks. Usé Firebase para el hosting y la base de datos donde se guardan los datos de usuarios.",
        status: "Público",
        tech: ["JavaScript", "HTML", "CSS", "Firebase"],
        actions: [
          { label: "Demo", href: "https://juego-banderas-ivory.vercel.app/" },
          { label: "GitHub", href: "https://github.com/BenjaminV3lasco/juego_banderas" },
        ],
      },
      {
        code: "MISIÓN 03",
        title: "Lista de tareas",
        image: "/projects/lista-tareas.png",
        description: "Task tracker desarrollado con React para el examen final de la materia Programación Web. Permite organizar tareas, seguir progreso y consultar reportes.",
        status: "Público",
        tech: ["React", "JavaScript", "CSS", "Vercel"],
        actions: [
          { label: "Demo", href: "https://lista-tareas-2qf6e6qj5-benjaminv3lascos-projects.vercel.app" },
          { label: "GitHub", href: "https://github.com/BenjaminV3lasco/lista-tareas" },
        ],
      },
      {
        code: "MISIÓN 04",
        title: "Portfolio 3D interactivo",
        description: "Desarrollé esta habitación retro low poly: objetos interactivos, animaciones, audio, cámara responsive y modo clásico. Construida con React y Three.js y desplegada en Vercel.",
        status: "Proyecto personal",
        tech: ["React", "Three.js", "React Three Fiber", "Vite", "CSS", "Vercel"],
        actions: [{ label: "GitHub", href: "https://github.com/BenjaminV3lasco/portfolio" }],
      },
    ],
  },
  skills: {
    label: "HABILIDADES",
    title: "ÁRBOL DE HABILIDADES",
    subtitle: "Conocimientos y conexiones",
    body: "",
    lines: [],
    skillGroups: [
      {
        title: "Lenguajes",
        items: [
          { name: "TypeScript" },
          { name: "JavaScript" },
          { name: "Python" },
          { name: "Java" },
          { name: "C" },
        ],
      },
      {
        title: "Frontend y estilos",
        items: [
          { name: "HTML" },
          { name: "CSS" },
          { name: "Tailwind CSS" },
        ],
      },
      {
        title: "Frameworks y librerías",
        items: [
          { name: "React" },
          { name: "Next.js" },
          { name: "Three.js" },
          { name: "React Three Fiber" },
        ],
      },
      {
        title: "Stack de trabajo",
        items: [
          { name: "T3 Stack" },
        ],
      },
      {
        title: "Backend e integración",
        items: [{ name: "tRPC" }, { name: "APIs REST" }, { name: "Webhooks" }, { name: "Prisma (ORM)" }],
      },
      {
        title: "Bases de datos y plataformas",
        items: [
          { name: "MySQL" },
          { name: "PostgreSQL" },
          { name: "Supabase" },
          { name: "Firebase" },
          { name: "Airtable" },
        ],
      },
      {
        title: "Automatización y CRM",
        items: [{ name: "n8n" }, { name: "Zapier" }, { name: "GoHighLevel" }, { name: "ManyChat" }, { name: "Funnelchat" }],
      },
      {
        title: "Calendarios, mensajería y comunidades",
        items: [{ name: "Calendly" }, { name: "Google Sheets" }, { name: "WhatsApp / 2Chat" }, { name: "Discord" }, { name: "Skool" }],
      },
      {
        title: "Arquitectura y despliegue",
        items: [{ name: "RabbitMQ" }, { name: "Docker" }, { name: "Vercel" }, { name: "Pruebas de estrés" }],
      },
      {
        title: "Herramientas de trabajo",
        items: [{ name: "Git" }, { name: "GitHub" }, { name: "Jira" }, { name: "Slack" }, { name: "Figma" }, { name: "Miro" }, { name: "Notion" }],
      },
      {
        title: "IA y análisis de datos",
        items: [{ name: "Machine Learning (tesis en curso)" }, { name: "Random Forest (tesis)" }, { name: "Integración de modelos de lenguaje" }, { name: "Métricas y seguimiento UTM" }],
      },
      {
        title: "Habilidades profesionales",
        items: [{ name: "Resolución de problemas" }, { name: "Trabajo en equipo" }, { name: "Relevamiento de procesos" }, { name: "Documentación funcional" }, { name: "Validación con usuarios" }],
      },
      {
        title: "Idiomas",
        items: [
          { name: "Español · nativo" },
          { name: "Inglés · B1 estimado, lectura técnica y oral básico" },
        ],
      },
    ],
  },
  education: {
    label: "EDUCACIÓN",
    title: "ARCHIVO ACADÉMICO",
    subtitle: "Ingeniería en Sistemas de Información",
    body: "Mi recorrido académico comenzó en 2021, cuando me decidí por estudiar la carrera de Ingeniería en Sistemas de Información en la Universidad Nacional de Villa Mercedes. En mayo de 2026 obtuve el título intermedio de Analista Universitario en Sistemas, un logro importante dentro de la carrera y una base clave para seguir creciendo en desarrollo de software, bases de datos, sistemas de información e ingeniería de software.",
    lines: [],
    facts: [
      { label: "Universidad", value: "Universidad Nacional de Villa Mercedes", detail: "UNViMe" },
      { label: "Carrera", value: "Ingeniería en Sistemas de Información" },
      { label: "Formación alcanzada", value: "Analista Universitario en Sistemas" },
      { label: "Estado académico", value: "Etapa final: tesis y entrega final de PPS pendientes" },
      { label: "Tesis en curso", value: "Modelo Predictivo de Deserción Estudiantil" },
      { label: "Tecnologías de tesis", value: "Python, Machine Learning y Random Forest" },
      { label: "Enfoque", value: "Desarrollo web, sistemas de información y software" },
    ],
  },
  contact: {
    label: "CONTACTO",
    title: "TERMINAL DE CONTACTO",
    subtitle: "¿Querés que trabajemos juntos?",
    body: "Si tenés un proyecto, una propuesta o simplemente querés charlar sobre desarrollo, escribime. Podés contactarme por correo o LinkedIn, y conocer más de mi trabajo en GitHub.",
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
        href: "https://www.linkedin.com/in/benjamín-velasco-7157b1253/",
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
