-- Scientific evidence catalogue: no student personal data.
create extension if not exists vector;
create table if not exists public.scientific_studies (
 id uuid primary key default gen_random_uuid(),
 doi text unique,
 title text not null,
 authors text[] not null default '{}',
 publication_year integer check (publication_year between 1900 and 2200),
 source_name text,
 source_url text,
 abstract text,
 methodology text,
 evidence_level text not null default 'unreviewed' check (evidence_level in ('unreviewed','systematic_review','meta_analysis','randomized_trial','observational','qualitative','other')),
 quality_notes text,
 reviewed_by uuid references auth.users(id),
 reviewed_at timestamptz,
 created_at timestamptz not null default now()
);
create table if not exists public.scientific_evidence_chunks (
 id uuid primary key default gen_random_uuid(),
 study_id uuid not null references public.scientific_studies(id) on delete cascade,
 chunk_index integer not null check (chunk_index >= 0),
 content text not null,
 embedding vector(1536),
 unique(study_id, chunk_index)
);
create table if not exists public.educational_evidence_links (
 id uuid primary key default gen_random_uuid(),
 study_id uuid not null references public.scientific_studies(id) on delete cascade,
 educational_need text not null,
 proposed_support text not null,
 applicability_notes text,
 limitations text,
 status text not null default 'pending_review' check (status in ('pending_review','approved','rejected')),
 reviewed_by uuid references auth.users(id),
 reviewed_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists scientific_evidence_chunks_embedding_idx on public.scientific_evidence_chunks using hnsw (embedding vector_cosine_ops);
create index if not exists educational_evidence_links_need_idx on public.educational_evidence_links (educational_need);
alter table public.scientific_studies enable row level security;
alter table public.scientific_evidence_chunks enable row level security;
alter table public.educational_evidence_links enable row level security;
-- Intentionally no client policies: deny all via RLS until a vetted server-side
-- ingestion and teacher authorization workflow is implemented.
revoke all on public.scientific_studies, public.scientific_evidence_chunks, public.educational_evidence_links from anon, authenticated;
