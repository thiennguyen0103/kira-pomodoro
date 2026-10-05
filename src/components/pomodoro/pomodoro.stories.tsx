import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  CheckIcon,
  CopyIcon,
  MusicIcon,
  Share2Icon,
  TerminalIcon,
} from "lucide-react";

import { AchievementCard } from "@/components/pomodoro/achievement-card";
import { PrivacyControlRow } from "@/components/pomodoro/privacy-control-row";
import { RankingRow } from "@/components/pomodoro/ranking-row";
import { SessionItem } from "@/components/pomodoro/session-item";
import { SkillCard } from "@/components/pomodoro/skill-card";
import { TimerDisplay } from "@/components/pomodoro/timer-display";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Pomodoro/Components",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const TimerStates: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <TimerDisplay
        phase="idle"
        time="25:00"
        caption="Programming • Standard"
        meta="Interval 1 of 4"
      />
      <TimerDisplay
        phase="focus"
        time="18:42"
        caption="Distraction-free active"
        meta="18:42 remaining"
      />
      <TimerDisplay
        phase="paused"
        time="12:30"
        caption="Timer halted"
        meta="06:18 paused"
      />
      <TimerDisplay
        phase="break"
        time="04:12"
        caption="Resting • Hours not tracked"
        meta="04:12 left"
      />
    </div>
  ),
};

export const Skill: Story = {
  render: () => (
    <div className="max-w-sm">
      <SkillCard
        name="Programming"
        description="Systems architecture and TypeScript"
        icon={<TerminalIcon />}
        accumulated="240 hrs accumulated"
        goal="500 hrs goal (48%)"
        progress={48}
        footer={
          <>
            <span>Last session: Yesterday (50m)</span>
            <Button variant="link" className="h-auto px-0">
              Log
            </Button>
          </>
        }
      />
    </div>
  ),
};

export const Privacy: Story = {
  render: () => (
    <div className="max-w-md space-y-3 rounded-lg border border-border bg-card p-5 shadow-subtle">
      <PrivacyControlRow
        title="Weekly leaderboard"
        description="Show anonymous focus hours on the optional board."
      />
      <PrivacyControlRow
        title="Public milestone sharing"
        description="Allow exportable cards at 100-hour goals."
        defaultChecked
      />
    </div>
  ),
};

export const Sessions: Story = {
  render: () => (
    <div className="max-w-md space-y-2">
      <SessionItem
        title="Programming"
        when="Yesterday • 10:30 AM"
        duration="+50m"
        intervals="2 intervals"
        icon={<CheckIcon />}
      />
      <SessionItem
        title="Guitar"
        when="May 18 • 4:15 PM"
        duration="+25m"
        intervals="1 interval"
        icon={<MusicIcon />}
        muted
      />
    </div>
  ),
};

export const Ranking: Story = {
  render: () => (
    <div className="max-w-md space-y-2">
      <RankingRow
        rank={4}
        name="Alex L."
        detail="3 active skills"
        hours="14.5 hrs"
        highlight
        avatar={
          <Avatar size="sm">
            <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
              You
            </AvatarFallback>
          </Avatar>
        }
      />
      <RankingRow
        rank={5}
        name="Minh K."
        detail="Opted-in participant"
        hours="12.0 hrs"
        avatar={
          <Avatar size="sm">
            <AvatarFallback className="text-[10px]">MK</AvatarFallback>
          </Avatar>
        }
      />
    </div>
  ),
};

export const Achievement: Story = {
  render: () => (
    <div className="max-w-md">
      <AchievementCard
        title="100 Hours of Deliberate Practice"
        skill="Programming"
        detail="Systems architecture"
        actions={
          <>
            <Button size="sm" variant="outline">
              <CopyIcon />
              Copy link
            </Button>
            <Button size="sm">
              <Share2Icon />
              Export card
            </Button>
          </>
        }
      />
    </div>
  ),
};
