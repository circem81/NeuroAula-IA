/**
 * Contenidos originales y ficticios para una demostración bilingüe español–árabe.
 * No contienen datos personales y no requieren peticiones a servicios externos.
 * Traducciones de referencia: revisar con profesorado competente antes de un piloto.
 */
export type NivelLibro = "A1" | "A2" | "B1";

export type PreguntaLibro = {
  id: string;
  categoria: "Comprensión" | "Vocabulario" | "Completa la frase";
  enunciado: string;
  opciones: [string, string, string];
  correcta: number;
  pista: string;
  explicacion: string;
};

export type PaginaLibro = {
  id: string;
  icono: string;
  titulo: string;
  textoEspanol: string;
  textoArabe: string;
  vocabulario: { es: string; ar: string }[];
  preguntas: PreguntaLibro[];
};

export const librosBilingues: Record<NivelLibro, PaginaLibro[]> = {
  A1: [
    {
      id: "a1-saludos",
      icono: "👋",
      titulo: "Hola, soy Nadia",
      textoEspanol: "Hola. Me llamo Nadia. Tengo quince años. Vivo cerca del colegio.",
      textoArabe: "مرحبًا. اسمي نادية. عمري خمس عشرة سنة. أسكن بالقرب من المدرسة.",
      vocabulario: [{ es: "Hola", ar: "مرحبًا" }, { es: "Me llamo", ar: "اسمي" }, { es: "Colegio", ar: "مدرسة" }],
      preguntas: [
        { id: "a1-1a", categoria: "Comprensión", enunciado: "¿Cómo se llama la chica?", opciones: ["Nadia", "Lina", "Salma"], correcta: 0, pista: "Busca las palabras «Me llamo».", explicacion: "Dice «Me llamo Nadia»." },
        { id: "a1-1b", categoria: "Vocabulario", enunciado: "¿Qué significa «مرحبًا» en español?", opciones: ["Adiós", "Hola", "Gracias"], correcta: 1, pista: "Se utiliza al saludar a alguien.", explicacion: "«مرحبًا» significa «Hola»." }
      ],
    },
    {
      id: "a1-mochila",
      icono: "🎒",
      titulo: "Mi mochila",
      textoEspanol: "Tengo un libro azul, un lápiz rojo y dos cuadernos en mi mochila.",
      textoArabe: "لديّ كتاب أزرق وقلم رصاص أحمر ودفتران في حقيبتي.",
      vocabulario: [{ es: "Libro", ar: "كتاب" }, { es: "Lápiz", ar: "قلم رصاص" }, { es: "Mochila", ar: "حقيبة" }],
      preguntas: [
        { id: "a1-2a", categoria: "Comprensión", enunciado: "¿De qué color es el libro?", opciones: ["Rojo", "Azul", "Negro"], correcta: 1, pista: "El color está justo después de «libro».", explicacion: "El libro es azul." },
        { id: "a1-2b", categoria: "Completa la frase", enunciado: "Tengo dos _____ en mi mochila.", opciones: ["lápices", "colegios", "cuadernos"], correcta: 2, pista: "Busca el objeto del que hay dos.", explicacion: "En la mochila hay dos cuadernos." }
      ],
    },
    {
      id: "a1-rutina",
      icono: "☀️",
      titulo: "Por la mañana",
      textoEspanol: "Por la mañana me levanto, desayuno pan y fruta y después voy a clase.",
      textoArabe: "في الصباح أستيقظ، وأتناول الخبز والفاكهة في الفطور، ثم أذهب إلى الصف.",
      vocabulario: [{ es: "Mañana", ar: "صباح" }, { es: "Fruta", ar: "فاكهة" }, { es: "Clase", ar: "صف" }],
      preguntas: [
        { id: "a1-3a", categoria: "Comprensión", enunciado: "¿Qué hace antes de ir a clase?", opciones: ["Desayuna", "Cena", "Duerme"], correcta: 0, pista: "«Después» señala lo que hace al final.", explicacion: "Desayuna antes de ir a clase." },
        { id: "a1-3b", categoria: "Vocabulario", enunciado: "¿Qué significa «فاكهة»?", opciones: ["Agua", "Fruta", "Pan"], correcta: 1, pista: "Es un alimento que aparece en el desayuno.", explicacion: "«فاكهة» significa «fruta»." }
      ],
    },
  ],
  A2: [
    {
      id: "a2-autobus",
      icono: "🚌",
      titulo: "Un pequeño retraso",
      textoEspanol: "Ayer perdí el autobús porque salí tarde de casa. Caminé hasta el instituto y llegué diez minutos tarde.",
      textoArabe: "أمس فاتتني الحافلة لأنني خرجت متأخرًا من المنزل. مشيت إلى المدرسة ووصلت متأخرًا عشر دقائق.",
      vocabulario: [{ es: "Ayer", ar: "أمس" }, { es: "Autobús", ar: "حافلة" }, { es: "Tarde", ar: "متأخرًا" }],
      preguntas: [
        { id: "a2-1a", categoria: "Comprensión", enunciado: "¿Por qué perdió el autobús?", opciones: ["Salió tarde de casa", "Olvidó la mochila", "Se equivocó de calle"], correcta: 0, pista: "La causa aparece después de «porque».", explicacion: "Salió tarde de casa." },
        { id: "a2-1b", categoria: "Vocabulario", enunciado: "¿Qué significa «أمس»?", opciones: ["Mañana", "Hoy", "Ayer"], correcta: 2, pista: "Se refiere a un día pasado.", explicacion: "«أمس» significa «ayer»." }
      ],
    },
    {
      id: "a2-deberes",
      icono: "⚽",
      titulo: "Después de estudiar",
      textoEspanol: "Si termino los deberes antes de las seis, podré jugar al fútbol con mis amigos. Primero estudiaré ciencias.",
      textoArabe: "إذا أنهيت واجباتي قبل الساعة السادسة، فسأتمكن من لعب كرة القدم مع أصدقائي. سأدرس العلوم أولًا.",
      vocabulario: [{ es: "Deberes", ar: "واجبات" }, { es: "Amigos", ar: "أصدقاء" }, { es: "Ciencias", ar: "علوم" }],
      preguntas: [
        { id: "a2-2a", categoria: "Comprensión", enunciado: "¿Qué necesita hacer para jugar al fútbol?", opciones: ["Comprar un balón", "Terminar los deberes", "Ir al supermercado"], correcta: 1, pista: "Busca la condición que empieza con «Si».", explicacion: "Primero tiene que terminar los deberes." },
        { id: "a2-2b", categoria: "Completa la frase", enunciado: "Primero estudiaré _____.", opciones: ["historia", "música", "ciencias"], correcta: 2, pista: "Es una materia escolar.", explicacion: "La frase termina en «ciencias»." }
      ],
    },
    {
      id: "a2-paseo",
      icono: "🌳",
      titulo: "Salir a caminar",
      textoEspanol: "Aunque hacía frío, Sara salió a caminar por el parque. Se encontró con una amiga y hablaron durante media hora.",
      textoArabe: "رغم أن الجو كان باردًا، خرجت سارة للمشي في الحديقة. التقت بصديقة وتحدثتا لمدة نصف ساعة.",
      vocabulario: [{ es: "Aunque", ar: "رغم أن" }, { es: "Parque", ar: "حديقة" }, { es: "Media hora", ar: "نصف ساعة" }],
      preguntas: [
        { id: "a2-3a", categoria: "Comprensión", enunciado: "¿Cuánto tiempo hablaron?", opciones: ["Media hora", "Una hora", "Diez minutos"], correcta: 0, pista: "Mira la última parte de la lectura.", explicacion: "Hablaron durante media hora." },
        { id: "a2-3b", categoria: "Vocabulario", enunciado: "¿Qué significa «حديقة»?", opciones: ["Parque", "Cocina", "Estación"], correcta: 0, pista: "Es un lugar al aire libre.", explicacion: "«حديقة» significa «parque»." }
      ],
    },
  ],
  B1: [
    {
      id: "b1-samir",
      icono: "🧠",
      titulo: "Una forma de aprender",
      textoEspanol: "Al principio, Samir no entendía algunas explicaciones de clase. Empezó a escribir las palabras desconocidas, pedir ejemplos al docente y practicar cada tarde. Con el tiempo, ganó confianza.",
      textoArabe: "في البداية، لم يكن سمير يفهم بعض الشروحات في الصف. بدأ يكتب الكلمات التي لا يعرفها، ويطلب أمثلة من المعلم، ويتدرب كل مساء. ومع مرور الوقت، ازدادت ثقته بنفسه.",
      vocabulario: [{ es: "Al principio", ar: "في البداية" }, { es: "Confianza", ar: "ثقة" }, { es: "Practicar", ar: "يتدرب" }],
      preguntas: [
        { id: "b1-1a", categoria: "Comprensión", enunciado: "¿Qué conjunto de estrategias ayudó a Samir?", opciones: ["Evitar preguntas y esperar", "Anotar dudas, pedir ejemplos y practicar", "Estudiar solo la noche anterior"], correcta: 1, pista: "Identifica las tres acciones que realizó.", explicacion: "Anotar vocabulario, pedir ejemplos y practicar le ayudó a progresar." },
        { id: "b1-1b", categoria: "Vocabulario", enunciado: "En este texto, «ganó confianza» significa que…", opciones: ["Empezó a sentirse más seguro", "Ganó un premio", "Aprendió a correr"], correcta: 0, pista: "Piensa en cómo cambió su actitud en clase.", explicacion: "Se sintió más seguro a la hora de aprender y participar." }
      ],
    },
    {
      id: "b1-equipo",
      icono: "🤝",
      titulo: "Un proyecto en equipo",
      textoEspanol: "El grupo debía preparar una exposición sobre el agua. Aunque tenían propuestas diferentes, acordaron repartir las tareas y revisar los resultados entre todos antes de presentarlos.",
      textoArabe: "كان على المجموعة إعداد عرض عن الماء. ورغم أن لديهم مقترحات مختلفة، اتفقوا على تقسيم المهام ومراجعة النتائج معًا قبل تقديمها.",
      vocabulario: [{ es: "Exposición", ar: "عرض" }, { es: "Repartir tareas", ar: "تقسيم المهام" }, { es: "Resultados", ar: "نتائج" }],
      preguntas: [
        { id: "b1-2a", categoria: "Comprensión", enunciado: "¿Cómo resolvieron sus diferencias?", opciones: ["Cancelaron el proyecto", "Trabajaron sin hablar", "Repartieron tareas y revisaron juntos"], correcta: 2, pista: "Busca la decisión que tomaron en común.", explicacion: "Acordaron organizarse y revisar juntos la exposición." },
        { id: "b1-2b", categoria: "Vocabulario", enunciado: "¿Qué expresa «aunque» en la lectura?", opciones: ["Una oposición que no impide actuar", "Una consecuencia inevitable", "Un orden cronológico"], correcta: 0, pista: "Compara tener ideas distintas con alcanzar un acuerdo.", explicacion: "«Aunque» introduce una dificultad o contraste." }
      ],
    },
    {
      id: "b1-error",
      icono: "💡",
      titulo: "El valor de equivocarse",
      textoEspanol: "Lina había estudiado mucho, pero se equivocó en la primera actividad. Analizó la explicación, cambió su procedimiento y resolvió un problema nuevo sin ayuda. El error le permitió aprender.",
      textoArabe: "درست لينا كثيرًا، لكنها أخطأت في النشاط الأول. حللت الشرح، وغيّرت طريقتها، ثم حلّت مسألة جديدة دون مساعدة. ساعدها الخطأ على التعلم.",
      vocabulario: [{ es: "Equivocarse", ar: "يخطئ" }, { es: "Procedimiento", ar: "طريقة" }, { es: "Sin ayuda", ar: "دون مساعدة" }],
      preguntas: [
        { id: "b1-3a", categoria: "Comprensión", enunciado: "¿Qué demuestra que Lina ha aprendido?", opciones: ["Que nunca volvió a leer", "Que solucionó un problema nuevo sin ayuda", "Que repitió la misma respuesta"], correcta: 1, pista: "Busca una acción que prueba comprensión autónoma.", explicacion: "Pudo transferir lo aprendido a un problema nuevo." },
        { id: "b1-3b", categoria: "Completa la frase", enunciado: "El error le permitió _____.", opciones: ["aprender", "olvidar", "descansar"], correcta: 0, pista: "La última oración resume la idea del texto.", explicacion: "La frase concluye: «El error le permitió aprender»." }
      ],
    },
  ],
};

export const nivelesLibros: NivelLibro[] = ["A1", "A2", "B1"];

export function resumenLibro(
  nivel: NivelLibro,
  respuestas: Record<string, number>,
) {
  const preguntas = librosBilingues[nivel].flatMap((pagina) => pagina.preguntas);
  return {
    total: preguntas.length,
    correctas: preguntas.filter((pregunta) => respuestas[pregunta.id] === pregunta.correcta).length,
  };
}
