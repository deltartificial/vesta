import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { HttpError, http } from "@/services/http";

const Health = z.object({ status: z.literal("ok") });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("http", () => {
  it("parses a successful response through the schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ status: "ok" }), { status: 200 })),
    );

    const result = await http(Health, { url: "https://example.test/health" });
    expect(result).toEqual({ status: "ok" });
  });

  it("throws HttpError on non-2xx", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 503, statusText: "Unavailable" })),
    );

    await expect(http(Health, { url: "https://example.test/health" })).rejects.toBeInstanceOf(
      HttpError,
    );
  });

  it("rejects when payload does not match schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ status: "down" }), { status: 200 })),
    );

    await expect(http(Health, { url: "https://example.test/health" })).rejects.toThrow();
  });
});
