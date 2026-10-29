import { retosNewton } from "./newton-actividades.ts";
import { fasesNewton, type FaseNewton } from "./newton-catalogo.ts";

type PreguntaTutor = {
  id: string;
  fase: FaseNewton;
  etapa: string;
  pregunta: string;
  opciones: [string, string, string];
  correcta: number;
  pista: string;
  explicacion: string;
};

const verificaciones: PreguntaTutor[] = [
  {
    id:"verificar-cuadernos",fase:"responder",etapa:"Comprobar y comunicar",
    pregunta:"¿Cuál es la comprobación adecuada del precio de 5 cuadernos?",
    opciones:["5 × 2 = 10 €","5 + 2 = 10 €","5 × 6 = 10 €"],correcta:0,
    pista:"Usa el precio de una unidad para verificar el total.",
    explicacion:"5 cuadernos × 2 € por cuaderno = 10 €. La respuesta incluye unidades.",
  },
  {
    id:"verificar-trabajo",fase:"responder",etapa:"Comprobar y comunicar",
    pregunta:"¿Cómo comprobamos que 8 personas tardan 3 horas si trabajan igual?",
    opciones:["8 + 3 = 24","8 × 3 = 4 × 6","8 ÷ 3 = 4 + 6"],correcta:1,
    pista:"Piensa en las persona-horas: personas multiplicadas por horas.",
    explicacion:"El trabajo es el mismo: 8 × 3 = 4 × 6 = 24 persona-horas.",
  },
  {
    id:"verificar-botellas",fase:"responder",etapa:"Comprobar y comunicar",
    pregunta:"¿Por qué 9 litros es coherente para 6 botellas?",
    opciones:["Hay menos botellas y menos agua","Cada botella contiene 9 litros","El número de botellas se triplica y los litros también"],correcta:2,
    pista:"Compara 2 botellas con 6 botellas iguales.",
    explicacion:"Como se triplican las botellas (de 2 a 6), también se triplica el volumen (de 3 a 9 litros).",
  },
];

const puentes: PreguntaTutor[] = [
  {
    id:"puente-cuadernos",fase:"pensar",etapa:"Ejemplo más sencillo",
    pregunta:"Dos cuadernos iguales cuestan 4 €. ¿Cuánto cuesta uno?",
    opciones:["4 €","2 €","8 €"],correcta:1,
    pista:"Reparte los cuatro euros entre dos cuadernos.",
    explicacion:"Un cuaderno cuesta 4 ÷ 2 = 2 €. Ahora volvemos al problema anterior.",
  },
  {
    id:"puente-trabajo",fase:"pensar",etapa:"Ejemplo más sencillo",
    pregunta:"Dos personas terminan un trabajo en 8 horas. Si trabajan igual y son cuatro, ¿cuánto tardan?",
    opciones:["16 horas","8 horas","4 horas"],correcta:2,
    pista:"El doble de personas hace el mismo trabajo en la mitad del tiempo.",
    explicacion:"Cuatro personas necesitan 4 horas: 2 × 8 = 4 × 4.",
  },
  {
    id:"puente-botellas",fase:"pensar",etapa:"Ejemplo más sencillo",
    pregunta:"Dos botellas iguales contienen 4 litros. ¿Cuántos litros hay en cuatro botellas?",
    opciones:["8 litros","4 litros","2 litros"],correcta:0,
    pista:"El número de botellas se duplica.",
    explicacion:"Al duplicar las botellas de 2 a 4, duplicamos el contenido de 4 a 8 litros.",
  },
];

export type RegistroTutor = {
  retoId: string;
  fase: FaseNewton;
  tipo: "principal" | "refuerzo";
  acierto: boolean;
  conApoyo: boolean;
};

export type EstadoTutor = {
  retoIndex: number;
  faseIndex: number;
  tipo: "principal" | "refuerzo";
  erroresConsecutivos: number;
  pistasUtilizadas: number;
  bloqueoRevision: boolean;
  terminado: boolean;
  historial: RegistroTutor[];
};

export type RespuestaTutor = {
  estado: EstadoTutor;
  correcta: boolean;
  mensaje: string;
  decision: "avanzar" | "pista" | "refuerzo" | "reintentar" | "revision-docente" | "completado";
};

export function crearEstadoTutor(): EstadoTutor {
  return {
    retoIndex:0,faseIndex:0,tipo:"principal",erroresConsecutivos:0,
    pistasUtilizadas:0,bloqueoRevision:false,terminado:false,historial:[],
  };
}

export function obtenerPreguntaTutor(estado: EstadoTutor): PreguntaTutor | null {
  if(estado.terminado)return null;
  if(estado.tipo==="refuerzo")return puentes[estado.retoIndex];
  const reto=retosNewton[estado.retoIndex];
  if(estado.faseIndex===3)return verificaciones[estado.retoIndex];
  const paso=reto.pasos[estado.faseIndex];
  return {
    id:reto.id+"-"+estado.faseIndex,
    fase:fasesNewton[estado.faseIndex],
    etapa:paso.objetivo,
    pregunta:paso.pregunta,
    opciones:paso.opciones,
    correcta:paso.correcta,
    pista:paso.pista,
    explicacion:paso.explicacion,
  };
}

export function solicitarPistaTutor(estado: EstadoTutor): EstadoTutor {
  if (estado.terminado || estado.bloqueoRevision) return estado;
  return { ...estado, pistasUtilizadas:estado.pistasUtilizadas+1 };
}

export function responderTutor(estado: EstadoTutor, seleccion: number): RespuestaTutor {
  const pregunta=obtenerPreguntaTutor(estado);
  if(!pregunta || estado.bloqueoRevision || !Number.isInteger(seleccion) || seleccion<0 || seleccion>=pregunta.opciones.length){
    return {estado,correcta:false,mensaje:"No hay una respuesta válida disponible.",decision:"revision-docente"};
  }
  const correcta=seleccion===pregunta.correcta;
  const historial: RegistroTutor[]=[...estado.historial,{
    retoId:retosNewton[estado.retoIndex].id,fase:pregunta.fase,
    tipo:estado.tipo,acierto:correcta,
    conApoyo:estado.pistasUtilizadas>0 || estado.tipo==="refuerzo",
  }];
  if(!correcta){
    const errores=estado.erroresConsecutivos+1;
    if(errores>=2 && estado.tipo==="principal"){
      return {
        estado:{...estado,tipo:"refuerzo",erroresConsecutivos:0,pistasUtilizadas:0,historial},
        correcta:false,
        mensaje:"Probemos un problema más sencillo y luego volveremos al anterior.",
        decision:"refuerzo",
      };
    }
    if(errores>=2 && estado.tipo==="refuerzo"){
      return {
        estado:{...estado,erroresConsecutivos:errores,bloqueoRevision:true,historial},
        correcta:false,mensaje:"Este paso necesita apoyo del docente. No es un suspenso.",
        decision:"revision-docente",
      };
    }
    return {
      estado:{...estado,erroresConsecutivos:errores,historial},
      correcta:false,
      mensaje:"Vamos a probar otra vez. Puedes consultar una pista.",
      decision:"pista",
    };
  }
  if(estado.tipo==="refuerzo"){
    return {
      estado:{...estado,tipo:"principal",erroresConsecutivos:0,pistasUtilizadas:0,historial},
      correcta:true,
      mensaje:pregunta.explicacion+" Retomamos el problema original.",
      decision:"reintentar",
    };
  }
  let retoIndex=estado.retoIndex, faseIndex=estado.faseIndex+1, terminado=false;
  if(faseIndex===4){
    faseIndex=0;
    retoIndex++;
    if(retoIndex===retosNewton.length){
      terminado=true;
      retoIndex=retosNewton.length-1;
      faseIndex=3;
    }
  }
  return {
    estado:{...estado,retoIndex,faseIndex,terminado,
      erroresConsecutivos:0,pistasUtilizadas:0,historial},
    correcta:true,
    mensaje:pregunta.explicacion,
    decision:terminado?"completado":"avanzar",
  };
}

export function estadisticasTutor(estado: EstadoTutor) {
  return {
    intentos:estado.historial.length,
    aciertos:estado.historial.filter((x)=>x.acierto).length,
    refuerzos:estado.historial.filter((x)=>x.tipo==="refuerzo").length,
    fasesRevisadas:estado.historial.filter((x)=>x.tipo==="principal" && x.acierto).length,
  };
}
