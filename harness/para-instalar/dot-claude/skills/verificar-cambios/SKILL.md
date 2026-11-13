---
name: verificar-cambios
description: Procedimiento para comprobar cambios en NeuroAULA antes de darlos por buenos - qué ejecutar, en qué orden y cómo informar. Úsalo después de cualquier modificación de código o de la configuración de agentes.
---

# Verificar cambios

Ejecuta desde la raíz del proyecto y anota el resultado real de cada paso.

Escribe cada comando tal cual aparece aquí, uno por llamada, sin `cd` delante ni rutas absolutas:
así están autorizados de antemano y no necesitan confirmación. Cualquier otra forma puede quedar
denegada cuando nadie está delante para aprobarla.

1. `git status --short` y `git diff --stat`: qué archivos cambiaron.
2. `node --test harness/pruebas/*.test.mjs`: la guardia de permisos sigue funcionando.
3. `pnpm typecheck`: debe terminar sin errores.
4. `pnpm lint`: sin errores (la referencia son 9 avisos anteriores; avisos nuevos son un hallazgo).
5. `pnpm test`: referencia del 12 de noviembre de 2026, 76 pruebas aprobadas. El número no puede bajar.
6. `pnpm build`: solo si la tarea tocó `src/`.

`pnpm check` ejecuta los pasos 3 a 6 seguidos.

## Si las dependencias no están instaladas o fallan al leerse

- Solo se permite `pnpm install --frozen-lockfile`. No se añaden ni actualizan paquetes.
- La carpeta del proyecto puede tener archivos sin descargar de iCloud; un error de lectura en
  `node_modules` es del entorno, no del código. Infórmalo como «No verificado» y propón repetir la
  comprobación en una copia temporal fuera de la carpeta.

## Qué no forma parte de la verificación

Publicar, desplegar, aplicar migraciones, llamar a un proveedor de IA o leer `.env.local`.
