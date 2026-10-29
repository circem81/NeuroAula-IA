# Libros interactivos español–árabe (prototipo)

## Qué se ha incorporado

- Página pública de ejemplo `/libros`, accesible sin cuenta y enlazada desde `/demo/actividades`.
- Tres niveles pedagógicos aproximados: A1, A2 y B1, con tres lecturas ficticias por nivel.
- Texto original en español y apoyo en árabe con `lang="ar"` y escritura `dir="rtl"`.
- Glosario de vocabulario en cada página, preguntas de comprensión y vocabulario.
- Corrección determinista inmediata, pistas, navegación y selección de nivel.
- Vista docente con resumen de respuestas correctas **solo en la memoria de la página**.
- Sin llamadas a IA, bases de datos, analíticas o envío de respuestas.

## Límites y cuidado con los menores

La página se ha creado como **prototipo**, no como producto listo para utilizar con datos reales de alumnos. No se crea ninguna ficha de estudiante, no se persisten respuestas y no hay evaluación automatizada por modelos de IA.

El contenido en árabe es una traducción preliminar en árabe estándar: antes del uso educativo, una persona cualificada debe revisar adecuación lingüística, edad, vocabulario y variantes dialectales del alumnado. Los niveles son orientativos y no acreditan una evaluación formal del MCER.

La página **no es todavía una PWA offline**. Aunque las preguntas se resuelven en el navegador sin peticiones a IA, la carga de la web alojada requiere internet. En GINSO u otros entornos sin conectividad, debe estudiarse una distribución local autorizada (paquete estático o servidor intranet), el funcionamiento sin CDN, medidas de seguridad, accesibilidad, protección de datos y controles de administración.

## Próximas etapas

1. Revisar las traducciones y el diseño con profesorado y alumnado sin recoger datos personales.
2. Incorporar distintos formatos: emparejar palabras, ordenar frases, completar textos, lectura graduada, audio pregrabado revisado.
3. Diseñar una biblioteca de libros y editor de contenidos con validación docente.
4. Implementar distribución offline con comprobaciones de funcionamiento sin red.
5. Definir eventos de progreso, esquema de evidencias, permisos/RLS y puntos de aprobación docente antes de trabajar con datos reales.
6. Solo después, estudiar sugerencias adaptativas con agentes IA, trazabilidad y guardrails.

## Comprobación

El conjunto de pruebas `src/lib/libros-bilingues.test.ts` verifica la integridad de los contenidos y los cálculos básicos. Se ejecuta con `bun run test`.

## Apoyos individuales disponibles en la demo

Se ofrecen opciones por preferencias observadas y contexto, nunca como diagnóstico:
- **Una pregunta cada vez:** reduce la carga simultánea y permite concentrarse en una tarea.
- **Texto grande:** facilita la lectura, sin inferir un perfil clínico.
- **Menos distracciones:** presenta la lectura en una sola columna y elimina decoración innecesaria.
- **Guía por pasos:** secuencia sencilla y predecible.
- **Apoyo lingüístico español–árabe:** traducción opcional para no sobrecargar al alumno.

Estos apoyos pueden resultar útiles en distintos perfiles, incluidos estudiantes con TDAH, TEA o dificultades de aprendizaje, memoria, planificación y autorregulación. No se registra un diagnóstico ni una posible historia de consumo de sustancias. Las dificultades cognitivas deben valorarse individualmente por profesionales competentes: no se presume su origen a partir de antecedentes.

## Recursos matemáticos del índice de Genially

La página `/newton` contiene un vínculo al recurso original:
https://view.genially.com/5f7e09dd1b2b330d2efa2489

Se trata de un índice público de materiales de pepvidalg (cálculo, proporcionalidad, fracciones, geometría, etc.). No se copia ni se integra el material externo dentro de NeuroAula; el enlace abre el sitio del autor, que requiere internet y está sujeto a sus condiciones. Se ofrece por separado una actividad **original** de proporcionalidad directa e inversa, autocorregible sin IA, con pistas graduales, apoyo opcional en árabe, letra grande, guía visual y un modo de menor estimulación.

El funcionamiento de las actividades propias en navegador no equivale a distribución offline: **la web completa aún necesita una conexión para cargarse**. El Genially original no está disponible sin internet mediante esta implementación.

## Requisitos del futuro piloto GINSO

- Comprobar condiciones de uso y conectividad que permita el centro; no dar acceso a redes externas al alumnado cuando esté prohibido.
- Preparar paquete de contenidos autorizados localmente, auditado y sin dependencias externas; no descargar ni reproducir Genially sin permiso.
- Ofrecer al docente control sobre dificultad, cantidad de estímulos, tareas y descansos.
- Registrar evidencias educativas únicamente con autorización, minimización de datos y controles de acceso.
- Someter traducciones y materiales de contenido a revisión humana y pruebas de accesibilidad.


## Tutoriales y vídeo local (prototipo, 29/10/2026)

El componente reutilizable `src/components/tutorial-player.tsx` se muestra en:
- `/libros`: tras la lectura y el glosario, con explicación textual escalonada y apoyo al español/árabe.
- `/newton`: explicación guiada de las cuatro fases matemáticas y vista previa de un vídeo educativo.
- Las versiones HTML independientes se pueden abrir localmente sin internet.

Como demostración, permite elegir un vídeo **MP4 o WebM ya disponible en el equipo**, reproducirlo con controles nativos y quitarlo. Utiliza `URL.createObjectURL`, revoca la URL al retirar el vídeo o desmontar el componente, no reproduce automáticamente y no envía el archivo al servidor. Se limita a 150 MB. No es una biblioteca persistente ni hay subida de material a Supabase.

**Antes de almacenar vídeos y servirlos a estudiantes**: almacenamiento privado, permisos por organización y aula, autoría y licencias, administrador docente, límites de tamaño y revisión de formatos, subtítulos/transcripción, versiones accesibles, política de retención y copia local segura. No insertar YouTube ni recursos remotos en dispositivos sin acceso a internet del alumnado.

La versión desplegada aún **no** contiene estas pantallas mientras el PR esté en borrador y sin pruebas completas de build.
