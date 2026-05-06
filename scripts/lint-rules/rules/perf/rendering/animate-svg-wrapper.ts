import type { Rule } from "../../../types";

const animatedSvg = /<svg\b[^>]*className=["'][^"']*\banimate-/;

export const animateSvgWrapper: Rule = {
  name: "perf/animate-svg-wrapper",
  message:
    "Animate a wrapping <div> instead of the <svg> element so the GPU can hardware-accelerate the transform.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (animatedSvg.test(line)) addError(index + 1);
    });
  },
};
