import { useEffect, useState, type ChangeEvent } from "react";
import { BookOpenText, FileVideo, PlayCircle, Trash2, Upload } from "lucide-react";

export type TutorialPlayerProps = {
  title: string;
  description?: string;
  steps: readonly string[];
  resourceId: string;
};

/**
 * Vista PRELIMINAR de vídeos docentes: el vídeo se carga solo en el navegador
 * como object URL. Nunca se sube al servidor ni se vincula con el alumno.
 * No usa YouTube, iframes, CDN ni servicios externos. Se requiere autorización
 * docente para una futura biblioteca persistente y selección segura de archivos.
 */
export function TutorialPlayer({
  title,
  description,
  steps,
  resourceId,
}: TutorialPlayerProps) {
  const [localVideo, setLocalVideo] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState("");
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    return () => {
      if (localVideo?.url) URL.revokeObjectURL(localVideo.url);
    };
  }, [localVideo]);

  function selectVideo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["video/mp4", "video/webm"].includes(file.type)) {
      setError("Selecciona un vídeo MP4 o WebM.");
      return;
    }
    if (file.size > 150 * 1024 * 1024) {
      setError("El vídeo debe ocupar menos de 150 MB.");
      return;
    }
    setError("");
    setLocalVideo({ url: URL.createObjectURL(file), name: file.name });
  }

  function clearVideo() {
    setLocalVideo(null);
    setError("");
  }

  return (
    <section
      aria-label={"Tutorial para " + title}
      className="rounded-2xl border border-border/70 bg-white p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted">
          <PlayCircle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            {description ?? "Puedes leer los pasos o reproducir un vídeo autorizado."}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowText((show) => !show)}
          aria-expanded={showText}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/70 px-3 text-sm font-medium hover:bg-muted"
        >
          <BookOpenText className="h-4 w-4" aria-hidden="true" />
          {showText ? "Ocultar explicación" : "Ver explicación paso a paso"}
        </button>
        {showText && (
          <ol className="mt-3 list-decimal space-y-2 rounded-xl bg-muted/50 px-6 py-4 text-sm leading-6">
            {steps.map((step, index) => <li key={resourceId + "-" + index}>{step}</li>)}
          </ol>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-border/70 p-4">
        {localVideo ? (
          <div className="space-y-3">
            <video
              key={localVideo.url}
              controls
              preload="metadata"
              playsInline
              aria-label={"Vídeo local: " + localVideo.name}
              className="aspect-video w-full rounded-xl bg-black"
            >
              <source src={localVideo.url} type={localVideo.name.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4"}/>
              Tu navegador no admite este formato de vídeo.
            </video>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="max-w-full truncate text-xs text-ink-soft">{localVideo.name}</p>
              <button
                type="button"
                onClick={clearVideo}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border/70 px-3 text-sm"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Quitar vídeo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileVideo className="h-4 w-4" aria-hidden="true" />
              Añadir un vídeo educativo en este dispositivo
            </div>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow">
              <Upload className="h-4 w-4" aria-hidden="true" />
              Elegir vídeo MP4 o WebM
              <input
                aria-label="Seleccionar archivo de vídeo para este tutorial"
                type="file"
                accept="video/mp4,video/webm"
                onChange={selectVideo}
                className="sr-only"
              />
            </label>
          </div>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        <p className="mt-3 text-xs leading-5 text-ink-soft">
          Vista previa local: el archivo no se sube, no queda guardado y se pierde al
          cerrar esta página. No se conecta con plataformas de vídeo externas.
          Para una biblioteca permanente, deberá aprobarlo y administrarlo el centro.
        </p>
      </div>
    </section>
  );
}
