export const menuItems = [
  { id: "start", label: "START" },
  { id: "projects", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
  { id: "about", label: "ABOUT ME" },
  { id: "contact", label: "CONTACT" },
  { id: "cv", label: "DOWNLOAD CV" },
];

export const sections = {
  about: {
    label: "ABOUT ME",
    title: "CHARACTER PROFILE",
    subtitle: "Name: Benjamin Velasco",
    body: "Information Systems Engineering student and full stack developer in progress. I like building useful web systems, management tools and interactive digital experiences.",
    lines: ["Class: Developer", "Location: Argentina", "Mode: Learning by building"],
  },
  projects: {
    label: "PROJECTS",
    title: "MISSION LOG",
    subtitle: "Selected work",
    body: "Projects are presented as missions. The idea is to later connect each mission to a live demo, GitHub repo and a detailed case study.",
    lines: [
      "MISSION 01 - Credit Card Management System",
      "MISSION 02 - Academic Dashboard",
      "MISSION 03 - REST API Management",
      "MISSION 04 - Retro 3D Portfolio",
    ],
  },
  skills: {
    label: "SKILLS",
    title: "SKILL STATS",
    subtitle: "Current build",
    body: "A character-stat screen for your technical stack, split by frontend, backend, databases and tools.",
    lines: [
      "Frontend        ########.. 80%",
      "Backend         #######... 70%",
      "Databases       ######.... 60%",
      "Problem Solving ########.. 80%",
    ],
  },
  education: {
    label: "EDUCATION",
    title: "ACADEMY FILE",
    subtitle: "Information Systems Engineering",
    body: "This section can live behind the room door, like entering the academy area of the map.",
    lines: ["Status: In progress", "Focus: Web systems", "Interests: Databases, software engineering, AI"],
  },
  contact: {
    label: "CONTACT",
    title: "CONTACT TERMINAL",
    subtitle: "Open channel",
    body: "A terminal-style contact screen for email, GitHub, LinkedIn and a future message form.",
    lines: ["Email: velascobenjamin14@gmail.com", "GitHub: @velascobenjamin14", "LinkedIn: Benjamin Velasco"],
  },
  cv: {
    label: "CV",
    title: "FILE CABINET",
    subtitle: "Curriculum vitae",
    body: "This will become a direct CV download once you add the PDF file to the project.",
    lines: ["Action: Download CV", "Format: PDF", "Status: Pending file"],
  },
};
