import Link from "next/link";

import { PageFrame } from "@/components/layout/page-frame";
import { PrivacyControlRow } from "@/components/pomodoro/privacy-control-row";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { cn } from "cn";

export default function RankingPage() {
  return (
    <PageFrame
      eyebrow="Ranking"
      title="Share only what you choose"
      description="Both controls stay off. Weekly ranking shows a display name, rank, and focus time for this week. A public achievement shows a display name, lifetime focus, and active skills."
    >
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle>Your choices</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <PrivacyControlRow
              title="Weekly ranking"
              description="Include recorded focus for this week on the public board."
              checked={false}
              disabled
            />
            <PrivacyControlRow
              title="Public achievements"
              description="Show lifetime focus and active skills on a public page."
              checked={false}
              disabled
            />
            <Link
              href="/sign-in?next=/ranking"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full",
              )}
            >
              Sign in to change sharing
            </Link>
          </CardContent>
        </Card>
        <Empty className="min-h-64 justify-center rounded-3xl border-dashed bg-card/70 py-14">
          <EmptyTitle>The board for this week is empty</EmptyTitle>
          <EmptyDescription>
            Names appear here only after someone turns ranking on and records
            focus time this week.
          </EmptyDescription>
        </Empty>
      </div>
    </PageFrame>
  );
}
