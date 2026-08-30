import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";

export const Route = createFileRoute("/demo/config")({
  component: Settings,
});

function Settings() {
  const { lang } = useLang();
  const t = demoT[lang];
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t.settings.title}</h1>
        <p className="text-sm text-ink-soft">{t.settings.subtitle}</p>
      </header>
      <div className="card-soft p-6 text-sm text-ink-soft">
        {lang === "es"
          ? "Vista informativa simulada. La configuración del centro, las integraciones con LMS y las preferencias todavía no están disponibles."
          : "Simulated informational view. School settings, LMS integrations and preferences are not available yet."}
      </div>
    </div>
  );
}
