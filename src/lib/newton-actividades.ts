/**
 * Actividades originales de proporcionalidad, inspiradas en el enfoque manipulativo.
 * No reproducen ni descargan contenidos de Genially. No requieren IA ni servidor.
 */
export type PasoMatematicas = {
  objetivo: string;
  pregunta: string;
  opciones: [string, string, string];
  correcta: number;
  pista: string;
  explicacion: string;
};
export type RetoMatematicas = {
  id: string;
  titulo: string;
  tipo: "directa" | "inversa";
  situacion: string;
  apoyoArabe: string;
  pasos: [PasoMatematicas, PasoMatematicas, PasoMatematicas];
};
export const retosNewton: RetoMatematicas[] = [
  {
    id: "cuadernos",
    titulo: "Los cuadernos",
    tipo: "directa",
    situacion: "Tres cuadernos cuestan 6 €. ¿Cuánto cuestan cinco cuadernos iguales?",
    apoyoArabe: "ثمن ثلاثة دفاتر هو 6 يورو. كم ثمن خمسة دفاتر متماثلة؟",
    pasos: [
      { objetivo: "Entender el problema", pregunta: "¿Qué queremos averiguar?", opciones: ["Cuánto cuestan cinco cuadernos", "Cuántas páginas hay", "Cuánto cuesta una mochila"], correcta: 0, pista: "Lee la pregunta final.", explicacion: "La incógnita es el precio de cinco cuadernos." },
      { objetivo: "Pensar con una unidad", pregunta: "Si 3 cuadernos cuestan 6 €, ¿cuánto cuesta 1?", opciones: ["3 €", "2 €", "6 €"], correcta: 1, pista: "Reparte seis euros en tres partes iguales.", explicacion: "Cada cuaderno cuesta 6 ÷ 3 = 2 €." },
      { objetivo: "Resolver y comprobar", pregunta: "¿Cuánto cuestan cinco cuadernos?", opciones: ["8 €", "10 €", "12 €"], correcta: 1, pista: "Cinco cuadernos de 2 € cada uno.", explicacion: "5 × 2 € = 10 €. Más cuadernos cuestan más si el precio unitario es el mismo." },
    ],
  },
  {
    id: "trabajo",
    titulo: "Organizar las cajas",
    tipo: "inversa",
    situacion: "Cuatro personas tardan 6 horas en preparar las cajas. Si ocho personas trabajan al mismo ritmo, ¿cuánto tardan en realizar el mismo trabajo?",
    apoyoArabe: "يستغرق أربعة أشخاص 6 ساعات لتجهيز الصناديق. إذا عمل ثمانية أشخاص بالمعدل نفسه، فكم ساعة يحتاجون لإنجاز العمل نفسه؟",
    pasos: [
      { objetivo: "Entender el problema", pregunta: "¿Qué queremos conocer?", opciones: ["El número de cajas", "El tiempo con ocho personas", "La edad de las personas"], correcta: 1, pista: "La pregunta pide una duración.", explicacion: "Buscamos el tiempo que tardan ocho personas." },
      { objetivo: "Ver la relación", pregunta: "Si trabajan el doble de personas, ¿qué ocurre con el tiempo necesario?", opciones: ["También se duplica", "Se mantiene igual", "Se reduce a la mitad"], correcta: 2, pista: "Más personas pueden terminar antes el mismo trabajo, si trabajan igual.", explicacion: "La relación es inversa: el doble de personas necesita la mitad del tiempo." },
      { objetivo: "Resolver y comprobar", pregunta: "¿Cuántas horas tardarán ocho personas?", opciones: ["3 horas", "12 horas", "6 horas"], correcta: 0, pista: "Calcula la mitad de 6 horas.", explicacion: "6 ÷ 2 = 3 horas. 4 × 6 y 8 × 3 son ambos 24 persona-horas." },
    ],
  },
  {
    id: "agua",
    titulo: "Botellas de agua",
    tipo: "directa",
    situacion: "Dos botellas contienen 3 litros en total. ¿Cuántos litros contienen seis botellas iguales?",
    apoyoArabe: "تحتوي زجاجتان على 3 لترات بالمجموع. كم لترًا تحتوي ست زجاجات مماثلة؟",
    pasos: [
      { objetivo: "Entender el problema", pregunta: "¿Qué es constante?", opciones: ["La cantidad de botellas", "El volumen de cada botella", "El número de estudiantes"], correcta: 1, pista: "Las botellas son iguales.", explicacion: "Cada botella tiene el mismo volumen." },
      { objetivo: "Ver la relación", pregunta: "Se pasa de 2 a 6 botellas. ¿Por cuánto se multiplica?", opciones: ["Por 3", "Por 2", "Por 6"], correcta: 0, pista: "Piensa cuántos grupos de dos hay en seis.", explicacion: "6 ÷ 2 = 3, por lo tanto multiplicamos por tres." },
      { objetivo: "Resolver y comprobar", pregunta: "¿Cuántos litros hay en seis botellas?", opciones: ["6 litros", "12 litros", "9 litros"], correcta: 2, pista: "Multiplica los 3 litros de las dos botellas por tres.", explicacion: "3 × 3 = 9 litros." },
    ],
  },
];
export const NEWTON_GENIALLY_INDEX_URL = "https://view.genially.com/5f7e09dd1b2b330d2efa2489";
