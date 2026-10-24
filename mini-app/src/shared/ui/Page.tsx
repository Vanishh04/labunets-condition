import type { ReactNode } from "react";

type PageProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Page({ title, subtitle, children }: PageProps) {
  return (
    <section className="page">
      <header className="page-head">
        <p className="eyebrow">Labunets Condition</p>
        <h1>{title}</h1>
        {subtitle ? <p className="page-sub">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}
