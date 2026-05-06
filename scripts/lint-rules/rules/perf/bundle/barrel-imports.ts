import type { Rule } from "../../../types";

const BARREL_LIBS = [
  "lucide-react",
  "@mui/material",
  "@mui/icons-material",
  "@radix-ui/react-icons",
  "@hugeicons/react",
  "react-icons",
];

const fromImport = /\bfrom\s+["']([^"']+)["']/;

export const bundleBarrelImports: Rule = {
  name: "perf/bundle-barrel-imports",
  message: "Importing from a barrel module ships unused exports. Import from the deep subpath.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      const m = fromImport.exec(line);
      if (!m) return;
      const lib = m[1] ?? "";
      if (BARREL_LIBS.includes(lib)) addError(index + 1);
    });
  },
};
