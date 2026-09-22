import { createFileRoute, Link } from "@tanstack/react-router";
import { APP } from "@/constants/app";
import { Counter } from "@/features/counter/components/counter";
import { CounterSearch } from "@/features/counter/schemas/counter-search";
import { StatusCard } from "@/features/status/components/status-card";
import { StatusField } from "@/features/status/schemas/status-field";

export const Route = createFileRoute("/")({
  validateSearch: CounterSearch,
  component: HomePage,
});

function HomePage() {
  const { step } = Route.useSearch();

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-5xl font-semibold tracking-tight">{APP.name}</h1>
        <p className="max-w-md text-sm text-neutral-400">{APP.tagline}</p>
      </div>
      <StatusCard fields={StatusField.options} />
      <nav className="flex gap-4 font-mono text-xs text-neutral-500">
        {StatusField.options.map((field) => (
          <Link
            key={field}
            to="/status/$field"
            params={{ field }}
            className="hover:text-neutral-100"
          >
            {field}
          </Link>
        ))}
      </nav>
      <Counter step={step} />
    </>
  );
}
