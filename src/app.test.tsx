import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/app";

describe("App", () => {
  it("lazy-loads the home route and renders the title", async () => {
    render(<App />);
    expect(await screen.findByRole("heading", { name: "vesta" })).toBeInTheDocument();
  });
});
