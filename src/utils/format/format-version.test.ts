import { describe, expect, it } from "vitest";
import { formatVersion } from "@/utils/format/format-version";

describe("formatVersion", () => {
  it("prefixes a bare semver with v", () => {
    expect(formatVersion("1.2.0")).toBe("v1.2.0");
  });

  it("leaves a v-prefixed version untouched", () => {
    expect(formatVersion("v3.0.0-rc.1")).toBe("v3.0.0-rc.1");
  });
});
