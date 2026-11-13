# NeuroAULA AI — instrucciones para Claude

Prototipo educativo con datos simulados. Lee también `AGENTS.md` (conexión con Lovable) y
`harness/README.md` (sistema de agentes de desarrollo).

## Reglas que no admiten excepción sin autorización expresa de la usuaria

- Sin `git push`, sin reescribir historial (rebase, amend, squash, reset --hard) y sin despliegues.
- Sin cambios en Supabase (ni CLI ni conector) y sin aplicar migraciones.
- Sin leer ni modificar `.env`, `.env.local` ni otras credenciales. Usa `.env.example`.
- Sin APIs de pago ni proveedores de IA nuevos. Los ejemplos programados funcionan sin IA.
- Sin datos personales reales: alumnado y respuestas siempre ficticios.
- Sin instalar ni actualizar dependencias. Gestor de referencia: pnpm con lockfile congelado.

Estas reglas las aplica además `.claude/hooks/guardia.mjs`, que bloquea la acción antes de ejecutarse.

## Cómo trabajar

- Las decisiones aprobadas están en `harness/DECISIONES.md`. Lo que no figure allí como
  «Aprobado» es una propuesta, aunque aparezca en `docs/`.
- El trabajo en curso está en `harness/TAREAS.md`.
- Explica los resultados en español sencillo, separando lo comprobado, lo cambiado y lo pendiente.
- No des nada por terminado sin haberlo verificado (`pnpm check` o la parte que corresponda).

## Dos tipos de agentes que no deben confundirse

- **Agentes de desarrollo** (`.claude/agents/`): ayudan a construir la aplicación. No se publican.
- **Agentes educativos** (`src/lib/tutor*`, `src/lib/education-agents*`): funcionan dentro de la
  aplicación para el docente. Son código del producto y se cambian como cualquier otro código.
