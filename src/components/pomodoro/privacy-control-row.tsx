"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "cn";

type PrivacyControlRowProps = {
  title: string;
  description: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

function PrivacyControlRow({
  title,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
}: PrivacyControlRowProps) {
  return (
    <div
      data-slot="privacy-control-row"
      className={cn("flex items-start justify-between gap-3", className)}
    >
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs leading-normal text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        size="sm"
        className="mt-0.5"
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={title}
      />
    </div>
  );
}

export { PrivacyControlRow };
export type { PrivacyControlRowProps };
