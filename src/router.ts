import { createBrowserHistory, createRouter, type RouterHistory } from "@tanstack/react-router";
import { PageFallback } from "@/components/ui/page-fallback";
import { routeTree } from "@/route-tree.gen";

export function createAppRouter(history: RouterHistory = createBrowserHistory()) {
  return createRouter({
    routeTree,
    history,
    defaultPreload: "intent",
    defaultPendingComponent: PageFallback,
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}
