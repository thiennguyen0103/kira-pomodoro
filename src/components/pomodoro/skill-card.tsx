import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "cn";

type SkillCardProps = {
  name: string;
  description?: string;
  icon: ReactNode;
  status?: string;
  accumulated: string;
  goal: string;
  progress: number;
  tone?: "primary" | "break";
  footer?: ReactNode;
  className?: string;
};

function SkillCard({
  name,
  description,
  icon,
  status = "In progress",
  accumulated,
  goal,
  progress,
  tone = "primary",
  footer,
  className,
}: SkillCardProps) {
  return (
    <article
      data-slot="skill-card"
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-subtle",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <span className="font-mono text-xs text-muted-foreground">Skill</span>
        <Badge variant={tone === "break" ? "break" : "default"}>{status}</Badge>
      </div>
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-md [&_svg]:size-5",
            tone === "break"
              ? "bg-break-subtle text-break"
              : "bg-primary-subtle text-primary",
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm leading-tight font-bold text-foreground">
            {name}
          </h3>
          {description ? (
            <p className="mt-0.5 text-xs leading-normal text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-3 text-xs">
          <span className="font-mono font-semibold text-foreground tabular-nums">
            {accumulated}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            {goal}
          </span>
        </div>
        <Progress value={progress} tone={tone} className="gap-0" />
      </div>
      {footer ? (
        <div className="flex items-center justify-between gap-3 border-t border-border pt-2 text-xs text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </article>
  );
}

export { SkillCard };
export type { SkillCardProps };
