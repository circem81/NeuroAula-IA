import { tutorLearningTwin } from "@/lib/learning-twin-demo";
import { twinTeacherReport } from "@/lib/learning-twin";
import type { TutorLang, TutorState } from "@/lib/tutor";

export function LearningTwinSummary({
  state,
  organizationId,
  lang,
}: {
  state: TutorState;
  organizationId: string;
  lang: TutorLang;
}) {
  const twin = tutorLearningTwin(state, organizationId, new Date().toISOString());
  if (!twin) return null;
  const report = twinTeacherReport(twin, lang);
  return (
    <section
      className="border-t border-border/60 p-5 sm:p-6"
      aria-labelledby="learning-twin-title"
      aria-live="polite"
    >
      <h3 id="learning-twin-title" className="text-base font-semibold">
        Learning Twin · {lang === "es" ? "Ecuaciones de primer grado" : "Linear equations"}
      </h3>
      <p className="mt-2 font-medium">{report.state}</p>
      <p className="mt-2 text-sm">{report.evidence}</p>
      <p className="mt-2 text-sm">
        {lang === "es" ? "Ayuda registrada por intento" : "Support recorded per attempt"}:{" "}
        {report.supportSequence}
      </p>
      <p className="mt-2 text-sm">{report.support}</p>
      <p className="mt-2 text-sm">{report.difficulty}</p>
      <p className="mt-3 text-sm">
        <strong>{lang === "es" ? "Siguiente intervención: " : "Next intervention: "}</strong>
        {report.nextStep}
      </p>
      <p className="mt-3 text-xs text-ink-soft">
        {report.limitation}{" "}
        {lang === "es"
          ? "Prueba ficticia de esta pestaña. El razonamiento y las causas de error no se han observado. Los intentos antiguos sin fecha no se incorporan."
          : "Fictional trial in this tab. Reasoning and error causes are unobserved. Older undated attempts are excluded."}
      </p>
    </section>
  );
}
