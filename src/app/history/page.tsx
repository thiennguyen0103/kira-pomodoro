import Link from "next/link";

import { PageFrame } from "@/components/layout/page-frame";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { cn } from "cn";

export default function HistoryPage() {
  return (
    <PageFrame
      eyebrow="History"
      title="Recorded focus"
      description="A finished focus session shows the skill, when it ended, and the time the server saved. Pauses and breaks are not added."
    >
      <Empty className="min-h-64 justify-center rounded-3xl border-dashed bg-card/70 py-14">
        <EmptyTitle>No recorded sessions</EmptyTitle>
        <EmptyDescription>
          Complete a focus session and this list fills from your account.
        </EmptyDescription>
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-3")}>
          Go to practice
        </Link>
      </Empty>
    </PageFrame>
  );
}
