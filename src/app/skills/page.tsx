import Link from "next/link";

import { PageFrame } from "@/components/layout/page-frame";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "cn";

export default function SkillsPage() {
  return (
    <PageFrame
      eyebrow="Skills"
      title="What you practice"
      description="Each skill has one lifetime goal. Archived skills leave the list, and their recorded time stays in your total."
    >
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Empty className="min-h-56 justify-center rounded-3xl border-dashed bg-card/70 py-12">
          <EmptyTitle>No skills yet</EmptyTitle>
          <EmptyDescription>
            Add a skill before you start the timer.
          </EmptyDescription>
        </Empty>
        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle>New skill</CardTitle>
            <CardDescription>
              The name is 1–80 characters. The goal is 1–10,000 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Field>
              <Label htmlFor="skill-name">Skill name</Label>
              <Input id="skill-name" name="skill-name" disabled />
              <FieldDescription>
                An active skill cannot reuse a name you already use.
              </FieldDescription>
            </Field>
            <Field>
              <Label htmlFor="skill-goal">Lifetime goal in hours</Label>
              <Input
                id="skill-goal"
                name="skill-goal"
                inputMode="numeric"
                disabled
              />
              <FieldDescription>
                A later goal change does not erase recorded time.
              </FieldDescription>
            </Field>
            <Link
              href="/sign-in?next=/skills"
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              Sign in to add a skill
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageFrame>
  );
}
