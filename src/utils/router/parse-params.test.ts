import { isNotFound } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseParams } from "@/utils/router/parse-params";

const parse = parseParams(z.object({ id: z.coerce.number().int() }));

describe("parseParams", () => {
  it("returns the parsed params", () => {
    expect(parse({ id: "42" })).toEqual({ id: 42 });
  });

  it("throws notFound when the params do not match the schema", () => {
    let thrown: unknown;
    try {
      parse({ id: "nope" });
    } catch (error) {
      thrown = error;
    }
    expect(isNotFound(thrown)).toBe(true);
  });
});
