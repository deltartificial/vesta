import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusCard } from "@/features/status/components/status-card";
import { StatusFieldParams } from "@/features/status/schemas/status-field";
import { parseParams } from "@/utils/router/parse-params";

export const Route = createFileRoute("/status/$field")({
  params: {
    parse: parseParams(StatusFieldParams),
  },
  component: StatusFieldPage,
});

function StatusFieldPage() {
  const { field } = Route.useParams();

  return (
    <>
      <StatusCard fields={[field]} />
      <Link to="/" className="font-mono text-xs text-neutral-500 hover:text-neutral-100">
        back
      </Link>
    </>
  );
}
