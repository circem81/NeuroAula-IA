#!/usr/bin/env node
// Guardia de permisos del sistema de agentes de desarrollo de NeuroAULA.
// Se ejecuta antes de cada herramienta (hook PreToolUse de Claude Code).
// Salida 0 = sin objeción (sigue el flujo normal de permisos). Salida 2 = bloqueado.
// No usa red ni dependencias. Las reglas editables están en harness/permisos.json.
import { readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Reglas fijas: no dependen de la fase ni del rol. */
const COMANDOS_PROHIBIDOS = [
  [/\bgit\b[^|;&\n]*\bpush\b/, "publicar con git push"],
  [/\bgit\b[^|;&\n]*\b(rebase|filter-branch|filter-repo)\b/, "reescribir el historial de Git"],
  [/\bgit\b[^|;&\n]*\bcommit\b[^|;&\n]*--amend\b/, "reescribir un commit (amend)"],
  [/\bgit\b[^|;&\n]*\breset\b[^|;&\n]*--hard\b/, "descartar trabajo con reset --hard"],
  [/\bgit\b[^|;&\n]*\b(gc|prune|repack)\b/, "compactar o purgar objetos de Git"],
  [/\bgit\b[^|;&\n]*\bclean\b/, "borrar archivos sin seguimiento"],
  [/\bsupabase\b/, "usar la CLI de Supabase"],
  [/\b(wrangler|vercel|netlify)\b/, "usar herramientas de despliegue"],
  [/\bnitro\b[^|;&\n]*\bdeploy\b/, "desplegar"],
  [/\b(pnpm|npm|yarn|bun)\b[^|;&\n]*\b(deploy|publish)\b/, "publicar o desplegar"],
  [/\b(pnpm|yarn|bun)\b[^|;&\n]*\b(add|remove|update|upgrade|up)\b/, "cambiar dependencias"],
  [/\bnpm\b[^|;&\n]*\b(install|i|uninstall|update)\b\s+[^-\s]/, "cambiar dependencias"],
  [/\bbun\s+install\b/, "instalar con bun (el gestor de referencia es pnpm)"],
  [/\.env(?!\.example)(\.[\w.-]+)?\b/, "leer o tocar archivos .env"],
  [/\b(OPENAI|ANTHROPIC)_API_KEY\b/, "usar claves de API"],
  [/api\.(openai|anthropic)\.com/, "llamar a APIs de pago"],
  [/\bollama\b[^|;&\n]*\b(pull|push|rm)\b/, "descargar o borrar modelos de Ollama"],
];
const ESCRITURA_EN_SHELL =
  /(^|[\s;&|(])(rm|mv|cp|tee|touch|mkdir|truncate|chmod|ln|dd|patch)\s|\bsed\b[^|;&\n]*\s-i|\bgit\b[^|;&\n]*\b(add|commit|checkout|restore|stash|merge|switch|branch|apply|cherry-pick|revert|tag|worktree|mv|rm)\b|(^|[^&>])>{1,2}(?!\s*(\/dev\/null|&|>))/;

const rel = (p) => p.split(path.sep).join("/");
const dentro = (ruta, prefijo) =>
  prefijo.endsWith("/") ? ruta.startsWith(prefijo) || ruta === prefijo.slice(0, -1) : ruta === prefijo;
const esEnv = (ruta) => {
  const base = ruta.split("/").pop() ?? "";
  return /^\.env(\..+)?$/.test(base) && base !== ".env.example";
};

function rutaRelativa(archivo, raiz, cwd) {
  const abs = path.resolve(cwd || raiz, archivo);
  let real = abs;
  try {
    // Resuelve enlaces simbólicos del directorio para que no sirvan de atajo.
    real = path.join(realpathSync(path.dirname(abs)), path.basename(abs));
  } catch {}
  let raizReal = raiz;
  try {
    raizReal = realpathSync(raiz);
  } catch {}
  const r = path.relative(raizReal, real);
  return r.startsWith("..") || path.isAbsolute(r) ? null : rel(r);
}

/** Devuelve null si no hay objeción, o el motivo del bloqueo. */
export function decidir(entrada, permisos, raiz) {
  const herramienta = entrada?.tool_name ?? "";
  const datos = entrada?.tool_input ?? {};
  const rol = entrada?.agent_type ?? null; // null = sesión principal
  const fase1 = permisos.fase === 1;
  const reglasRol = rol ? permisos.roles?.[rol] : null;

  if (/^mcp__.*supabase/i.test(herramienta))
    return "Supabase es una tarea separada: ninguna herramienta de Supabase está permitida aquí.";

  if (herramienta === "Bash") {
    const orden = String(datos.command ?? "");
    for (const [patron, motivo] of COMANDOS_PROHIBIDOS)
      if (patron.test(orden)) return `No está permitido ${motivo}. Requiere autorización expresa de la usuaria.`;
    const escribe = ESCRITURA_EN_SHELL.test(orden);
    if (rol && !reglasRol) {
      if (escribe) return `El agente «${rol}» no tiene un rol con permisos de escritura en este proyecto.`;
    } else if (rol && reglasRol.shellSoloLectura && escribe) {
      return `El rol «${rol}» solo puede leer y ejecutar comprobaciones; este comando modifica archivos o Git.`;
    }
    if (fase1 && escribe)
      for (const zona of permisos.bloqueadoEnFase1 ?? [])
        if (orden.includes(zona)) return `Fase 1: no se modifica ${zona}. Este comando escribe y menciona esa ruta.`;
    return null;
  }

  const archivo = datos.file_path ?? datos.notebook_path ?? null;
  if (!archivo) return null;
  const ruta = rutaRelativa(String(archivo), raiz, entrada?.cwd);

  if (herramienta === "Read") {
    if (esEnv(rel(String(archivo))) || (ruta && esEnv(ruta)))
      return "No se leen archivos .env: pueden contener credenciales. Usa .env.example.";
    return null;
  }

  if (["Edit", "Write", "NotebookEdit", "MultiEdit"].includes(herramienta)) {
    if (ruta === null)
      return rol ? "Los agentes solo escriben dentro del proyecto." : null;
    if (esEnv(ruta)) return "No se modifican archivos .env.";
    for (const p of permisos.soloUsuaria ?? [])
      if (dentro(ruta, p)) return `«${ruta}» solo lo cambia la usuaria (o Claude con su aprobación expresa, fuera de este sistema).`;
    if (fase1)
      for (const zona of permisos.bloqueadoEnFase1 ?? [])
        if (dentro(ruta, zona)) return `Fase 1: no se modifica ${zona} (planificación y revisión únicamente).`;
    if (rol) {
      if (!reglasRol) return `El agente «${rol}» no tiene un rol con permisos de escritura en este proyecto.`;
      if (!(reglasRol.editar ?? []).some((p) => dentro(ruta, p)))
        return `El rol «${rol}» no puede modificar «${ruta}». Rutas permitidas: ${(reglasRol.editar ?? []).join(", ") || "ninguna"}.`;
    }
  }
  return null;
}

export function cargarPermisos(raiz) {
  return JSON.parse(readFileSync(path.join(raiz, "harness", "permisos.json"), "utf8"));
}

function principal() {
  const raiz = process.env.CLAUDE_PROJECT_DIR || path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
  let motivo;
  try {
    const entrada = JSON.parse(readFileSync(0, "utf8"));
    motivo = decidir(entrada, cargarPermisos(raiz), raiz);
  } catch (error) {
    // Ante cualquier fallo se bloquea: nunca se permite por error.
    motivo = `La guardia de permisos no pudo evaluar la acción (${error?.message ?? "error"}).`;
  }
  if (motivo) {
    process.stderr.write(`[guardia NeuroAULA] ${motivo}\n`);
    process.exit(2);
  }
  process.exit(0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) principal();
