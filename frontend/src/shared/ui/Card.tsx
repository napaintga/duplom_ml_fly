import type { HTMLAttributes, PropsWithChildren } from "react";

export const Card = ({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div
    className={[
      "rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
      className
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </div>
);
