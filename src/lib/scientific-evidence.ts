/** Public research discovery only. No student data, no automatic recommendations. */
export interface ResearchRecord {
  openAlexId: string;
  doi: string | null;
  title: string;
  year: number | null;
  authors: string[];
  source: string | null;
  url: string;
  abstract: string | null;
  reviewStatus: "unreviewed";
}
type OpenAlexWork = {
  id?: string;
  doi?: string | null;
  display_name?: string;
  publication_year?: number;
  authorships?: { author?: { display_name?: string } }[];
  primary_location?: { source?: { display_name?: string } | null };
  abstract_inverted_index?: Record<string, number[]>;
};
export function reconstructAbstract(index?: Record<string, number[]>): string | null {
  if (!index) return null;
  const entries = Object.entries(index).flatMap(([word, positions]) =>
    positions.map((position) => [position, word] as const),
  );
  if (!entries.length || entries.length > 10000) return null;
  entries.sort((a, b) => a[0] - b[0]);
  return entries.map((entry) => entry[1]).join(" ");
}
export function normalizeWork(work: OpenAlexWork): ResearchRecord | null {
  if (!work.id?.startsWith("https://openalex.org/") || !work.display_name) return null;
  const doi = work.doi?.match(/^https:\/\/doi\.org\/(10\..+)$/i)?.[1].toLowerCase() ?? null;
  return {
    openAlexId: work.id,
    doi,
    title: work.display_name,
    year: work.publication_year ?? null,
    authors: (work.authorships ?? []).map((item) => item.author?.display_name).filter((name): name is string => Boolean(name)),
    source: work.primary_location?.source?.display_name ?? null,
    url: doi ? `https://doi.org/${doi}` : work.id,
    abstract: reconstructAbstract(work.abstract_inverted_index),
    reviewStatus: "unreviewed",
  };
}
export async function searchOpenAlex(
  query: string,
  options: { fromYear?: number; perPage?: number; fetcher?: typeof fetch } = {},
): Promise<ResearchRecord[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3 || trimmed.length > 200) throw new Error("Search query must be 3–200 characters");
  const fromYear = options.fromYear ?? 2021;
  if (!Number.isInteger(fromYear) || fromYear < 1900 || fromYear > 2200) throw new Error("Invalid year");
  const perPage = options.perPage ?? 10;
  if (!Number.isInteger(perPage) || perPage < 1 || perPage > 25) throw new Error("Invalid page size");
  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("search", trimmed);
  url.searchParams.set("filter", `from_publication_date:${fromYear}-01-01`);
  url.searchParams.set("per-page", String(perPage));
  url.searchParams.set("select", "id,doi,display_name,publication_year,authorships,primary_location,abstract_inverted_index");
  const response = await (options.fetcher ?? fetch)(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`OpenAlex request failed (${response.status})`);
  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || !("results" in payload) || !Array.isArray(payload.results)) {
    throw new Error("Unexpected OpenAlex response");
  }
  return (payload.results as OpenAlexWork[]).map(normalizeWork).filter((work): work is ResearchRecord => work !== null);
}
