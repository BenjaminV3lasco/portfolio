// Correlativas: Resolución R. 51/2018, pp. 17-20.
// Estados: historia académica y plan 672/2017 v3, emitidos el 11/11/2026.
// Solo se publica el estado: no notas, legajo ni documentos personales.
const rows = [
  [1, "Matemática Discreta", 1, 1, [], [], []],
  [2, "Introducción al Análisis Matemático", 1, 1, [], [], []],
  [3, "Introducción a la Programación", 1, 1, [], [], []],
  [4, "Química", 1, 1, [], [], []],
  [5, "Álgebra Lineal y Geometría Analítica", 1, 2, [1], [], [1]],
  [6, "Cálculo I", 1, 2, [2], [], [2]],
  [7, "Algoritmos y Estructuras de Datos I", 1, 2, [3], [], [3]],
  [8, "Arquitectura de Computadoras", 1, 2, [3], [], [3]],
  [9, "Cálculo II", 2, 1, [5, 6], [1], [5, 6]],
  [10, "Física I", 2, 1, [2], [], [2]],
  [11, "Algoritmos y Estructuras de Datos II", 2, 1, [7], [3], [7]],
  [12, "Sistemas de Información I", 2, 1, [3], [], [3]],
  [45, "Sistemas de Representación", 2, 1, [3], [], [3]],
  [13, "Física II", 2, 2, [10], [2], [10]],
  [14, "Paradigmas de Programación", 2, 2, [11], [7], [11]],
  [15, "Sistemas de Información II", 2, 2, [12], [3], [12]],
  [16, "Probabilidad y Estadística", 2, 2, [9], [5, 6], [9]],
  [17, "Bases de Datos", 2, 2, [11], [7], [11]],
  [18, "Ingeniería de Software I", 3, 1, [15, 17], [11], [15, 17]],
  [19, "Sistemas Operativos", 3, 1, [11], [7, 8], [8, 11]],
  [20, "Redes", 3, 1, [14], [11], [14]],
  [21, "Física III", 3, 1, [13], [4, 10], [13]],
  [22, "Inglés", 3, 1, [], [], []],
  [23, "Organización Empresarial", 3, 2, [15, 16], [9, 12], [15, 16]],
  [24, "Análisis y Diseño de Algoritmos", 3, 2, [14, 16], [9, 11], [14, 16]],
  [25, "Ingeniería de Software II", 3, 2, [18], [15, 17], [18]],
  [26, "Programación Web", 3, 2, [18, 20], [14, 17], [18, 20]],
  [27, "Ética y Habilitación Profesional", 3, 2, [18], [9], [18]],
  [28, "Reingeniería de Sistemas", 4, 1, [25], [18], [25]],
  [29, "Gestión Ambiental", 4, 1, [27], [15, 21], [27]],
  [30, "Investigación Operativa", 4, 1, [24], [14, 15, 16], [24]],
  [31, "Teoría de la Computación", 4, 1, [24], [14, 16], [24]],
  [32, "Métodos Numéricos", 4, 1, [14], [9, 11], [14]],
  [33, "Inteligencia Artificial", 4, 2, [31], [24], [31]],
  [34, "Compiladores", 4, 2, [31], [19, 24], [31]],
  [35, "Modelos y Simulación", 4, 2, [24], [16, 25], [24]],
  [36, "Elementos de Economía", 4, 2, [23], [15, 16], [23]],
  [37, "Sistemas Distribuidos y Paralelos", 4, 2, [25], [20], [25]],
  [38, "Auditoría y Peritaje de Sistemas", 5, 1, [28], [25], [28]],
  [39, "Base de Datos Avanzadas", 5, 1, [37], [17], [37]],
  [42, "Bioinformática", 5, 1, [35, 37], [31], [35, 37]],
  [43, "Práctica Profesional Supervisada", 5, 2, [], [], []],
  [44, "Proyecto Final", 5, 2, [], [], []],
  [148, "Análisis Estático de Programas", 5, 1, [34], [31], [34]],
  [157, "Sistemas de Costos y Presupuestos", 5, 1, [], [23], []],
];

export const academicSnapshot = "11/11/2026";
export const academicStatuses = {
  approved: "Aprobada", regular: "Regularizada", ongoing: "En curso",
  option: "Optativa disponible",
};
export const courses = rows.map(([number, title, year, term, regular, approved, exam]) => ({
  id: String(number), code: `35-${String(number).padStart(2, "0")}`, title, year, term,
  regular: regular.map(String), approved: approved.map(String), exam: exam.map(String),
  elective: number >= 145,
  status: number === 42 ? "regular" : [43, 44].includes(number) ? "ongoing"
    : number >= 145 && ![148, 157].includes(number) ? "option" : "approved",
  note: number === 42 ? "Regularizada. Final pendiente."
    : number === 43 ? "La práctica laboral en Kaizen finalizó; la entrega académica final permanece pendiente. Para comenzar se exige el 80 % de las asignaturas aprobadas."
    : number === 44 ? "En curso. Tesis: Modelo Predictivo de Deserción Estudiantil. Para comenzar: 80 % de las asignaturas aprobadas. Para rendir: la totalidad de las asignaturas del plan aprobadas."
    : [148, 157].includes(number) ? "Optativa aprobada."
    : number >= 145 ? "Optativa disponible." : "",
  resolutionCode: number === 45 ? "35-60" : number >= 145 ? `35-${number - 100}` : `35-${String(number).padStart(2, "0")}`,
}));
