import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InboxIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const meta = {
  title: "UI/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Placeholder for a list with nothing to show. Compose `EmptyMedia`, `EmptyTitle`, and `EmptyDescription`. Add an action when the next step is obvious.",
      },
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoSessions: Story = {
  render: () => (
    <Empty className="max-w-sm">
      <EmptyMedia>
        <InboxIcon />
      </EmptyMedia>
      <EmptyTitle>No sessions yet</EmptyTitle>
      <EmptyDescription>Ready when you are.</EmptyDescription>
      <Button size="sm" className="mt-2">
        Start focus
      </Button>
    </Empty>
  ),
};
