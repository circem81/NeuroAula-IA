---
name: libro-interactivo
description: Cómo está construido el libro interactivo de NeuroAULA y cómo ampliarlo sin romper la evaluación, las pistas ni el Learning Twin. Úsalo antes de leer o cambiar archivos del libro.
---

# Libro interactivo de NeuroAULA

## Piezas y recorrido

Respuesta del alumno ficticio → evaluación por reglas → evidencia → Learning Twin → revisión docente.

| Archivo | Papel |
| --- | --- |
| `src/lib/interactive-book.ts` | Contenido del libro (páginas como datos) y reglas de lectura |
| `src/lib/book-context.ts` | Procedencia que acompaña a cada intento: libro, versión, página |
| `src/lib/mvp-learning-cycle.ts` | Actividad, intentos, pistas, evaluación, evidencias y revisión |
| `src/lib/learning-twin.ts` | Motor determinista. No se modifica desde tareas del libro |
| `src/components/interactive-learning-book.tsx` | Lectura HTML accesible y vista 3D opcional |
| `src/components/mvp-learning-cycle.tsx` | Vista del alumno y del profesor |
| `src/lib/interactive-book/` | Motor 3D adaptado (MIT). No se modifica |

## Reglas que hay que conservar

- Leer o pasar páginas nunca crea evidencia. Solo una respuesta enviada.
- Abrir una página de ayuda sube el nivel de ayuda y no lo baja. La ayuda se congela al responder.
- Escala de ayuda del Twin: 0 sin ayuda, 1 reformulación, 2 pista conceptual, 3 ejemplo análogo,
  4 procedimiento guiado, 5 solución dirigida. Las pistas del libro usan 1, 2 y 4; nunca 5.
- Una opción elegida solo acredita acierto o error: `reasoningQuality`, `errorType` y `strategies`
  se quedan vacíos.
- Toda evaluación nace con revisión humana pendiente. La corrección docente añade una evidencia
  nueva y conserva la original.
- Lo guardado en el navegador con el formato anterior debe seguir siendo válido al restaurarse.
- El contenido es texto plano y datos propios. Nada de `innerHTML` ni HTML generado.
- La lectura HTML funciona sin WebGL. La vista 3D es un complemento que puede fallar sin
  impedir la actividad.
- El contenido está en español y se etiqueta como sintético y no validado como currículo oficial.

## Limitación conocida

`mvp-learning-cycle.ts` está construido para una sola actividad (`mvpActivity`). Añadir más
ejercicios exige generalizar su estado. Es el cambio más delicado: hazlo en una tarea propia, con
pruebas de restauración del formato anterior, antes de añadir contenido que dependa de él.
