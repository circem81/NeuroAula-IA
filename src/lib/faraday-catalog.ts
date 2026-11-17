/**
 * Índice bibliográfico del monográfico Faraday 2026.
 * Fuente de los títulos y autores: https://gedh.rseq.org/numero-especial/
 * NO es un RAG ni incluye textos, imágenes o vídeos de los autores.
 * Los pilotos y errores conceptuales son propuestas originales de NeuroAula.
 */
export const faradayIndexUrl = "https://gedh.rseq.org/numero-especial/";
export const faradayPdfUrl =
  "https://gedh.rseq.org/wp-content/uploads/2026/11/Numero-especial-Faraday-completo.pdf";

// prettier-ignore
export const faradayContributions = [
  {
    "number": 1,
    "title": "De las experiencias de cátedra a la ciencia recreativa. El valor didáctico, histórico y divulgativo de las demostraciones experimentales para el profesorado de Física y Química",
    "authors": "Luis Moreno Martínez"
  },
  {
    "number": 2,
    "title": "En busca del foco de Van Eyck. Medir la curvatura de un famoso espejo convexo del siglo XV",
    "authors": "Sara M. Alonso Ruiz y Raúl Suárez García"
  },
  {
    "number": 3,
    "title": "¿Se conserva la cantidad de movimiento en los choques?",
    "authors": "Antonio Pérez Vicente y José González López de Guereñu"
  },
  {
    "number": 4,
    "title": "Thomas Seebeck y la termoelectricidad",
    "authors": "César Sancho Martín"
  },
  {
    "number": 5,
    "title": "Radiactividad: medida de dosis radiactivas y tipo de partículas",
    "authors": "Emilio González Galindo"
  },
  {
    "number": 6,
    "title": "La carrera del calor: ¿qué metal ganará?",
    "authors": "Carlos Alonso Arias, Agustín Ceba Herrero, Carme Literas Señan y Llucia Sancho de la Jordana Llabrés"
  },
  {
    "number": 7,
    "title": "Del invisible al visible",
    "authors": "Carlos Alonso Arias, Agustín Ceba Herrero, Carme Literas Señan y Llucia Sancho de la Jordana Llabrés"
  },
  {
    "number": 8,
    "title": "Estudio experimental del valor de la viscosidad dinámica de geles hidroalcohólicos con distinto porcentaje de aceite esencial de romero",
    "authors": "José Plaza Catalán"
  },
  {
    "number": 9,
    "title": "Inercia e impulso mecánico: ¡tiremos de la manta!",
    "authors": "Álvaro Rancaño Bambach"
  },
  {
    "number": 10,
    "title": "Física a lo bestia: inercia",
    "authors": "Álvaro Rancaño Bambach"
  },
  {
    "number": 11,
    "title": "Cuatro experiencias con la fuerza centrípeta",
    "authors": "Fernando Casadevante Paniagua, Carmen Martínez Herreros y Pablo Cassinello Espinosa"
  },
  {
    "number": 12,
    "title": "El fuego en la cocina",
    "authors": "Jesús Verdeja Galán"
  },
  {
    "number": 13,
    "title": "Los huevos de colón y tesla",
    "authors": "César Sancho Martín"
  },
  {
    "number": 14,
    "title": "La tetera caprichosa",
    "authors": "Guillermo Montero Dombriz"
  },
  {
    "number": 15,
    "title": "La luz: cuando la física se convierte en matemáticas",
    "authors": "Iván Nadal Latorre"
  },
  {
    "number": 16,
    "title": "Generación de corriente eléctrica con una dinamo: del laboratorio de Faraday al aula de Energías renovables",
    "authors": "Patricia Simal Campos"
  },
  {
    "number": 17,
    "title": "«¡Un video, galileo!» videos de física con orientación didáctica",
    "authors": "Germán Ros Magán e Íñigo Rodríguez Arteche"
  },
  {
    "number": 18,
    "title": "Equilibrio estático en palancas",
    "authors": "Almudena de la Fuente Fernández"
  },
  {
    "number": 19,
    "title": "Tres experimentos con productos caseros para el invierno",
    "authors": "Josep Corominas Viñas"
  },
  {
    "number": 20,
    "title": "El agua revela sus secretos",
    "authors": "Rafael Cabrera Moscoso"
  },
  {
    "number": 21,
    "title": "La jarra del arcoíris",
    "authors": "Guillermo Montero Dombriz"
  },
  {
    "number": 22,
    "title": "Experiencias didácticas con dióxido de carbono e hidrógeno",
    "authors": "Jesús Verdeja Galán"
  },
  {
    "number": 23,
    "title": "Fenolftaleína en condiciones extremas",
    "authors": "Carlos Moreno Borrallo"
  },
  {
    "number": 24,
    "title": "¿Podemos confiar en la etiqueta?",
    "authors": "José Juan Sirvent Carbonell"
  },
  {
    "number": 25,
    "title": "El cambio químico",
    "authors": "Ana María Carretero Calvo y Noemi Salardón Jiménez"
  },
  {
    "number": 26,
    "title": "Huellas escondidas",
    "authors": "David Moldes Plaza"
  },
  {
    "number": 27,
    "title": "La química detrás del espejo",
    "authors": "María Teresa García Segura"
  },
  {
    "number": 28,
    "title": "Una luz intensa para iniciar el aprendizaje de la química: la combustión del magnesio en distintos niveles de interpretación",
    "authors": "Gabriel Pinto Cañón"
  },
  {
    "number": 29,
    "title": "Simulación del test de alcoholemia con reacciones redox",
    "authors": "Jorge Alonso"
  },
  {
    "number": 30,
    "title": "Evaluación del potencial antimicrobiano de plantas medicinales frente a bacterias",
    "authors": "Martín Dos Santos, David Leal y Mario Díaz"
  },
  {
    "number": 31,
    "title": "Construcción de pilas con monedas",
    "authors": "José Antonio Martínez Pons"
  }
] as const;

export function faradayArea(number: number): "Introducción" | "Física" | "Química" {
  return number === 1 ? "Introducción" : number <= 19 ? "Física" : "Química";
}

/** Propuestas de exploración original, sin reproducir guiones publicados. */
// prettier-ignore
export const faradayPilots = [
  {
    number: 6,
    stage: "ESO · propuesta de adaptación",
    objective: "Relacionar observaciones experimentales con conductividad térmica.",
    commonError: "Confundir conductividad térmica con temperatura inicial.",
    scaffold: "Predecir, observar, comparar materiales y justificar una revisión de hipótesis.",
  },
  {
    number: 15,
    stage: "ESO/Bachillerato · propuesta de adaptación",
    objective: "Conectar fenómenos ópticos con relaciones y modelos matemáticos.",
    commonError: "Tomar una representación geométrica como explicación suficiente sin contrastar mediciones.",
    scaffold: "Ofrecer dibujo, tabla y representación gráfica; solicitar evidencia de cada paso.",
  },
  {
    number: 2,
    stage: "Bachillerato · propuesta de adaptación",
    objective: "Estimar propiedades de un espejo y discutir incertidumbre de medida.",
    commonError: "Suponer que toda medida produce un resultado exacto.",
    scaffold: "Comparar estimaciones, unidades y fuentes de incertidumbre.",
  },
  {
    number: 20,
    stage: "Bachillerato · propuesta de adaptación",
    objective: "Relacionar electrólisis, cambios químicos y conservación de la materia.",
    commonError: "Confundir corriente eléctrica con el reactivo que se transforma.",
    scaffold: "Distinguir observación, modelos de partículas y explicación macroscópica.",
  },
  {
    number: 24,
    stage: "Bachillerato · propuesta de adaptación",
    objective: "Interpretar una comprobación experimental frente a un dato de una etiqueta.",
    commonError: "Concluir que una coincidencia aproximada prueba exactitud absoluta.",
    scaffold: "Diferenciar dato, cálculo, tolerancia e incertidumbre.",
  },
  {
    number: 31,
    stage: "ESO · propuesta de adaptación",
    objective: "Explicar cómo una pila transforma energía química en eléctrica.",
    commonError: "Pensar que las monedas generan energía sin reacción química.",
    scaffold: "Identificar materiales, diseñar controles y explicar el papel del electrolito.",
  },
] as const;
