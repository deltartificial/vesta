import { APP_FILE } from "../../paths";
import type { Rule } from "../../types";

export const noEagerPageImport: Rule = {
  name: "no-eager-page-import",
  message: "Pages must be loaded lazily: const X = lazy(() => import('@/pages/x')).",
  match: (rel) => rel === APP_FILE,
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (line.includes("@/pages/") && line.startsWith("import ") && !line.includes("type ")) {
        addError(index + 1);
      }
    });
  },
};
