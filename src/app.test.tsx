import { createMemoryHistory } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/app";
import { createAppRouter } from "@/router";

function renderAt(path: string) {
  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }));
  render(<App router={router} />);
}

describe("App", () => {
  it("renders the home route", async () => {
    renderAt("/");
    expect(await screen.findByRole("heading", { name: "vesta" })).toBeInTheDocument();
  });

  it("parses the step search param into the counter", async () => {
    renderAt("/?step=3");
    const increment = await screen.findByRole("button", { name: "increment" });
    increment.click();
    expect(await screen.findByText("3")).toBeInTheDocument();
  });

  it("renders a typed status field route", async () => {
    renderAt("/status/version");
    expect(await screen.findByText("version")).toBeInTheDocument();
    expect(screen.queryByText("status")).not.toBeInTheDocument();
  });

  it("rejects a status field outside the schema", async () => {
    renderAt("/status/unknown");
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });
});
