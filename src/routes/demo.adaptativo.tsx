import { createFileRoute } from "@tanstack/react-router";
import { GuidedQuestionsDemo } from "@/components/guided-questions-demo";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import { adaptiveActivity } from "@/lib/demo-data";

export const Route = createFileRoute("/demo/adaptativo")({
  component: Adaptive,
});

function Adaptive() {
  const { lang } = useLang();
  const t = demoT[lang];
  const activity = adaptiveActivity;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t.adaptive.title}</h1>
        <p className="text-sm text-ink-soft">
          {activity.subject} · {activity.topic}
        </p>
      </header>
      <GuidedQuestionsDemo lang={lang} statement={activity.statement} />
    </div>
  );
}
