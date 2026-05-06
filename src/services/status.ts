import { Health } from "@/schemas/health";

const MOCK_DELAY_MS = 250;

export async function getStatus(): Promise<Health> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return Health.parse({ status: "ok", version: "1.2.0" });
}
