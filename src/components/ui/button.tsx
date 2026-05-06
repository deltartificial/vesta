import { type ButtonHTMLAttributes, memo } from "react";
import { cn } from "@/utils/cn";

export const Button = memo(function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "rounded border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-100 transition-colors hover:bg-neutral-800 active:bg-neutral-700",
        className,
      )}
    />
  );
});
