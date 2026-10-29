import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { BookOpen, ExternalLink, Search } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { searchOpenAlex, type ResearchRecord } from "@/lib/scientific-evidence";

export const Route = createFileRoute("/demo/evidencia")({ component: ScientificLibrary });

function ScientificLibrary() {
  const { lang } = useLang();
  const es = lang === "es";
  const [query, setQuery] = useState("ADHD executive functions classroom interventions");
  const [fromYear, setFromYear] = useState(2021);
  const [results, setResults] = useState<ResearchRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setSearched(false);
    try {
      const records = await searchOpenAlex(query, { fromYear, perPage: 10 });
      setResults(records);
      setSearched(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-5">
      <header>
        <div className="mb-2 flex items-center gap-2 text-sm text-ink-soft"><BookOpen className="h-4 w-4" /> OpenAlex</div>
        <h1 className="text-2xl font-semibold">{es ? "Biblioteca científica" : "Scientific library"}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {es
            ? "Búsqueda de publicaciones reales. Sus resultados no son recomendaciones validadas ni datos de estudiantes."
            : "Search real publications. Search results are not validated recommendations or student data."}
        </p>
      </header>
      <form onSubmit={(event) => void submit(event)} className="card-soft flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
          <span>{es ? "Palabras clave (preferentemente en inglés)" : "Keywords"}</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)}
            minLength={3} maxLength={200} required
            className="w-full rounded-lg border border-border bg-white px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>{es ? "Desde el año" : "From year"}</span>
          <input type="number" min={1900} max={new Date().getFullYear()} value={fromYear}
            onChange={(event) => setFromYear(Number(event.target.value))}
            className="w-32 rounded-lg border border-border bg-white px-3 py-2" />
        </label>
        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-brand px-4 py-2 font-medium text-white disabled:opacity-60">
          <Search className="h-4 w-4" /> {loading ? (es ? "Buscando…" : "Searching…") : (es ? "Buscar" : "Search")}
        </button>
      </form>
      <p className="text-xs text-ink-soft">
        {es ? "Fuente: API pública de OpenAlex. Las fichas se muestran sin revisión metodológica. No se guardan datos de estudiantes ni resultados de búsqueda."
            : "Source: public OpenAlex API. Records have not been methodologically reviewed. No student data or search results are stored."}
      </p>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {es ? "No se pudo consultar OpenAlex. Comprueba la conexión o inténtalo más tarde." : "Could not reach OpenAlex. Check your connection or retry."} ({error})
      </p>}
      {searched && results.length === 0 && <p className="text-sm text-ink-soft">{es ? "No se encontraron artículos." : "No articles found."}</p>}
      {results.length > 0 && <div className="flex flex-col gap-3" aria-live="polite">
        <h2 className="text-sm font-semibold">{es ? "Referencias encontradas" : "References found"} ({results.length})</h2>
        {results.map((work) => <article key={work.openAlexId} className="card-soft p-5">
          <div className="mb-2 text-xs text-amber-700">{es ? "Pendiente de revisión científica" : "Scientific review pending"}</div>
          <h3 className="font-semibold">{work.title}</h3>
          <p className="mt-1 text-xs text-ink-soft">{work.authors.slice(0, 5).join(", ")}{work.authors.length > 5 ? " et al." : ""} · {work.year ?? "s. f."} · {work.source ?? "OpenAlex"}</p>
          {work.doi && <p className="mt-1 text-xs text-ink-soft">DOI: {work.doi}</p>}
          {work.abstract && <p className="mt-3 line-clamp-5 text-sm leading-relaxed">{work.abstract}</p>}
          <a href={work.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline">
            {es ? "Consultar publicación" : "View publication"} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </article>)}
      </div>}
    </section>
  );
}
