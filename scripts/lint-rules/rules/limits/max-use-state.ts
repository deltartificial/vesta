import { isComponentFile } from "../../helpers";
import { numOption, type Rule } from "../../types";

const useStateCall = /\buseState\s*[<(]/;

export const maxUseState: Rule = {
  name: "max-useState",
  message: "Too many useState calls. Move state into a Zustand store or a reducer.",
  defaultOptions: { max: 3 },
  match: isComponentFile,
  check({ lines, addError, options }) {
    const max = numOption(options, "max", 3);
    let count = 0;
    let firstLine = 0;
    lines.forEach((line, index) => {
      if (useStateCall.test(line)) {
        count += 1;
        if (firstLine === 0) firstLine = index + 1;
      }
    });
    if (count > max) {
      addError(
        firstLine || 1,
        `${count} useState calls exceed the limit of ${max}. Move state into a Zustand store or a reducer.`,
      );
    }
  },
};
