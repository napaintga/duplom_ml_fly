import type { InputHTMLAttributes, PropsWithChildren } from "react";

export const Input = ({
  className,
  ...props
}: PropsWithChildren<InputHTMLAttributes<HTMLInputElement>>) => (
  <input
    className={[
      "w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
      className
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  />
);
