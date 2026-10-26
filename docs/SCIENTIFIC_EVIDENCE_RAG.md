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
