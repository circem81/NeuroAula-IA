# Sistema de agentes de desarrollo de NeuroAULA

Una ampliación de Claude Code hecha con archivos de este repositorio. No es un programa aparte,
no necesita clave de API y no instala paquetes. Sirve para desarrollar la aplicación; no forma
parte de ella ni se publica con ella.

No confundir con los **agentes educativos** (`src/lib/tutor*`, `src/lib/education-agents*`), que
funcionan dentro de la aplicación para el docente.

## Instalación (un solo paso, lo hace la usuaria)

Claude no puede escribir en la carpeta `.claude/` de tu ordenador desde una sesión remota: es una
protección de la aplicación. Los archivos están preparados en `harness/para-instalar/dot-claude/`.
Para activarlos, abre Terminal en la carpeta del proyecto y ejecuta:

```bash
cp -R harness/para-instalar/dot-claude .claude
node --test harness/pruebas/*.test.mjs
```

El segundo comando debe terminar con 9 pruebas aprobadas. Hasta que no se haga este paso, los
roles y la guardia no están activos en esta carpeta.

## Qué hay

| Ruta | Para qué |
| --- | --- |
| `CLAUDE.md` | Reglas del proyecto que Claude lee al empezar |
| `.claude/agents/` | Los cuatro roles: coordinador, desarrollador-libro, revisor-pedagogico, revisor-tecnico |
| `.claude/skills/` | Conocimiento que se carga cuando hace falta: el libro y la verificación |
| `.claude/settings.json` | Prohibiciones nativas de Claude Code y conexión con la guardia |
| `.claude/hooks/guardia.mjs` | Guardia: bloquea acciones prohibidas antes de que se ejecuten |
| `harness/permisos.json` | Fase actual y qué puede modificar cada rol |
| `harness/DECISIONES.md` | Registro de decisiones: aprobado, propuesto, pendiente |
| `harness/TAREAS.md` | Tablero de tareas |
| `harness/propuestas/` | Contenido propuesto, pendiente de aprobación |
| `harness/revisiones/` | Informes de los revisores |
| `harness/pruebas/` | Pruebas de la guardia (`node --test harness/pruebas/*.test.mjs`) |

## Quién puede hacer qué

| Rol | Lee | Escribe | Ejecuta |
| --- | --- | --- | --- |
| coordinador | Todo salvo credenciales | Solo `harness/` | Nada |
| desarrollador-libro | Todo salvo credenciales | Solo los archivos del libro, y solo a partir de la fase 2 | Comprobaciones |
| revisor-pedagogico | Todo salvo credenciales | Nada | Nada |
| revisor-tecnico | Todo salvo credenciales | Nada | Comprobaciones |

Nadie, tampoco la sesión principal de Claude Code, puede publicar, reescribir el historial,
desplegar, usar Supabase, leer `.env.local`, llamar a APIs de pago ni cambiar dependencias.

## Fases

- **Fase 1 (actual):** planificación y revisión. `src/` y `supabase/` no se modifican.
- **Fase 2:** el desarrollador implementa una sola página del libro. Para abrirla, la usuaria
  cambia `"fase": 1` por `"fase": 2` en `harness/permisos.json`. Ningún agente puede hacerlo.

## Cómo usarlo

En Claude Code, dentro de esta carpeta:

- «Usa el coordinador para planificar …»
- «Pide al revisor pedagógico que revise `harness/propuestas/…`»
- O iniciar la sesión con un rol: `claude --agent coordinador`

## Límites conocidos

- La guardia reconoce los comandos por su texto. Cubre las formas habituales, no todas las
  imaginables: es una barrera contra errores, no contra alguien decidido a saltársela.
- Puede bloquear de más (por ejemplo `git log --grep=push`). Es deliberado: ante la duda, bloquea.
- La guardia necesita Node.js. Si no está disponible, Claude Code bloquea la acción en lugar de
  permitirla (`onFailure: block`).
- Estas reglas se aplican en Claude Code ejecutándose en esta carpeta. No gobiernan una sesión
  de Claude en la nube ni lo que se haga a mano en la terminal.
- Las comprobaciones autorizadas de antemano (`permissions.allow`) solo se activan cuando la
  carpeta se marca como de confianza en Claude Code. Hasta entonces pide confirmación; las
  prohibiciones y la guardia funcionan desde el primer momento.
- Varios agentes consumen el uso del plan de Claude más deprisa que uno solo.

## Referencias

Diseño inspirado en las ideas de `shareAI-lab/learn-claude-code` (tareas en archivos,
subagentes con contexto propio, conocimiento bajo demanda, permisos). No se ha copiado código ni
texto de ese ni de otros repositorios.
