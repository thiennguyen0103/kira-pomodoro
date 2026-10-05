"use client";

import { CoffeeIcon, PauseCircleIcon, PauseIcon, PlayIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

type TimerPhase = "idle" | "focus" | "paused" | "break";

type TimerDisplayProps = {
  phase: TimerPhase;
  time: string;
  caption: string;
  status?: string;
  meta?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  className?: string;
};

const phaseBadge = {
  idle: { variant: "secondary", label: "Idle" },
  focus: { variant: "default", label: "Focus running" },
  paused: { variant: "warning", label: "Paused" },
  break: { variant: "break", label: "Break interval" },
} as const;

function TimerDisplay({
  phase,
  time,
  caption,
  status,
  meta,
  onPrimary,
  onSecondary,
  primaryLabel,
  secondaryLabel,
  className,
}: TimerDisplayProps) {
  const badge = phaseBadge[phase];
  const primary =
    primaryLabel ??
    (phase === "focus"
      ? "Pause"
      : phase === "paused"
        ? "Resume focus"
        : phase === "break"
          ? "Take break"
          : "Start focus session");
  const secondary =
    secondaryLabel ??
    (phase === "focus" ? "End" : phase === "idle" ? undefined : "Skip");

  return (
    <section
      data-slot="timer-display"
      data-phase={phase}
      className={cn(
        "flex flex-col justify-between gap-4 rounded-lg border bg-card p-5 shadow-subtle",
        phase === "focus" && "border-2 border-primary/40",
        phase === "paused" && "border-warning/40",
        phase === "break" && "border-2 border-break/40",
        phase === "idle" && "border-border",
        className,
      )}
    >
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge variant={badge.variant} className="uppercase tracking-wide">
            {phase === "focus" ? (
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            ) : null}
            {phase === "paused" ? <PauseCircleIcon /> : null}
            {phase === "break" ? <CoffeeIcon /> : null}
            {status ?? badge.label}
          </Badge>
          {meta ? (
            <span className="font-mono text-[11px] text-muted-foreground">
              {meta}
            </span>
          ) : null}
        </div>
        <div
          className={cn(
            "rounded-md border px-3 py-4 text-center",
            phase === "idle" && "border-border bg-background",
            phase === "focus" && "border-primary/20 bg-primary-subtle/40",
            phase === "paused" && "border-warning/20 bg-warning-subtle/40",
            phase === "break" && "border-break/20 bg-break-subtle/50",
          )}
        >
          <p
            className={cn(
              "font-mono text-4xl font-medium tracking-tight text-foreground tabular-nums",
              phase === "paused" && "opacity-80",
              phase === "break" && "text-break",
            )}
          >
            {time}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">{caption}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="h-11 flex-1"
          variant={
            phase === "focus"
              ? "outline"
              : phase === "break"
                ? "break"
                : "default"
          }
          onClick={onPrimary}
        >
          {phase === "focus" ? (
            <PauseIcon />
          ) : phase === "break" ? (
            <CoffeeIcon />
          ) : (
            <PlayIcon />
          )}
          {primary}
        </Button>
        {secondary ? (
          <Button className="h-11" variant="outline" onClick={onSecondary}>
            {secondary}
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export { TimerDisplay };
export type { TimerDisplayProps, TimerPhase };
