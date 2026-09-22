import { basename } from "node:path";
import { isRouteFile } from "../../helpers";
import { ROUTES_DIR } from "../../paths";
import type { Rule } from "../../types";

const readsSearch = /\buseSearch\s*\(/;
const validatesSearch = /\bvalidateSearch\s*:/;
const parsesParams = /\bparse\s*:\s*parseParams\s*\(/;

export const requireRouteSchemas: Rule = {
  name: "require-route-schemas",
  message: "Route params and search params must be validated by a Zod schema.",
  match: (rel) => isRouteFile(rel) && basename(rel) !== "__root.tsx",
  check({ rel, lines, content, addError }) {
    if (rel.slice(ROUTES_DIR.length).includes("$") && !parsesParams.test(content)) {
      addError(1, "Routes with path params must declare params: { parse: parseParams(Schema) }.");
    }
    if (validatesSearch.test(content)) return;
    lines.forEach((line, index) => {
      if (readsSearch.test(line)) {
        addError(index + 1, "Routes reading search params must declare validateSearch: Schema.");
      }
    });
  },
};
