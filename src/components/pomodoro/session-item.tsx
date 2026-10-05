import type { ReactNode } from "react";
import { cn } from "cn";

type SessionItemProps = {
  title: string;
  when: string;
  duration: string;
  intervals: string;
  icon: ReactNode;
  muted?: boolean;
  className?: string;
};

function SessionItem({
  title,
  when,
  duration,
  intervals,
  icon,
  muted = false,
  className,
}: SessionItemProps) {
  return (
    <div
      data-slot="session-item"
      className={cn(
        "flex items-center justify-between gap-3 rounded-md border border-border bg-background p-3",
        muted && "opacity-75",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary [&_svg]:size-4">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">
            {title}
          </p>
          <p className="text-[11px] text-muted-foreground">{when}</p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-mono text-xs font-semibold text-primary tabular-nums">
          {duration}
        </p>
        <p className="text-[10px] text-muted-foreground">{intervals}</p>
      </div>
    </div>
  );
}

export { SessionItem };
export type { SessionItemProps };
