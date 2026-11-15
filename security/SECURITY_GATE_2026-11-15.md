# NeuroAula AI — Security gate P0 (2026-11-15)

> **Status: REVIEW ONLY.** This document and the companion SQL in `security/proposals/`
> are a proposal, **not a deployment**. Do not copy/paste into the production SQL
> editor. No live data or role changes were performed by this pull request.

## Observed facts in the connected live project

- The GitHub repository `circem81/NeuroAula-IA` is **public** (code is public; this does not imply the Supabase database is public).
- Supabase records **20 migrations**. On the `main` branch only
  `supabase/migrations/20260830165213_auth_boundary_hardening.sql` is present.
  **Reconstruct the full baseline before scheduling a new migration.**
- All 43 tables in `public` have RLS enabled, but enabling RLS alone does not
  imply correct per-learner access control.
- Policies `twin_teacher_read` on `learning_twin_state`,
  `learning_twin_evidence`, and `learning_twin_agent_events` check active
  teacher membership at organization level, **not assignment to the learner**.
- Policies on `learning_attempts` and `learning_evidence` allow
  org-level teaching staff to read/write without class assignment.
- `private.has_organization_role(...)` checks `status='active'` in the DB:
  the claim that every suspended teacher retains access is **not confirmed**
  for these pathways. Test revocation end to end before deployment.
- Empty or limited records are **not proof** that access controls are secure.
  Do not publish the contents of learner-related rows.

## Scope of proposed patch

The accompanying SQL **replaces** (does not augment) permissive RLS policies.
It keeps the current effective business roles and adds:
1. Teacher role + explicit class assignment + correct learner's enrollment.
2. Own-learner access only for individually linked, active learners.
3. Organization admin retains the previous oversight on attempts/evidence.
4. Matching `USING` and `WITH CHECK` for writes; no arbitrary foreign classroom or student rows.

This proposal intentionally leaves `learning_twin_criteria` (organization-level
curriculum metadata with no student identifier) unchanged. Other tables,
especially `learners`, `educational_hypotheses`, `classroom_teachers`, and
`classroom_learners`, require a broader **separate** review.

## Mandatory acceptance scenarios on a disposable staging copy

Create only **synthetic** organizations A/B, classrooms A1/A2/B1, learners
A1-L1/A1-L2/A2-L3/B1-L4, and five actor accounts. Exercise queries through
the same authenticated client path as the application, not using a privileged
SQL editor session (which can bypass RLS).

| Actor / attempt | Expected |
| --- | --- |
| A1-L1 reads own attempt/evidence | ALLOW |
| A1-L1 reads A1-L2's attempt/evidence | DENY (0 rows) |
| A1-L1 reads a Twin state/evidence/agent event for A1-L2 | DENY |
| Active A1 teacher reads A1-L1 and A1-L2 | ALLOW |
| Active A1 teacher reads A2-L3 or B1-L4 | DENY |
| Active A2 teacher reads A1-L1 | DENY |
| Same teacher after assignment removal reads A1-L1 | DENY |
| Same teacher after membership suspension reads A1-L1 | DENY |
| A1 teacher inserts evidence/attempt for A2-L3 | DENY |
| A1 teacher updates/deletes evidence outside A1 | DENY |
| Active organization A admin reads A records | ALLOW |
| A admin reads B1-L4 | DENY |
| Anonymous visitor reads any student row | DENY |
| Student forges another learner/classroom ID on a write | DENY |
| Duplicate membership / an actor with both teacher and learner roles | DENY unless independently authorized |

Additionally, check that a linked learner does not see assessment
revisions, free-text observations, or resource metadata that exceed the
approved educational disclosure policy.

## Before authorizing any database mutation

- [ ] Inventory *all* RLS SELECT/INSERT/UPDATE/DELETE policies and GRANTs.
- [ ] Reconstruct 20 remote migrations into a clean version-controlled baseline;
      validate on an isolated instance without student data.
- [ ] Check helper function privileges and `security definer` boundary.
- [ ] Run the complete synthetic actor matrix as automated integration tests
      against a staging Supabase project and record results.
- [ ] Review role mapping (including the demo `family` role) in frontend,
      SSR, APIs and database.
- [ ] Independently review all cross-tenant and cross-student access paths.
- [ ] Confirm retention purposes, minimization, consent/legal basis and
      authorization with the educational institution / DPO before live data.
- [ ] Verify no `service_role` / `sb_secret_*` keys in public history and
      rotate any key if exposure is confirmed.
- [ ] Have a rollback plan, security owner and release sign-off.

## Reproducibility warning

A passing `bun run check` only validates TypeScript, lint, unit tests and
build. It **does not** validate RLS or legal compliance. This PR is not
a claim that the application is ready for real pupils.

Reference: https://supabase.com/docs/guides/database/postgres/row-level-security
