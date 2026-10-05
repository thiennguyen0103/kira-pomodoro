import type { ReactNode } from "react";
import { LeafIcon } from "lucide-react";
import { cn } from "cn";

type AchievementCardProps = {
  title: string;
  skill: string;
  detail?: string;
  badge?: string;
  verifiedLabel?: string;
  actions?: ReactNode;
  className?: string;
};

function AchievementCard({
  title,
  skill,
  detail,
  badge = "100 Hours Club",
  verifiedLabel = "Quiet Focus • Verified",
  actions,
  className,
}: AchievementCardProps) {
  return (
    <article
      data-slot="achievement-card"
      className={cn("flex flex-col gap-3", className)}
    >
      <div className="space-y-3 rounded-md border border-primary/20 bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <LeafIcon className="size-3.5" />
            Kira Milestone
          </p>
          <span className="font-mono text-[10px] text-muted-foreground">
            {badge}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Skill:{" "}
            <strong className="font-semibold text-foreground">{skill}</strong>
            {detail ? ` • ${detail}` : null}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
          <span>{verifiedLabel}</span>
          <span className="font-mono font-medium text-primary">
            kirapomodoro.app
          </span>
        </div>
      </div>
      {actions ? <div className="flex justify-end gap-2">{actions}</div> : null}
    </article>
  );
}

export { AchievementCard };
export type { AchievementCardProps };
