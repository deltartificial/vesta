import { isComponentFile } from "../../../helpers";
import type { Rule } from "../../../types";

const transientStateUpdate =
  /\bset[A-Z]\w*\s*\(\s*(?:e|ev|event)\s*\.(?:clientX|clientY|deltaY|deltaX|scrollY|scrollX|touches|movementX|movementY|pageX|pageY)\b/;

export const useRefTransient: Rule = {
  name: "perf/use-ref-transient",
  message:
    "Storing pointer/scroll/touch values in useState forces a re-render every frame. Use useRef and write to a DOM node directly.",
  match: isComponentFile,
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (transientStateUpdate.test(line)) addError(index + 1);
    });
  },
};
