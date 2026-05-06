import { memo } from "react";

export const PageFallback = memo(function PageFallback() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-400"
    />
  );
});
