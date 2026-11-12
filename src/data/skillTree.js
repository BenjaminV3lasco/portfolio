export const skillPaths = [
  {
    id: "web", label: "Desarrollo web",
    nodes: [
      { id: "web-base", title: "Bases de la web", skills: ["HTML", "CSS", "JavaScript"], description: "HTML estructura el contenido, CSS define su presentación y JavaScript aporta comportamiento. Son la base de mis interfaces web." },
      { id: "components", parent: "web-base", title: "Interfaces y componentes", skills: ["TypeScript", "React", "Tailwind CSS"], description: "React organiza la interfaz en componentes. TypeScript suma tipos al código y Tailwind CSS facilita componer estilos. Son herramientas complementarias, no requisitos entre sí." },
      { id: "apps", parent: "components", title: "Aplicaciones Full Stack", skills: ["Next.js", "T3 Stack"], description: "Next.js amplía el desarrollo con React hacia aplicaciones completas. En T3 conecto este trabajo con TypeScript, tRPC y Prisma, presentes en la ruta de backend." },
      { id: "3d", parent: "web-base", title: "Experiencias 3D", skills: ["Three.js", "React Three Fiber"], description: "Three.js permite construir escenas 3D. React Three Fiber las integra con componentes React: esa combinación da forma a este portfolio. No necesita Next.js." },
    ],
  },
  {
    id: "data", label: "Backend y datos",
    nodes: [
      { id: "storage", title: "Persistencia", skills: ["MySQL", "PostgreSQL"], description: "El modelado, las relaciones y las consultas permiten guardar y recuperar información de los sistemas. MySQL y PostgreSQL son alternativas, no etapas consecutivas." },
      { id: "services", parent: "storage", title: "Acceso a datos y servicios", skills: ["Prisma (ORM)", "Supabase", "Firebase", "Airtable"], description: "Prisma conecta el código con bases de datos. Supabase, Firebase y Airtable ofrecen distintas formas de gestionar datos y servicios; elijo según el proyecto, no como una cadena obligatoria." },
      { id: "integration", parent: "storage", title: "Comunicación entre sistemas", skills: ["tRPC", "APIs REST", "Webhooks"], description: "Uso tRPC y APIs REST para intercambiar datos. Los webhooks notifican eventos a otros sistemas y conectan esta ruta con automatización." },
    ],
  },
  {
    id: "automation", label: "Automatización",
    nodes: [
      { id: "flows", title: "Flujos y procesos", skills: ["n8n", "Zapier"], description: "Conecto disparadores, datos y acciones para automatizar tareas. APIs REST y webhooks, en Backend y datos, son parte de estas integraciones." },
      { id: "crm", parent: "flows", title: "CRM y conversaciones", skills: ["GoHighLevel", "ManyChat", "Funnelchat", "WhatsApp / 2Chat"], description: "Estas herramientas apoyan el seguimiento comercial y la mensajería. Los flujos coordinan información y acciones entre ellas según las necesidades del equipo." },
      { id: "operations", parent: "flows", title: "Agendas y operación", skills: ["Calendly", "Google Sheets", "Discord", "Skool"], description: "Calendarios, planillas y plataformas de comunidad forman parte del entorno operativo. No dependen unas de otras: se integran cuando el proceso lo necesita." },
    ],
  },
  {
    id: "architecture", label: "Arquitectura",
    nodes: [
      { id: "programming", title: "Fundamentos de programación", skills: ["Java", "C"], description: "Mi formación en programación aporta lógica, estructuras de datos y resolución de problemas. Son conocimientos transferibles, no requisitos específicos para Docker o RabbitMQ." },
      { id: "async", parent: "programming", title: "Sistemas desacoplados", skills: ["RabbitMQ", "Docker", "Pruebas de estrés"], description: "En el proyecto de mensajería combiné colas, entornos en contenedores y pruebas de carga para estudiar concurrencia y tolerancia a fallos." },
      { id: "deploy", parent: "programming", title: "Publicación web", skills: ["Vercel"], description: "Publico aplicaciones web y verifico su comportamiento fuera del entorno local. Esta rama complementa el desarrollo web; no depende de RabbitMQ." },
    ],
  },
  {
    id: "ai", label: "IA y análisis",
    nodes: [
      { id: "python", title: "Código y preparación de datos", skills: ["Python"], description: "Uso Python para scripts y trabajo con datos. Es también la base técnica de mi tesis en curso." },
      { id: "ml", parent: "python", title: "Modelado predictivo", skills: ["Machine Learning (tesis en curso)", "Random Forest (tesis)"], description: "En mi tesis sobre deserción estudiantil trabajo con aprendizaje automático y Random Forest. Es una línea de formación en curso, no un producto terminado." },
      { id: "llm", title: "IA aplicada a procesos", skills: ["Integración de modelos de lenguaje"], description: "Integro modelos en flujos para generar resúmenes, con validación de resultados. Se conecta con automatización y APIs; no requiere entrenar un modelo propio." },
      { id: "metrics", title: "Medición", skills: ["Métricas y seguimiento UTM"], description: "Organizo métricas y parámetros UTM para analizar campañas. Complementa los dashboards y automatizaciones, sin confundirse con modelado predictivo." },
    ],
  },
  {
    id: "team", label: "Trabajo en equipo",
    nodes: [
      { id: "collaboration", title: "Construcción colaborativa", skills: ["Git", "GitHub", "Jira", "Slack", "Figma", "Miro", "Notion"], description: "Versionado, coordinación, diseño y documentación acompañan todo el desarrollo. Cada herramienta cumple una función distinta dentro del equipo." },
      { id: "practice", parent: "collaboration", title: "Del problema a la solución", skills: ["Resolución de problemas", "Trabajo en equipo", "Relevamiento de procesos", "Documentación funcional", "Validación con usuarios"], description: "Entender la necesidad, acordar una solución y comprobarla con usuarios conecta las decisiones técnicas con el trabajo real." },
      { id: "languages", parent: "collaboration", title: "Comunicación e idiomas", skills: ["Español · nativo", "Inglés · B1 estimado, lectura técnica y oral básico"], description: "La comunicación sostiene el trabajo en equipo. La lectura técnica en inglés me permite consultar documentación y seguir aprendiendo." },
    ],
  },
];
