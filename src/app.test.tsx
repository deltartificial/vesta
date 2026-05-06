import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/app";

describe("App", () => {
  it("renders the title", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Vesta" })).toBeInTheDocument();
  });
});
