# Scientific evidence RAG — initial foundation

## Status
Schema and design only. No live RAG, ingestion service, embedding generation or clinical assessment is implemented.

## Sources
OpenAlex, PubMed and ERIC may supply metadata and legally accessible abstracts. Scopus requires appropriate institutional access and licensing. Store DOI, title, authors, publication year, source, URL and methodology. Do not scrape or redistribute copyrighted full text.

## Ingestion workflow
1. Search metadata using controlled terms (e.g. ADHD, executive functions, education).
2. Deduplicate using normalized DOI; manually resolve records without DOI.
3. Verify publication, methodology, participant population, intervention, outcomes and limitations.
4. Record review status and reviewer; only reviewed evidence can inform teacher-facing suggestions.
5. Split only licensed text into chunks, create embeddings server-side with a consistent 1536-dimensional model, and record source IDs.
6. Retrieve semantically relevant passages; rerank and cite DOI and passage provenance. If evidence is weak or absent, say so.
7. Teacher reviews proposed adaptation; record approval or rejection separately from research evidence.

## Security and ethics
No student identifiers, profiles, diagnoses or sensitive data belong in this shared research catalogue. New tables have RLS enabled and no client policies. Any future service-side access must enforce organization and role authorization separately and be tested for cross-tenant isolation. Never expose service-role credentials in browser code.

Evidence quality is not inferred solely from Scopus indexing or publication type. Review risk of bias, sample size, study design, applicability, replication and uncertainty. Avoid diagnosis and automated high-stakes decisions.

## Initial research question
Which classroom strategies for executive-function support have credible evidence of benefit for learners with attention-related difficulties, and in what contexts? Distinguish findings about ADHD from broader neurodiversity and avoid assuming identical needs.

## Next implementation milestones
- Add controlled ingestion with licensing and DOI validation.
- Implement server-side embedding and citation-backed retrieval.
- Add a teacher review interface and audit trail.
- Test citation fidelity, hallucination refusal, access control and pedagogical suitability before enabling recommendations.

## OpenAlex UI integration (October 2026)
- `/demo/evidencia` offers interactive keyword/year searches, returning up to 10 public records with DOI, authors, source and abstract when available.
- Menu entry visible to `teacher` and `guidance` roles only; existing demo gate enforces that navigation rule.
- Searches call the OpenAlex works API from the browser. They do **not** persist records to Supabase and do **not** send student information.
- Results are explicitly unreviewed and cannot automatically trigger accommodations or diagnoses.
- OpenAlex permits limited anonymous trial usage; production or higher-scale use needs an API key, which must be handled server-side (never in browser environment variables). See https://help.openalex.org/api/authentication/.
- The UI currently has no server-side caching, rate limiting, ingestion approval or semantic retrieval. Those are pending milestones.
- Manual verification required after merging: sign in as teacher and guidance; search for ADHD executive functions; check outgoing request and link accuracy; check family and management cannot access the page; inspect any CORS/429 errors.
