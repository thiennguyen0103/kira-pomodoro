import type { ReactNode } from "react";
import { cn } from "cn";

type RankingRowProps = {
  rank: number;
  name: string;
  detail?: string;
  hours: string;
  avatar: ReactNode;
  highlight?: boolean;
  className?: string;
};

function RankingRow({
  rank,
  name,
  detail,
  hours,
  avatar,
  highlight = false,
  className,
}: RankingRowProps) {
  return (
    <div
      data-slot="ranking-row"
      className={cn(
        "flex items-center justify-between gap-3 rounded-md border p-2.5",
        highlight
          ? "border-primary/30 bg-primary-subtle/40"
          : "border-border bg-background",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "w-5 text-center font-mono text-xs font-bold tabular-nums",
            highlight ? "text-primary" : "text-muted-foreground",
          )}
        >
          {rank}
        </span>
        {avatar}
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">
            {name}
          </p>
          {detail ? (
            <p className="truncate text-[10px] text-muted-foreground">
              {detail}
            </p>
          ) : null}
        </div>
      </div>
      <span
        className={cn(
          "shrink-0 font-mono text-xs font-bold tabular-nums",
          highlight ? "text-primary" : "text-muted-foreground",
        )}
      >
        {hours}
      </span>
    </div>
  );
}

export { RankingRow };
export type { RankingRowProps };
