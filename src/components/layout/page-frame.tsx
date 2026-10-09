import type { ReactNode } from "react";

type PageFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PageFrame({
  eyebrow,
  title,
  description,
  children,
}: PageFrameProps) {
  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,var(--primary-subtle),transparent_68%)]"
      />
      <header className="relative max-w-2xl">
        <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-medium tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </header>
      <div className="relative">{children}</div>
    </main>
  );
}
