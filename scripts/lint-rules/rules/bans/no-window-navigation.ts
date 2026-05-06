import type { Rule } from "../../types";

const windowNav = /\bwindow\.location\.(href|assign|replace)\s*=?/;

export const noWindowNavigation: Rule = {
  name: "no-window-navigation",
  message: "Use react-router's useNavigate(). Direct window.location mutation is forbidden.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (windowNav.test(line)) addError(index + 1);
    });
  },
};
