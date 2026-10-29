/**
 * Mapa bibliográfico del índice público de pepvidalg.
 * Los nombres se catalogan a partir del índice y NO implican
 * que los ejercicios de terceros estén importados o autorizados.
 * "prototipo" solo cuando hay ejercicios originales de NeuroAula.
 */
export type EstadoCatalogo = "prototipo" | "pendiente";
export const fasesNewton = ["comprender", "pensar", "ejecutar", "responder"] as const;
export type FaseNewton = (typeof fasesNewton)[number];

export type BloqueCatalogo = {
  id: string;
  titulo: string;
  tipo: "contenido" | "recurso";
  estado: EstadoCatalogo;
  prerrequisitos: string[];
  descripcion: string;
};

export const catalogoNewton: BloqueCatalogo[] = [
  { id:"numeros", titulo:"Números", tipo:"contenido", estado:"pendiente", prerrequisitos:[], descripcion:"Sentido numérico y representación" },
  { id:"calculo", titulo:"Cálculo", tipo:"contenido", estado:"pendiente", prerrequisitos:["numeros"], descripcion:"Estrategias de cálculo y operaciones" },
  { id:"fracciones", titulo:"Fracciones y Porcentajes", tipo:"contenido", estado:"pendiente", prerrequisitos:["numeros"], descripcion:"Relaciones entre partes, totales y porcentajes" },
  { id:"aditiva", titulo:"Estructura Aditiva", tipo:"contenido", estado:"pendiente", prerrequisitos:["calculo"], descripcion:"Problemas de suma, resta, cambio y comparación" },
  { id:"comparar", titulo:"Compara Aumenta Reduce", tipo:"contenido", estado:"pendiente", prerrequisitos:["aditiva"], descripcion:"Comparación, aumento y reducción de cantidades" },
  { id:"multiplicativa", titulo:"Estructura Multiplicativa", tipo:"contenido", estado:"pendiente", prerrequisitos:["calculo"], descripcion:"Relaciones multiplicativas" },
  { id:"compras", titulo:"Compras", tipo:"contenido", estado:"pendiente", prerrequisitos:["calculo"], descripcion:"Problemas matemáticos en compras" },
  { id:"proporcionalidad", titulo:"Proporcionalidad", tipo:"contenido", estado:"prototipo", prerrequisitos:["multiplicativa"], descripcion:"Problemas guiados de relaciones directa e inversa" },
  { id:"funciones", titulo:"Funciones", tipo:"contenido", estado:"pendiente", prerrequisitos:["proporcionalidad"], descripcion:"Dependencia y representación de relaciones" },
  { id:"probabilidad", titulo:"Probabilidad", tipo:"contenido", estado:"pendiente", prerrequisitos:["fracciones"], descripcion:"Experimentación y estimación de probabilidades" },
  { id:"geometria", titulo:"Geometría", tipo:"contenido", estado:"pendiente", prerrequisitos:["numeros"], descripcion:"Formas, medidas y relaciones espaciales" },
  { id:"estrategia-mi", titulo:"Problemas de Estrategia MI", tipo:"contenido", estado:"pendiente", prerrequisitos:["aditiva"], descripcion:"Estrategias iniciales de resolución" },
  { id:"estrategia-mii", titulo:"Problemas de Estrategia MII", tipo:"contenido", estado:"pendiente", prerrequisitos:["estrategia-mi"], descripcion:"Estrategias de resolución más complejas" },
  { id:"algebra", titulo:"Álgebra", tipo:"contenido", estado:"pendiente", prerrequisitos:["multiplicativa"], descripcion:"Expresiones, incógnitas y generalización" },
  { id:"pensamiento", titulo:"Pensamiento Computacional", tipo:"contenido", estado:"pendiente", prerrequisitos:["estrategia-mi"], descripcion:"Patrones, lógica y secuencias" },
  { id:"manipuladores", titulo:"Manipuladores", tipo:"recurso", estado:"pendiente", prerrequisitos:[], descripcion:"Representaciones y materiales manipulativos" },
  { id:"retos-imagenes", titulo:"Retos Imagenes", tipo:"recurso", estado:"pendiente", prerrequisitos:[], descripcion:"Retos de razonamiento visual" },
  { id:"pattern-blocks", titulo:"Pattern Blocks", tipo:"recurso", estado:"pendiente", prerrequisitos:[], descripcion:"Construcciones con bloques geométricos" },
  { id:"plantillas", titulo:"Plantillas", tipo:"recurso", estado:"pendiente", prerrequisitos:[], descripcion:"Plantillas y propuestas originales por desarrollar" },
  { id:"cursos", titulo:"Cursos (Infantil, Primaria y Secundaria)", tipo:"recurso", estado:"pendiente", prerrequisitos:[], descripcion:"Metadatos de nivel y curso para la asignación pedagógica" },
  { id:"calculadora", titulo:"Calculadora", tipo:"recurso", estado:"pendiente", prerrequisitos:[], descripcion:"Instrumento de cálculo" },
];
export const METADATA_ORIGEN_GENIALLY = {
  autor: "pepvidalg",
  url: "https://view.genially.com/5f7e09dd1b2b330d2efa2489",
  licenciaReproduccion: "no_verificada",
} as const;
