import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeWork, reconstructAbstract, searchOpenAlex } from "./scientific-evidence.ts";

describe("scientific evidence discovery", () => {
  it("reconstructs indexed abstracts in positional order", () => {
    assert.equal(reconstructAbstract({ learning: [1], Adaptive: [0] }), "Adaptive learning");
  });
  it("normalizes DOI and preserves unreviewed status", () => {
    const result = normalizeWork({ id: "https://openalex.org/W123", doi: "https://doi.org/10.1234/ABC", display_name: "Study" });
    assert.equal(result?.doi, "10.1234/abc");
    assert.equal(result?.reviewStatus, "unreviewed");
  });
  it("encodes searches and maps results without live network", async () => {
    let requested = "";
    const fakeFetch = async (input: RequestInfo | URL) => {
      requested = String(input);
      return { ok: true, json: async () => ({ results: [{ id: "https://openalex.org/W1", display_name: "Executive functions" }] }) } as Response;
    };
    const records = await searchOpenAlex("ADHD & education", { fetcher: fakeFetch as typeof fetch });
    assert.equal(records.length, 1);
    assert.equal(new URL(requested).searchParams.get("search"), "ADHD & education");
  });
  it("rejects invalid search inputs", async () => {
    await assert.rejects(searchOpenAlex("a"));
  });
});
