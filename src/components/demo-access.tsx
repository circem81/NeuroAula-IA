import { useEffect, useState, type FormEvent } from "react";
import { Brain, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { useDemoAuth } from "@/lib/demo-auth";

type AccessMode = "signin" | "signup" | "forgot" | "update";

const copy: Record<AccessMode, { title: string; description: string; submit: string }> = {
  signin: {
    title: "Accede a NeuroAula",
    description: "Inicia sesión para entrar en la plataforma con los permisos de tu centro.",
    submit: "Iniciar sesión",
  },
  signup: {
    title: "Crea tu cuenta",
    description:
      "Confirma tu correo. Un administrador deberá activar tu membresía antes de entrar.",
    submit: "Crear cuenta",
  },
  forgot: {
    title: "Recupera tu acceso",
    description: "Te enviaremos un enlace seguro para establecer una contraseña nueva.",
    submit: "Enviar enlace",
  },
  update: {
    title: "Nueva contraseña",
    description: "Elige una contraseña nueva para completar la recuperación de tu cuenta.",
    submit: "Guardar contraseña",
  },
};

export function DemoAccess() {
  const { configured, passwordRecovery, requestPasswordReset, signIn, signUp, updatePassword } =
    useDemoAuth();
  const [mode, setMode] = useState<AccessMode>(passwordRecovery ? "update" : "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (passwordRecovery) setMode("update");
  }, [passwordRecovery]);

  function changeMode(nextMode: AccessMode) {
    setMode(nextMode);
    setMessage(null);
    setPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const result =
      mode === "signin"
        ? await signIn(email.trim(), password)
        : mode === "signup"
          ? await signUp(name.trim(), email.trim(), password)
          : mode === "forgot"
            ? await requestPasswordReset(email.trim())
            : await updatePassword(password);

    setPending(false);
    if (result.error) {
      setIsError(true);
      setMessage(result.error);
      return;
    }

    setIsError(false);
    if (mode === "forgot") {
      setMessage("Si existe una cuenta con ese correo, recibirás un enlace de recuperación.");
    } else if (mode === "signup" && result.emailConfirmationRequired) {
      setMessage("Revisa tu correo para confirmar la cuenta antes de iniciar sesión.");
    } else if (mode === "update") {
      setMessage("Contraseña actualizada correctamente.");
    }
  }

  const currentCopy = copy[mode];
  const needsEmail = mode !== "update";
  const needsPassword = mode !== "forgot";

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-soft px-4 py-10">
      <div className="grid-bg absolute inset-0" />
      <section className="card-soft relative w-full max-w-md p-7 sm:p-9">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand shadow-glow">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-brand">
          Zona protegida
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{currentCopy.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{currentCopy.description}</p>

        {!configured && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Faltan <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <Field label="Nombre">
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
              />
            </Field>
          )}
          {needsEmail && (
            <Field label="Correo electrónico">
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
            </Field>
          )}
          {needsPassword && (
            <Field label={mode === "update" ? "Nueva contraseña" : "Contraseña"}>
              <input
                required
                minLength={8}
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
              />
            </Field>
          )}
          {message && (
            <p role="status" className={`text-sm ${isError ? "text-red-700" : "text-emerald-700"}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={!configured || pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-sm font-medium text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <LockKeyhole className="h-4 w-4" />
            )}
            {currentCopy.submit}
          </button>
        </form>

        {mode === "signin" && (
          <button type="button" onClick={() => changeMode("forgot")} className={linkClass}>
            ¿Has olvidado la contraseña?
          </button>
        )}
        {(mode === "signin" || mode === "signup") && (
          <button
            type="button"
            onClick={() => changeMode(mode === "signup" ? "signin" : "signup")}
            className={linkClass}
          >
            {mode === "signup"
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        )}
        {mode === "forgot" && (
          <button type="button" onClick={() => changeMode("signin")} className={linkClass}>
            Volver al inicio de sesión
          </button>
        )}

        <div className="mt-6 flex items-start gap-2 border-t border-border/70 pt-5 text-xs leading-relaxed text-ink-soft">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          Supabase gestiona la identidad y RLS limita el acceso a las membresías activas.
        </div>
      </section>
    </main>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";
const linkClass = "mt-3 w-full text-center text-sm font-medium text-brand hover:underline";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      {children}
    </label>
  );
}
