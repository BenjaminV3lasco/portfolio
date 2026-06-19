export const menuItems = [
  { id: "start", label: "INICIAR" },
  { id: "classic", label: "MODO CLASICO" },
];

export const sections = {
  about: {
    label: "SOBRE MI",
    title: "PERFIL DEL PERSONAJE",
    subtitle: "Nombre: Benjamin Velasco",
    body: "Estudiante de Ingenieria en Sistemas de Informacion y desarrollador full stack en formacion. Me gusta crear sistemas web utiles, herramientas de gestion y experiencias digitales interactivas.",
    lines: ["Clase: Desarrollador", "Ubicacion: Argentina", "Modo: Aprender construyendo"],
  },
  projects: {
    label: "PROYECTOS",
    title: "SELECCION DE MISION",
    subtitle: "Trabajos seleccionados",
    body: "Los proyectos se presentan como misiones. La idea es conectar cada una con una demo, un repositorio de GitHub y una explicacion mas detallada.",
    lines: [
      "MISION 01 - Sistema de gestion de tarjetas",
      "MISION 02 - Panel academico",
      "MISION 03 - Gestion de API REST",
      "MISION 04 - Portfolio retro 3D",
    ],
  },
  skills: {
    label: "HABILIDADES",
    title: "ESTADISTICAS",
    subtitle: "Version actual",
    body: "Una pantalla de estadisticas para mostrar el stack tecnico, separado por frontend, backend, bases de datos y herramientas.",
    lines: [
      "Frontend        ########.. 80%",
      "Backend         #######... 70%",
      "Bases de datos  ######.... 60%",
      "Resolucion      ########.. 80%",
    ],
  },
  education: {
    label: "EDUCACION",
    title: "ARCHIVO ACADEMICO",
    subtitle: "Ingenieria en Sistemas de Informacion",
    body: "Esta seccion representa mi camino academico, como una zona del mapa dedicada a la formacion y al aprendizaje.",
    lines: ["Estado: En curso", "Enfoque: Sistemas web", "Intereses: Bases de datos, ingenieria de software, IA"],
  },
  contact: {
    label: "CONTACTO",
    title: "TERMINAL DE CONTACTO",
    subtitle: "Canal abierto",
    body: "Elegir un canal para abrir una linea directa.",
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
    subtitle: "Curriculum vitae",
    body: "Descarga mi CV en formato PDF para ver mi informacion profesional completa.",
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
