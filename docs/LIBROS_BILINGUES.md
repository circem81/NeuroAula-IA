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
