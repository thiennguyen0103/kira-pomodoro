"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { TimerDisplay } from "@/components/pomodoro/timer-display";

const steps = [
  {
    href: "/sign-in",
    title: "Sign in",
    text: "Google opens your private account. Your email stays off every public screen.",
  },
  {
    href: "/skills",
    title: "Add a skill",
    text: "Give it a name and one lifetime hour goal. Changing the goal keeps the time you already recorded.",
  },
  {
    href: "/",
    title: "Focus",
    text: "Start a 25-minute focus yourself. The 5-minute break starts only when you choose it.",
  },
  {
    href: "/history",
    title: "Saved progress",
    text: "Finished focus time appears here after the server records it. Breaks add nothing.",
  },
  {
    href: "/ranking",
    title: "Share if you want",
    text: "Weekly ranking and public achievements stay off until you turn each one on.",
  },
] as const;

export function PracticeScreen() {
  const router = useRouter();

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
      <div className="rounded-3xl bg-primary-subtle/70 p-2 shadow-card">
        <TimerDisplay
          className="rounded-2xl border-transparent shadow-none"
          phase="idle"
          time="25:00"
          caption="Focus • not started"
          meta="Break 05:00"
          primaryLabel="Choose a skill"
          onPrimary={() => {
            router.push("/skills");
          }}
        />
      </div>
      <ol className="relative flex flex-col">
        <span
          aria-hidden
          className="absolute top-5 bottom-5 left-5 w-px bg-border"
        />
        {steps.map((step, index) => (
          <li key={step.title}>
            <Link
              href={step.href}
              className="group relative flex min-h-11 items-start gap-4 rounded-2xl px-2 py-3 transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full bg-card font-mono text-xs text-primary ring-1 ring-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
                {index + 1}
              </span>
              <span>
                <span className="block text-sm font-medium text-foreground">
                  {step.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {step.text}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
