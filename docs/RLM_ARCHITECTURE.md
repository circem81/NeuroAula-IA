# Arquitectura RLM para NeuroAula AI

## Objetivo

NeuroAula AI generará, si evoluciona hacia un sistema real, una gran cantidad de contexto longitudinal por alumno: evidencias, errores, tiempos de respuesta, pistas utilizadas, progreso curricular, intervenciones, recomendaciones y evolución temporal.

Ese contexto no debe convertirse en un único prompt creciente. La propuesta es adoptar el patrón de **Recursive Language Models (RLM)** como referencia arquitectónica: mantener el contexto extenso fuera del prompt y permitir que los agentes consulten, filtren y procesen únicamente la información necesaria para cada decisión.

Repositorio de referencia experimental: https://github.com/nicolasramos/rlm-agent

> `rlm-agent` se toma como referencia conceptual y experimental. NeuroAula no debe depender de esta librería para su funcionamiento ni asumir que está lista para producción.

## Principio de diseño

En lugar de:

```text
historial completo del alumno
+ expediente
+ respuestas
+ rúbricas
+ observaciones
+ currículo
        ↓
prompt muy grande
        ↓
LLM
```

usar:

```text
Supabase / evidencias longitudinales
        ↓
Context Lake del alumno
        ↓
consultas y procesamiento selectivo
        ↓
agentes especializados
        ↓
LLM
```

El **gemelo de aprendizaje** debe ser un sistema de estado consultable, no un texto estático ni un prompt permanente sobre el alumno.

## Contexto longitudinal

El sistema podrá representar, entre otros, estos dominios:

```text
Alumno
│
├── Evidencias de aprendizaje
│   ├── respuestas
│   ├── errores
│   ├── tiempos de respuesta
│   ├── intentos
│   └── pistas utilizadas
│
├── Perfil dinámico de aprendizaje
│   ├── fortalezas observadas
│   ├── dificultades observadas
│   ├── estrategias eficaces
│   └── evolución temporal
│
├── Currículo
│   ├── competencias
│   ├── criterios de evaluación
│   └── saberes básicos
│
├── Intervenciones
│   ├── propuestas
│   ├── aplicación
│   └── resultado
│
└── Historial
    ├── progreso
    ├── alertas
    └── recomendaciones
```

## Agentes y recuperación selectiva

Los agentes no deben recibir todo el historial. Cada agente solicitará el subconjunto mínimo de información necesario para su tarea.

Ejemplo:

```text
Agente curricular
→ criterios implicados
→ evidencias recientes
→ errores relacionados

Agente tutor
→ evolución reciente
→ alertas abiertas
→ intervenciones previas

Agente de adaptación
→ patrón de errores
→ pistas eficaces
→ nivel de dificultad reciente
```

Una consulta concreta podría requerir únicamente:

```text
errores recientes en fracciones
+ criterio curricular implicado
+ patrón de pistas utilizadas
+ evolución de las últimas semanas
```

## Arquitectura conceptual

```text
                NeuroAula AI
                     │
             Orquestador de agentes
                     │
     ┌───────────────┼───────────────┐
     ↓               ↓               ↓
Agente curricular  Agente tutor  Agente adaptación
     │               │               │
     └───────────────┴───────┬───────┘
                             ↓
                       Context Lake
                             ↓
                    Supabase / evidencias
                             ↓
                   Gemelo de aprendizaje
```

## Relación con RAG

RAG y RLM no son excluyentes.

- **RAG**: recupera documentos o fragmentos relevantes desde fuentes externas o internas.
- **RLM**: organiza y procesa contextos extensos como datos consultables y permite descomponer tareas en operaciones o subagentes.

NeuroAula puede utilizar ambos patrones:

```text
RAG → currículo, materiales, normativa, recursos educativos
RLM → historial longitudinal, evidencias y estado dinámico del alumno
```

## Papel de Supabase

Supabase seguirá siendo la fuente estructurada de verdad para los datos persistentes. El patrón RLM debe construirse sobre consultas autorizadas y filtradas, no copiando indiscriminadamente datos personales a prompts o memorias externas.

La autorización debe mantenerse mediante PostgreSQL + RLS y separación por organización/centro.

## Privacidad y minimización

En un contexto educativo real se aplicará el principio de minimización de datos:

- recuperar solo los datos estrictamente necesarios para cada tarea;
- evitar introducir expedientes completos en prompts;
- separar identificación, evidencias y resultados analíticos cuando sea posible;
- no interpretar automáticamente patrones educativos como diagnósticos clínicos;
- mantener supervisión humana sobre decisiones educativas relevantes;
- registrar qué información utilizó un agente para generar una recomendación.

Este patrón puede mejorar simultáneamente escalabilidad, coste, trazabilidad y privacidad.

## Decisión actual

En la fase actual de NeuroAula:

1. No instalar `rlm-agent` como dependencia.
2. Adoptar el patrón **estado externo + recuperación selectiva + agentes especializados**.
3. Diseñar futuras tablas de evidencias pensando en consultas longitudinales.
4. Mantener el gemelo de aprendizaje como representación dinámica derivada de evidencias, no como perfil clínico fijo.
5. Evaluar RLM/Hermes u otras implementaciones cuando existan agentes reales y volumen suficiente de datos para justificarlo.

## Referencias

- RLM Agent: https://github.com/nicolasramos/rlm-agent
- Concepto relacionado: Recursive Language Models / tratamiento programático de contextos extensos.
