import { isComponentFile } from "../../helpers";
import type { Rule } from "../../types";

const MAX_USE_STATE = 3;
const useStateCall = /\buseState\s*[<(]/;

export const maxUseState: Rule = {
  name: "max-useState",
  message: `useState calls exceed ${MAX_USE_STATE}. Move state into a Zustand store or a reducer.`,
  match: isComponentFile,
  check({ lines, addError }) {
    let count = 0;
    let firstLine = 0;
    lines.forEach((line, index) => {
      if (useStateCall.test(line)) {
        count += 1;
        if (firstLine === 0) firstLine = index + 1;
      }
    });
    if (count > MAX_USE_STATE) {
      addError(
        firstLine || 1,
        `${count} useState calls exceed the limit of ${MAX_USE_STATE}. Move state into a Zustand store or a reducer.`,
      );
    }
  },
};
