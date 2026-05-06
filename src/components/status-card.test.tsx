import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import { StatusCard } from "@/components/status-card";

vi.mock("@/services/status", () => ({
  getStatus: vi.fn(() => Promise.reject(new Error("boom"))),
}));

function Wrapper({ children }: PropsWithChildren) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("StatusCard", () => {
  it("shows the loading state on first render", () => {
    render(
      <Wrapper>
        <StatusCard />
      </Wrapper>,
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows unavailable when the query rejects", async () => {
    render(
      <Wrapper>
        <StatusCard />
      </Wrapper>,
    );
    expect(await screen.findByText("unavailable")).toBeInTheDocument();
  });
});
