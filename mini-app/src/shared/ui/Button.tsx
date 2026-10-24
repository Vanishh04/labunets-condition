import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "gold" | "navy" | "ghost" | "danger";
  children: ReactNode;
};

export function Button({
  variant = "gold",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={["btn", `btn-${variant}`, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
