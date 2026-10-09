import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Kira Pomodoro
        </Link>
        <Link
          href="/sign-in"
          className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Account
        </Link>
      </div>
    </header>
  );
}
