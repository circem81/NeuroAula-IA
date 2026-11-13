// Pruebas de la guardia de permisos. No usan red, modelo ni credenciales.
// Ejecutar desde la raíz del proyecto: node --test harness/pruebas/
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { cargarPermisos, decidir } from "../../.claude/hooks/guardia.mjs";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const permisos = cargarPermisos(raiz);
const fase2 = { ...permisos, fase: 2 };
const bash = (command, agent_type) => ({ tool_name: "Bash", tool_input: { command }, agent_type, cwd: raiz });
const editar = (file_path, agent_type, tool_name = "Edit") => ({ tool_name, tool_input: { file_path }, agent_type, cwd: raiz });
const bloquea = (entrada, p = permisos) => decidir(entrada, p, raiz) !== null;

test("ningún rol ni la sesión principal puede publicar, reescribir historial o desplegar", () => {
  for (const rol of [undefined, "coordinador", "desarrollador-libro", "revisor-tecnico"])
    for (const orden of [
      "git push", "git push origin main", "git -C . push --force", "cd x && git push",
      "git rebase main", "git commit --amend -m x", "git reset --hard HEAD~1", "git gc", "git clean -fd",
      "supabase db push", "npx supabase migration up", "npx wrangler deploy", "npx nitro deploy --prebuilt",
      "pnpm add zod", "npm install left-pad", "bun install",
    ])
      assert.ok(bloquea(bash(orden, rol)), `${rol ?? "principal"}: ${orden}`);
});

test("no se leen credenciales ni se llama a APIs de pago", () => {
  assert.ok(bloquea({ tool_name: "Read", tool_input: { file_path: ".env.local" }, cwd: raiz }));
  assert.ok(bloquea({ tool_name: "Read", tool_input: { file_path: path.join(raiz, ".env") }, cwd: raiz }));
  assert.ok(!bloquea({ tool_name: "Read", tool_input: { file_path: ".env.example" }, cwd: raiz }));
  assert.ok(bloquea(bash("cat .env.local")));
  assert.ok(bloquea(bash("grep KEY ./.env")));
  assert.ok(!bloquea(bash("cat .env.example")));
  assert.ok(bloquea(bash("curl https://api.openai.com/v1/responses")));
  assert.ok(bloquea(bash("echo $ANTHROPIC_API_KEY")));
  assert.ok(bloquea(editar(".env.local")));
});

test("Supabase queda fuera: ninguna herramienta del conector", () => {
  for (const t of ["mcp__Supabase__execute_sql", "mcp__Supabase__apply_migration", "mcp__supabase__list_tables"])
    assert.ok(bloquea({ tool_name: t, tool_input: {} }));
});

test("comprobaciones habituales permitidas", () => {
  for (const orden of [
    "pnpm check", "pnpm test", "pnpm install --frozen-lockfile", "git status --short", "git diff --stat",
    "git log --oneline -5", "node --test harness/pruebas/", "ls src/lib", "pnpm typecheck 2>&1 | tail -5",
    "pnpm lint > /dev/null",
  ])
    assert.ok(!bloquea(bash(orden, "revisor-tecnico")), orden);
});

test("fase 1: nadie modifica src/ ni supabase/", () => {
  for (const rol of [undefined, "coordinador", "desarrollador-libro", "revisor-pedagogico", "revisor-tecnico"]) {
    assert.ok(bloquea(editar("src/lib/interactive-book.ts", rol)), `${rol}`);
    assert.ok(bloquea(editar("supabase/tests/nueva.sql", rol, "Write")), `${rol}`);
  }
  assert.ok(bloquea(bash("sed -i 's/a/b/' src/lib/tutor.ts")));
  assert.ok(bloquea(bash("echo x > src/nuevo.ts")));
  assert.ok(!bloquea(bash("cat src/lib/tutor.ts")));
});

test("cada rol escribe solo en su ámbito", () => {
  assert.ok(!bloquea(editar("harness/TAREAS.md", "coordinador")));
  assert.ok(!bloquea(editar("harness/DECISIONES.md", "coordinador", "Write")));
  assert.ok(bloquea(editar("README.md", "coordinador")));
  assert.ok(bloquea(editar("harness/TAREAS.md", "revisor-pedagogico")));
  assert.ok(bloquea(editar("harness/TAREAS.md", "revisor-tecnico")));
  assert.ok(bloquea(editar("harness/TAREAS.md", "desarrollador-libro")));
  assert.ok(bloquea(bash("echo hecho >> harness/TAREAS.md", "revisor-tecnico")));
  assert.ok(bloquea(bash("git add -A && git commit -m x", "revisor-tecnico")));
  assert.ok(bloquea(bash("rm harness/TAREAS.md", "coordinador")));
});

test("fase 2: el desarrollador edita solo los archivos del libro", () => {
  assert.ok(!bloquea(editar("src/lib/interactive-book.ts", "desarrollador-libro"), fase2));
  assert.ok(!bloquea(editar("src/components/equation-balance.tsx", "desarrollador-libro", "Write"), fase2));
  assert.ok(bloquea(editar("src/lib/tutor.ts", "desarrollador-libro"), fase2));
  assert.ok(bloquea(editar("src/lib/learning-twin.ts", "desarrollador-libro"), fase2));
  assert.ok(bloquea(editar("src/lib/interactive-book.ts", "coordinador"), fase2));
  assert.ok(bloquea(editar("src/lib/interactive-book.ts", "revisor-tecnico"), fase2));
  assert.ok(bloquea(editar("supabase/migrations/x.sql", "desarrollador-libro", "Write"), fase2));
});

test("archivos reservados a la usuaria y agentes sin rol", () => {
  for (const f of ["AGENTS.md", ".claude/settings.json", ".claude/hooks/guardia.mjs", "harness/permisos.json", "package.json", "pnpm-lock.yaml"])
    for (const rol of [undefined, "coordinador", "desarrollador-libro"]) assert.ok(bloquea(editar(f, rol), fase2), `${rol}: ${f}`);
  assert.ok(bloquea(editar("harness/TAREAS.md", "general-purpose")));
  assert.ok(bloquea(editar("/etc/hosts", "coordinador")));
  assert.ok(bloquea(editar("../otro-proyecto/x.ts", "desarrollador-libro"), fase2));
});

test("el script real devuelve 2 al bloquear, 0 al permitir y bloquea si la entrada es inválida", () => {
  const guardia = path.join(raiz, ".claude", "hooks", "guardia.mjs");
  const ejecutar = (input) => spawnSync(process.execPath, [guardia], { input, env: { ...process.env, CLAUDE_PROJECT_DIR: raiz } });
  const bloqueado = ejecutar(JSON.stringify(bash("git push origin main")));
  assert.equal(bloqueado.status, 2);
  assert.match(bloqueado.stderr.toString(), /guardia NeuroAULA/);
  assert.equal(ejecutar(JSON.stringify(bash("pnpm test"))).status, 0);
  assert.equal(ejecutar("esto no es JSON").status, 2);
});
